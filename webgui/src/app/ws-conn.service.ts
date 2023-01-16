import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class WsConnService {
  ws_port = '8764';
  ws_ip = '127.0.0.1'

  msgPublisher: Subject<any> = new Subject<any>();

  subject = webSocket('ws://'+ this.ws_ip + ':' + this.ws_port);
  ws_opened: boolean = false;
  last_recv: number = 0;

  tryconnect(): void {
    this.logservice.dlog('Try connect...')
    this.subject.unsubscribe()
    this.subject = webSocket('ws://'+ this.ws_ip + ':' + this.ws_port);
    this.subject.subscribe({
      next: msg => this.recv_with_websocket(msg),
      error: err => {
        this.logservice.dlog('Websocket connection error')
        this.ws_opened = false;
      },
      complete: () => {
        this.logservice.dlog('Websocket connection complete(end)')
        this.ws_opened = false;
      }
    });
  }

  set_port(port: string) {
    this.logservice.dlog('Port set to ' + port);
    this.ws_port = port;
    this.tryconnect();
  }

  send_with_websocket(msg: any){
    this.logservice.dlog('Msg Send to Backend '
      + msg.request_type);
    this.subject.next(msg);
  }

  recv_with_websocket(msg: any){
    this.msgPublisher.next(msg);
    console.log(msg);
    this.last_recv = Date.now()
    this.ws_opened = true;
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ws_loop(): Promise<void> {
    do {
      if (this.ws_opened == false) {
        console.log("Try Reopen WS");
        
        this.tryconnect()
        this.ws_opened = true;
        await this.sleep(5000);
      } else {
        console.log("Websocket Already Opened")
      }
      await this.sleep(3000);
    } while (1);
  }

  constructor(public logservice: LogService) { 
    console.log("Ws connection service start");
    this.tryconnect();
    this.ws_loop();
  }
}
