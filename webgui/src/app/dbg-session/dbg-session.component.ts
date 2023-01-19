import { Component, OnInit } from '@angular/core'
import { WsConnService } from '../ws-conn.service'
import { DbgElemText, DbgSession } from '../dbg-session'
@Component({
    selector: 'app-dbg-session',
    templateUrl: './dbg-session.component.html'
})
export class DbgSessionComponent implements OnInit {

    session: DbgSession = new DbgSession;

    ngOnInit(): void {

    }

    dbgmsg_handler(msg: any): void {
        switch (msg['request-type']) {
            case 'stream_log':
                console.log('stream log requested');
                break;
            case 'fixed_log':
                if (this.session.dbgElemTextMap.has(msg['id'])){
                    /* Update val */
                    let elem = this.session.dbgElemTextMap.get(msg['id']);
                    if (elem){
                        elem.text = msg['log'];
                    }
                } else {
                    /* Create val */
                    let telem = new DbgElemText;
                    telem.text = msg['log'];
                    telem.id = msg['id'];
                    this.session.dbgElemTextMap.set(msg['id'], telem);
                }
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