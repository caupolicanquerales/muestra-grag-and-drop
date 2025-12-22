import { TestBed } from '@angular/core/testing';

import { ConvertBase64ByteService } from './convert-base64-byte-service';

describe('ConvertBase64ByteService', () => {
  let service: ConvertBase64ByteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertBase64ByteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
