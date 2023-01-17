import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { LogService } from '../log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html'
})
export class LogComponent implements OnInit {
  @Input() log : string = '';
  @ViewChild('logtextarea') logtextarea : ElementRef | undefined;

  autoscroll : boolean = true;
  logboxScrollHeight : number = 0;
  
  autoscroll_toggle(): void {
    this.autoscroll = this.autoscroll ? false : true;
    console.log('autoscroll ' + this.autoscroll)
  }

  clearlog() : void {
    this.log = '';
  }

  constructor(public logservice: LogService) { 
    console.log("Log service start");
    logservice.log_subject.subscribe(
      {next : (msg) => 
        {
          this.log += msg + '\n'
          
          if (this.autoscroll){
            var logarea : any = this.logtextarea?.nativeElement;
            if (logarea != undefined)
              logarea.scrollTop = logarea.scrollHeight;
          }
        }
    })
  }

  ngOnInit(): void {

  }


}
