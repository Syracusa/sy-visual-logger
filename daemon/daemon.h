#ifndef DAEMON_H
#define DAEMON_H

#include "ringbuffer.h"

#define DLOG(...) do{ fprintf(stderr, "[Daemon] " __VA_ARGS__); }while(0);

#define WEBSOCKET_PORT 8764
#define DEFAULT_UDP_RECV_PORT 8765

typedef struct {
    uint16_t udp_port;

    RingBuffer* rbuf;
} DaemonContext;

extern DaemonContext dctx;


#define MAX_MSGLEN 4000

#endif