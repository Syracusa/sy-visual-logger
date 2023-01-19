import { Component, OnInit } from '@angular/core'
import { WsConnService } from '../ws-conn.service'

@Component({
    selector: 'app-dbg-session',
    templateUrl: './dbg-session.component.html'
})
export class DbgSessionComponent implements OnInit {
    ngOnInit(): void {

    }

    dbgmsg_handler(msg: any): void {
        switch (msg['request-type']) {
            case 'stream_log':
                console.log('stream log requested');
                break;
            case 'fixed_log':

                console.log('fixed log requested');
                break;

            default:
                console.log('Can\'t handle reqtype ' + msg['request-type']);
                break;
        }
    }

    constructor(public wcs: WsConnService) {
        wcs.msgPublisher.subscribe(
            {
                next: (msg) => {
                    this.dbgmsg_handler(msg);
                }
            }
        );
    }
}