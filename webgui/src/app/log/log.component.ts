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
  @Input() background_color = '#111111';

  @Input() id: string = 'default';
  @Input() log: string = '';

  @ViewChild('logtextarea') logtextarea: ElementRef | undefined;
  
  lgs: LogService | undefined;
  autoscroll: boolean = true;
  logboxScrollHeight: number = 0;

  autoscroll_toggle(): void {
    this.autoscroll = this.autoscroll ? false : true;
    console.log('autoscroll ' + this.autoscroll)
  }

  clearlog(): void {
    this.log = '';
  }

  ngOnInit(): void {
      
  }
}
