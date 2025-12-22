import { TestBed } from '@angular/core/testing';

import { SseImageService } from './sse-image-service';

describe('SseImageService', () => {
  let service: SseImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SseImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
