import { Component } from '@angular/core';
import { BgservService } from './bgserv.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-boilerplate';

  constructor(public bgserv: BgservService) {
   }

}
