import { Injectable } from '@angular/core';
import { SseService } from './sse-service';
import { Observable } from 'rxjs';
import { ServerSentEvent } from '../models/server-sent-event';
import { DataMessage } from '../models/data-message';
import { SseFileService } from './sse-file-service';
import { SseImageService } from './sse-image-service';
import { SseBasicTemplateService } from './sse-basic-template-service';

@Injectable({
  providedIn: 'root'
})
export class ReceiveDataService {

  private readonly DATA_URL = 'http://localhost:8080/generation/stream';

  private readonly DATA_URL_FILE = 'http://localhost:8080/qdrant/stream-file';

  private readonly DATA_URL_BASIC_TEMPLATE = 'http://localhost:8081/basic-template/stream-basic-template';

  private readonly DATA_URL_IMAGE = 'http://localhost:8081/image/stream-image';

  constructor(private sseService: SseService, private sseFileService: SseFileService,
    private sseImageService: SseImageService, private sseBasicTemplateService: SseBasicTemplateService) {}

  public getDataStream(): Observable<ServerSentEvent<DataMessage>> {
      return this.sseService.connect(this.DATA_URL);
  }
  
  public getDataStreamFile(): Observable<ServerSentEvent<DataMessage>> {
      return this.sseFileService.connect(this.DATA_URL_FILE);
  }

  public getDataStreamBasicTemplate(): Observable<any> {
      return this.sseBasicTemplateService.connect(this.DATA_URL_BASIC_TEMPLATE);
  }

  public getDataStreamImage(): Observable<any> {
      return this.sseImageService.connect(this.DATA_URL_IMAGE);
  }

}
