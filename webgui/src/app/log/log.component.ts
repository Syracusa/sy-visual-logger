import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { LogService } from '../log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html'
})
export class LogComponent implements OnInit {
  // @Input() logbox_style = "";
  @Input() width = 100;
  @Input() height = 100;
  @Input() left = 10;
  @Input() top = 10;
  @Input() background_color = '#EEEEEE';

  @Input() id: string = 'default';
  _log: string = '';

  @ViewChild('logtextarea') logtextarea: ElementRef | undefined;

  @Input() set log(value: string) {
    this._log = value;

    if (this.autoscroll){
      var logarea : any = this.logtextarea?.nativeElement;
      if (logarea != undefined)
        logarea.scrollTop = logarea.scrollHeight;
    }
  }

  lgs: LogService | undefined;
  autoscroll: boolean = true;
  logboxScrollHeight: number = 0;

  autoscroll_toggle(): void {
    this.autoscroll = this.autoscroll ? false : true;
    console.log('autoscroll ' + this.autoscroll)
  }

  clearlog(): void {
    this._log = '';
  }

  ngOnInit(): void {
      
  }
}
