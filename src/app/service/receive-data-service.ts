import { Injectable } from '@angular/core';
import { SseService } from './sse-service';
import { Observable } from 'rxjs';
import { ServerSentEvent } from '../models/server-sent-event';
import { DataMessage } from '../models/data-message';
import { SseFileService } from './sse-file-service';
import { SseImageService } from './sse-image-service';
import { SseBasicTemplateService } from './sse-basic-template-service';
import { GenerationDataInterface } from '../models/generation-data-interface';
import { GenerationDataAgentInterface } from '../models/generation-data-agent-interface';
import { GenerationImageInterface } from '../models/generation-image-interface';
import { GenerationTemplateJsonInfoInterface } from '../models/generation-template-json-info-interface';

@Injectable({
  providedIn: 'root'
})
export class ReceiveDataService {

  private readonly DATA_URL_CHAT = 'http://localhost:8080/generation/chat-stream';
  
  private readonly DATA_URL_FILE = 'http://localhost:8080/qdrant/stream-file';

  private readonly DATA_URL_BASIC_TEMPLATE = 'http://localhost:8090/sub-agent-basic-template/chat-stream';

  private readonly DATA_URL_BASIC_TEMPLATE_JSON = 'http://localhost:8095/sub-agent-layout-analyzer/chat-stream';

  private readonly DATA_URL_IMAGE_AGENT = 'http://localhost:8086/sub-agent-image/stream-image';

  private readonly DATA_URL_SUB_CHAT_AGENT_MANAGER = 'http://localhost:8085/sub-agent-manager-chat/chat-stream';

  constructor(private sseService: SseService, private sseFileService: SseFileService,
    private sseImageService: SseImageService, private sseBasicTemplateService: SseBasicTemplateService) {}
  
  public getDataStreamFile(): Observable<ServerSentEvent<DataMessage>> {
      return this.sseFileService.connect(this.DATA_URL_FILE);
  }

  public getDataStreamBasicTemplate(body: FormData = new FormData()): Observable<any> {
      return this.sseBasicTemplateService.connect(this.DATA_URL_BASIC_TEMPLATE, body);
  }

  public getDataStreamBasicTemplateJson(body: GenerationTemplateJsonInfoInterface): Observable<any> {
      return this.sseBasicTemplateService.connect(this.DATA_URL_BASIC_TEMPLATE_JSON, body);
  }

  public getDataStream(prompt:GenerationDataInterface): Observable<ServerSentEvent<DataMessage>> {
      return this.sseService.connectPost(this.DATA_URL_CHAT,prompt);
  }

  public getDataStreamAgent(prompt:GenerationDataAgentInterface): Observable<ServerSentEvent<DataMessage>> {
      return this.sseService.connectPost(this.DATA_URL_SUB_CHAT_AGENT_MANAGER,prompt);
  }

  public getDataStreamImageAgent(prompt: GenerationImageInterface): Observable<any> {
      return this.sseImageService.connect(this.DATA_URL_IMAGE_AGENT, prompt);
  }
}
