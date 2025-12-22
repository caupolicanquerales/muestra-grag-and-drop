import { TestBed } from '@angular/core/testing';

import { SseFileService } from './sse-file-service';

describe('SseFileService', () => {
  let service: SseFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SseFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
