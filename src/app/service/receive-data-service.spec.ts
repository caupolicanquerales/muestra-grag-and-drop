import { TestBed } from '@angular/core/testing';

import { ReceiveDataService } from './receive-data-service';

describe('ReceiveDataService', () => {
  let service: ReceiveDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiveDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
