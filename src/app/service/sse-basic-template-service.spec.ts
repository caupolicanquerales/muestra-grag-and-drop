import { TestBed } from '@angular/core/testing';

import { SseBasicTemplateService } from './sse-basic-template-service';

describe('SseBasicTemplateService', () => {
  let service: SseBasicTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SseBasicTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
