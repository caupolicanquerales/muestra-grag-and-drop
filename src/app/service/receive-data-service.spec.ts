import { TestBed } from '@angular/core/testing';

import { ReceiveDataService } from './receive-data-service';
import { SseService } from './sse-service';
import { SseFileService } from './sse-file-service';
import { SseImageService } from './sse-image-service';
import { SseBasicTemplateService } from './sse-basic-template-service';
import { of } from 'rxjs';

describe('ReceiveDataService', () => {
  let service: ReceiveDataService;
  class SseMock {
    connect = jasmine.createSpy('connect').and.returnValue(of({}));
    connectPost = jasmine.createSpy('connectPost').and.returnValue(of({}));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SseService, useClass: SseMock },
        { provide: SseFileService, useClass: SseMock },
        { provide: SseImageService, useClass: SseMock },
        { provide: SseBasicTemplateService, useClass: SseMock }
      ]
    });
    service = TestBed.inject(ReceiveDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getDataStreamFile delegates to SseFileService.connect with the correct URL', () => {
    const sseFile = TestBed.inject(SseFileService) as unknown as SseMock;
    service.getDataStreamFile().subscribe();
    expect(sseFile.connect).toHaveBeenCalledWith('http://localhost:8080/qdrant/stream-file');
  });

  it('getDataStreamBasicTemplate delegates to SseBasicTemplateService.connect', () => {
    const sseBT = TestBed.inject(SseBasicTemplateService) as unknown as SseMock;
    service.getDataStreamBasicTemplate().subscribe();
    expect(sseBT.connect).toHaveBeenCalledWith('http://localhost:8081/basic-template/stream-basic-template');
  });

  it('getDataStreamImage delegates to SseImageService.connect', () => {
    const sseImg = TestBed.inject(SseImageService) as unknown as SseMock;
    service.getDataStreamImage().subscribe();
    expect(sseImg.connect).toHaveBeenCalledWith('http://localhost:8081/image/stream-image');
  });

  it('getDataStream delegates to SseService.connectPost with payload', () => {
    const sse = TestBed.inject(SseService) as unknown as SseMock;
    const payload = { prompt: 'x' } as any;
    service.getDataStream(payload).subscribe();
    expect(sse.connectPost).toHaveBeenCalledWith('http://localhost:8080/generation/chat-stream', payload);
  });
});
