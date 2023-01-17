#include <stdio.h>

#include <libwebsockets.h>

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
            lws_callback_on_writable_all_protocol( lws_get_context( wsi ), lws_get_protocol( wsi ) );
            break;
		case LWS_CALLBACK_SERVER_WRITEABLE:
			/* TBD */
			break;
        default:
            fprintf(stderr, "Unhandled callback %d\n", reason);
            break;
    }
}

int main()
{
    printf("Start daemon...\n");

    static struct lws_protocols protocols[] = {
        {"http-only", http_callback, 0, 0},
        { NULL, NULL, 0, 0 } /* terminator */ };

    struct lws_context_creation_info info;
    memset(&info, 0, sizeof(info));

    info.port = 8764;
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