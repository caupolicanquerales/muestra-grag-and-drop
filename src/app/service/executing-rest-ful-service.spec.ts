import { TestBed } from '@angular/core/testing';

import { ExecutingRestFulService } from './executing-rest-ful-service';

describe('ExecutingRestFulService', () => {
  let service: ExecutingRestFulService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutingRestFulService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
