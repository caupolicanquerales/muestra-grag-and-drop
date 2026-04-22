import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ChatBox } from '../chat-box/chat-box';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ServiceGeneral } from '../service/service-general';
import { GenerationDataAgentInterface } from '../models/generation-data-agent-interface';
import { getHeaderDialogToBasicTemplate, getSaveFormartBasicTemplate } from '../utils/dialog-parameters-utils';
import { SavePromptDbInterface } from '../models/save-prompt-db-interface';
import { TypePromptEnum } from '../enums/type-prompt-enum';
import { BasicTemplateInterface } from '../models/basic-template-interface';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';

@Component({
  selector: 'bill-agent-data',
  imports: [ChatBox],
  standalone: true,
  templateUrl: './bill-agent-data.html',
  styleUrl: './bill-agent-data.scss'
})
export class BillAgentData implements OnInit, OnDestroy{

  prompt: WritableSignal<string> = signal('');
  responseMessage: WritableSignal<string> = signal('');
  statusMessage: WritableSignal<boolean> = signal(false);
  titleData: string ="Agente";
  private destroy$ = new Subject<void>();
  showImage: WritableSignal<boolean> = signal(false);
  showTemplate: WritableSignal<boolean> = signal(false);
  base64String: WritableSignal<string> = signal('');
  htmlString: WritableSignal<string> = signal('');
  cssString: WritableSignal<string> = signal('');
  conversationId: string = this.generateId();
  itemsSavePrompt: Array<any>=[];
  headerDialog: Array<any>=[];

  constructor(private serviceGeneral: ServiceGeneral,
    private executingRestFulService: ExecutingRestFulService
  ){}
  
  ngOnInit(): void {
    this.subscribeUntilDestroyed(this.serviceGeneral.selectedPromptBill$, data => this.prompt.set(data));
    this.subscribeUntilDestroyed(this.serviceGeneral.statusMessage$, status => this.statusMessage.set(status));
    this.subscribeUntilDestroyed(this.serviceGeneral.responseMessagePrompt$, token => this.setResponseMessage(token));
    this.subscribeUntilDestroyed(this.serviceGeneral.imageGenerated$, image => this.setImageinChatBox(image));
    this.subscribeUntilDestroyed(this.serviceGeneral.basicTemplateGenerated$, template => this.setTemplateInChatBox(template));
  }

  ngOnDestroy(): void {
    this.serviceGeneral.setSelectedPromptBill("");
    this.showImage.set(false);
    this.showTemplate.set(false);
    this.base64String.set('');
    this.htmlString.set('');
    this.cssString.set('');
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  submitPrompt(): void {
    if (this.prompt().length >= 10) {
      this.statusMessage.set(false);
      this.responseMessage.set('');
      this.executingPrompt();      
    }
  }

  promptEmitter(value: string){
    this.prompt.set(value);
  }

  private executingPrompt(){
    const request= this.getRequestGenerationData();
    console.log(request);
    this.serviceGeneral.setActivateChatClientStreamAgent(request);
    setTimeout(() => {
      this.updatePromptToGenerateData();
    }, 50); 
  }

  private getRequestGenerationData():GenerationDataAgentInterface{
    return {
      prompt: this.prompt(),
      conversationId: this.conversationId
    }
  }

  private updatePromptToGenerateData(): void{
    this.prompt.set('');
    this.serviceGeneral.setResizeInput(true);
    this.serviceGeneral.setIsUploadingAnimation(true);
  }

  private subscribeUntilDestroyed<T>(obs: Observable<T>, handler: (v: T) => void) {
    obs.pipe(takeUntil(this.destroy$)).subscribe(handler);
  }

  private setImageinChatBox(image: string): void{
    if(image!=""){
      this.showImage.set(true);
      this.showTemplate.set(false);
      this.headerDialog= [];
      this.itemsSavePrompt= [];
      this.base64String.set(image);
    }
  }

  generateId(): string {
    return crypto.randomUUID();
  }

  setResponseMessage( token: string): void {
    this.showImage.set(false);
    this.showTemplate.set(false);
    this.headerDialog= [];
    this.itemsSavePrompt= [];
    this.responseMessage.update(currentValue => currentValue + token);
  }

  private setTemplateInChatBox(template: string): void{
    if(template!=""){
      this.showTemplate.set(true);
      this.showImage.set(false);
      this.headerDialog= getHeaderDialogToBasicTemplate();
      this.itemsSavePrompt= getSaveFormartBasicTemplate();
      const parsedTemplate = JSON.parse(template);
      this.htmlString.set(parsedTemplate?.["htmlString"]);
      this.cssString.set(parsedTemplate?.["cssString"]);
    }
  }

  savePromptInDB($event: SavePromptDbInterface): void{
     if($event?.typePrompt==TypePromptEnum.BASIC_TEMPLATE){
          let request: BasicTemplateInterface = {
            id: null,
            htmlString: this.htmlString(),
            cssString: this.cssString(),
            name: $event.name
          };
          this.executingRestFulService.saveBasicTemplate(request);
        }
  }
}
