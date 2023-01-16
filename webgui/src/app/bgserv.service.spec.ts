import { TestBed } from '@angular/core/testing';

import { BgservService } from './bgserv.service';

describe('BgservService', () => {
  let service: BgservService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BgservService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
