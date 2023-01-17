#include <stdio.h>
#include <stdio.h>
#include <errno.h>
#include <string.h>

#include <linux/socket.h>
#include <arpa/inet.h>

#define UDP_SEND_PORT 8765

int main()
{
    printf("test1\n");

    const char* m1 =
        "{"
        "\"request-type\" : \"stream_log\","
        "\"session-id\" : \"s1\","
        "\"log\" : \"Test log 1\""
        "}";

    const char* m2 =
        "{"
        "\"request-type\" : \"fixed_log\","
        "\"session-id\" : \"s1\","
        "\"elem-id\" : \"fl1\","
        "\"pos-x\" : \"10\","
        "\"pos-y\" : \"20\","
        "\"log\" : \"Test fixed log 1\""
        "}";

    /* Open socket */
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock < 1){
        fprintf(stderr, "socket() failed\n");
    } else {
        fprintf(stderr, "socket() : %d\n", sock);        
    }

    struct sockaddr_in sockadr;
    memset(&sockadr, 0, sizeof(sockadr));

    sockadr.sin_family = AF_INET;
    sockadr.sin_port = htons(UDP_SEND_PORT);
    sockadr.sin_addr.s_addr = inet_addr("127.0.0.1");

    socklen_t slen = sizeof(sockadr);
    ssize_t sendlen;

    sendlen = sendto(sock, m1, strlen(m1), 0, (struct sockaddr*)&sockadr, slen);

    if (sendlen < 0)
    {
        fprintf(stderr, "Socket send fail(msg 1) %ld(%s)\n", sendlen, strerror(errno));
    }

    sendlen = sendto(sock, m2, strlen(m2), 0, (struct sockaddr*)&sockadr, slen);
    if (sendlen < 0)
    {
        fprintf(stderr, "Socket send fail(msg 2) %ld(%s)\n", sendlen, strerror(errno));
    }
}