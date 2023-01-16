import { Injectable } from '@angular/core';
import { WsConnService } from './ws-conn.service';

@Injectable({
  providedIn: 'root'
})
export class BgservService {

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async do_heartbeat(wsconn: WsConnService) : Promise<void> {
    while(1){
      wsconn.send_with_websocket({'request_type' : 'hello'});
      await this.sleep(1000);
    }

  }

  constructor(public wsconn: WsConnService) {
    this.do_heartbeat(wsconn);
   }
}
