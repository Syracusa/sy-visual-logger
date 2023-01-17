#include <stdio.h>
#include <pthread.h>
#include <errno.h>

#include <linux/socket.h>
#include <arpa/inet.h>

#include <libwebsockets.h>
#include "daemon.h"

DaemonContext dctx;

void hexdump(void* data, int len, FILE* stream)
{
    const int BYTE_INLINE = 16;
    char ascii_buf[BYTE_INLINE + 1];
    unsigned char* ptr = data;

    ascii_buf[BYTE_INLINE] = '\0';

    int linecount = 0;
    int lineoffset;
    for (int i = 0; i < len; i++)
    {
        lineoffset = i % BYTE_INLINE;

        /* Print offset if newline */
        if (lineoffset == 0)
            fprintf(stream, " %04x ", i);

        /* Add space at every 4 bytes.. */
        if (lineoffset % 4 == 0)
            fprintf(stream, " ");

        fprintf(stream, " %02x", ptr[i]);
        if ((ptr[i] < 0x20) || (ptr[i] > 0x7e))
            ascii_buf[lineoffset] = ' ';
        else
            ascii_buf[lineoffset] = ptr[i];

        /* Print ASCII if end of line */
        if (lineoffset == BYTE_INLINE - 1)        
{
            fprintf(stream, "  %s\n", ascii_buf);
            linecount++;

            /* Print additional newline at every 5 lines */
            if (linecount != 0 && linecount % 5 == 0)
                fprintf(stream, "\n");
        }
    }

    ascii_buf[lineoffset + 1] = '\0';
    fprintf(stream, " %s\n", ascii_buf);
}

static int send_buffered_data(struct lws* wsi)
{
    static unsigned char buf[LWS_SEND_BUFFER_PRE_PADDING + MAX_MSGLEN + LWS_SEND_BUFFER_POST_PADDING];

    uint16_t usz;
    int pres = RingBuffer_pop(dctx.rbuf, &usz, sizeof(usz));
    if (pres > 0) {
        RingBuffer_pop(dctx.rbuf, &buf[LWS_SEND_BUFFER_PRE_PADDING], usz);
    }

    lws_write(wsi, &buf[LWS_SEND_BUFFER_PRE_PADDING], usz, LWS_WRITE_TEXT);
}

static int http_callback(struct lws* wsi,
                         enum lws_callback_reasons reason,
                         void* user,
                         void* in,
                         size_t len)
{
    switch (reason)
    {
        case LWS_CALLBACK_RECEIVE:
            fprintf(stderr, "Receive callback. len %lu\n", len);
            hexdump(in, len, stderr);
            lws_callback_on_writable_all_protocol(lws_get_context(wsi), lws_get_protocol(wsi));
            break;
        case LWS_CALLBACK_SERVER_WRITEABLE:
            fprintf(stderr, "Server Writable!\n");
            send_buffered_data(wsi);
            break;
        case LWS_CALLBACK_FILTER_NETWORK_CONNECTION:
            fprintf(stderr, "LWS_CALLBACK_FILTER_NETWORK_CONNECTION\n");
            break;
        case LWS_CALLBACK_WS_PEER_INITIATED_CLOSE:
            fprintf(stderr, "LWS_CALLBACK_WS_PEER_INITIATED_CLOSE\n");
            break;
        case LWS_CALLBACK_CLOSED:
            fprintf(stderr, "LWS_CALLBACK_CLOSED\n");
            break;
        case LWS_CALLBACK_WSI_DESTROY:
            fprintf(stderr, "LWS_CALLBACK_WSI_DESTROY\n");
            break;
        default:
            fprintf(stderr, "Unhandled callback %d\n", reason);
            break;
    }
    return 0;
}

void *recv_routine(void *arg)
{
    /* Open socket */
    int sock = socket(AF_INET, SOCK_DGRAM, 0);

    { /* Set SO_REUSEADDR option */
        int opt_reuse = 1;
        int res = setsockopt(sock, SOL_SOCKET, SO_REUSEADDR,
                             (char *)&opt_reuse, sizeof(opt_reuse));
        if (res < 0)
        {
            fprintf(stderr, "Socket Option SO_REUSEADDR fail with %d(%s)\n",
                    res, strerror(errno));
            exit(2);
        }
    }

    { /* Bind address to socket*/
        struct sockaddr_in sockadr;
        memset(&sockadr, 0, sizeof(sockadr));

        sockadr.sin_family = AF_INET;
        sockadr.sin_port = htons(dctx.udp_port);
        sockadr.sin_addr.s_addr = INADDR_ANY;

        int res = bind(sock, (struct sockaddr *)&sockadr, sizeof(sockadr));
        if (res < 0)
        {
            fprintf(stderr, "Bind fail with %d(%s)\n",
                    res, strerror(errno));
            exit(2);
        }
    }

    unsigned char buf[MAX_MSGLEN];
    struct sockaddr_in sender_addr;
    socklen_t socklen = sizeof(struct sockaddr_in);

    while (1)
    {
        int rlen = recvfrom(sock, buf, MAX_MSGLEN,
                            0, (struct sockaddr *)&sender_addr, &socklen);
        if (rlen > 0)
        {
            fprintf(stderr, "Recv from socket. len : %d, from %s:%u\n", rlen, 
                    inet_ntoa(sender_addr.sin_addr), 
                    ntohs(sender_addr.sin_port));

            uint16_t usz = rlen;
            RingBuffer_push(dctx.rbuf, &usz, sizeof(usz));
            RingBuffer_push(dctx.rbuf, buf, rlen);
        }
    }
}

static void start_recv_udp()
{
    { /* Recv packet */
        pthread_t t;

        int res = pthread_create(&t, NULL, recv_routine, NULL /*arg*/);
        if (res < 0)
        {
            fprintf(stderr, "pthread_create fail!\n");
            exit(2);
        }
    }
}

static void init_context(int argc, char *argv[])
{
    memset(&dctx, 0x00, sizeof(dctx));
    if (argc == 2){
        dctx.udp_port = atoi(argv[1]);
    } else {
        dctx.udp_port = DEFAULT_UDP_RECV_PORT;
    }

    dctx.rbuf = RingBuffer_new(1024 * 1024 /* 1MB */);
}

int main(int argc, char *argv[])
{
    DLOG("Start daemon...\n");

    init_context(argc, argv);

    start_recv_udp();

    static struct lws_protocols protocols[] = {
        {"http-only", http_callback, 0, 0},
        { NULL, NULL, 0, 0 } /* terminator */ };

    struct lws_context_creation_info info;
    memset(&info, 0, sizeof(info));

    info.port = WEBSOCKET_PORT;
    info.protocols = protocols;
    info.uid = -1;
    info.gid = -1;

    struct lws_context* context = lws_create_context(&info);

    while (1)
    {
        lws_service(context, 1000000 /* 1 second */);
    }

    lws_context_destroy(context);
    return 0;
}