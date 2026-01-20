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

  it('base64ToBlob should convert base64 string to a Blob with correct type and size', () => {
    const base64 = 'SGVsbG8='; // "Hello"
    const blob = service.base64ToBlob(base64, 'text/plain');
    expect(blob).toBeTruthy();
    expect(blob.type).toBe('text/plain');
    expect(blob.size).toBe(5);
  });
});
