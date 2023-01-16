import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  log_subject : Subject<string> = new Subject<string>();
  
  constructor() { }

  dlog(msg: string) : void {
    this.log_subject.next(msg);
  }
}
