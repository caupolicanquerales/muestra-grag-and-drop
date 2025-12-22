import { TestBed } from '@angular/core/testing';

import { ServiceGeneral } from './service-general';

describe('ServiceGeneral', () => {
  let service: ServiceGeneral;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceGeneral);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
