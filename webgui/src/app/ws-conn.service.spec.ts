import { TestBed } from '@angular/core/testing';

import { WsConnService } from './ws-conn.service';

describe('WsConnService', () => {
  let service: WsConnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WsConnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
