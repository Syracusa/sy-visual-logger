import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  // log_subject : Subject<string> = new Subject<string>();
  
  stream_list = new Map<string, Subject<string>>;
  constructor() { }

  dlog(msg: string) : void {
    this.do_log('default', msg);
  }



  do_log(id:string, log:string) {
    let stream = this.get_stream(id);
    if (stream){
      stream.next(log);
    }
  }

  get_stream(id:string): Subject<string> | undefined{
    let stream: Subject<string> | undefined;
    stream = this.stream_list.get(id);

    if (!stream){
      stream = new Subject<string>;
      this.stream_list.set(id, stream);
    }

    return stream;
  }

}
