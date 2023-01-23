import { Component, OnInit } from '@angular/core';
import { DbgElemTextbox, DbgElemRect, DbgElemText, DbgSession } from '../dbg-session'
import { WsConnService } from '../ws-conn.service'
import { LogService } from '../log.service';

@Component({
    selector: 'app-sessionlist',
    templateUrl: './sessionlist.component.html'
})
export class SessionlistComponent implements OnInit {
    sessionList = new Map<string, DbgSession>;
    selected_session_id: string = "";
    lgs: LogService | undefined;

    constructor(public wcs: WsConnService,
        public logservice: LogService) {
        wcs.msgPublisher.subscribe(
            {
                next: (msg) => {
                    this.dbgmsg_handler(msg);
                }
            }
        );
        this.lgs = logservice;
    }

    get_session(id: string): DbgSession {
        let session = this.sessionList.get(id);
        if (session) {
            return session;
        } else {
            return new DbgSession;
        }
    }

    remove_seesion_by_id(id: string) {
        this.sessionList.delete(id);
    }

    dbgmsg_handler(msg: any): void {
        const session_id = msg['session-id'];
        let session: any;
        if (this.sessionList.has(msg['session-id'])) {
            session = this.sessionList.get(msg['session-id']);
        } else {
            session = new DbgSession;
            session.id = msg['session-id'];
            this.sessionList.set(msg['session-id'], session);
        }

        switch (msg['request-type']) {
            case 'fixed_log':
                if (session.dbgElemTextMap.has(msg['id'])) {
                    /* Update val */
                    let elem = session.dbgElemTextMap.get(msg['id']);
                    if (elem) {
                        elem.text = msg['log'];
                        console.log(msg['log']);
                    }
                } else {
                    /* Create val */
                    let telem = new DbgElemText;
                    telem.text = msg['log'];
                    telem.id = msg['elem-id'];

                    if ('pos-x' in msg)
                        telem.xpos = msg['pos-x'];

                    if ('pos-y' in msg)
                        telem.ypos = msg['pos-y'];

                    console.log('id : ' + telem.id + ' text : ' + telem.text);
                    session.dbgElemTextMap.set(telem.id, telem);
                }
                console.log('fixed log requested');
                break;
            case 'rect_log':
                let relem: DbgElemRect | undefined;
                if (session.dbgElemRectMap.has(msg['id'])) {
                    relem = session.dbgElemRectMap.get(msg['id']);
                } else {
                    relem = new DbgElemRect;
                    session.dbgElemRectMap.set(relem.id, relem);
                }
                if (relem) {
                    relem.id = msg['elem-id'];
                    if ('pos-x' in msg)
                        relem.xpos = msg['pos-x'];
                    if ('pos-y' in msg)
                        relem.ypos = msg['pos-y'];
                    if ('width' in msg)
                        relem.width = msg['width'];
                    if ('height' in msg)
                        relem.height = msg['height'];
                }
                break;
            case 'stream_logbox': {
                let tbelem: DbgElemTextbox | undefined;
                if (session.dbgElemTextboxMap.has[msg['id']]) {
                    tbelem = session.dbgElemTextboxMap.get[msg['id']];
                } else {
                    tbelem = new DbgElemTextbox;
                    session.dbgElemTextboxMap.set(tbelem.id, tbelem);
                }
                if (tbelem) {
                    tbelem.id = msg['elem-id'];
                    if ('pos-x' in msg)
                        tbelem.xpos = msg['pos-x'];
                    if ('pos-y' in msg)
                        tbelem.ypos = msg['pos-y'];
                    if ('width' in msg)
                        tbelem.width = msg['width'];
                    if ('height' in msg)
                        tbelem.height = msg['height'];
                }
                break;
            }
            case 'stream_log': {
                let tbelem: DbgElemTextbox | undefined;
                if (session.dbgElemTextboxMap.has[msg['id']]) {
                    tbelem = session.dbgElemTextboxMap.get[msg['id']];
                } 
                
                if (tbelem)
                    tbelem.text += msg['log'];
                console.log('stream log requested');
                break;
            }
            default:
                console.log('Can\'t handle reqtype ' + msg['request-type']);
                break;
        }
    }

    ngOnInit(): void {

    }
}