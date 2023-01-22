import { Component, OnInit, Input } from '@angular/core'

import { DbgElemText, DbgSession } from '../dbg-session'
@Component({
    selector: 'app-dbg-session',
    templateUrl: './dbg-session.component.html'
})
export class DbgSessionComponent implements OnInit {

    @Input() session: DbgSession = new DbgSession;

    ngOnInit(): void {

    }



}