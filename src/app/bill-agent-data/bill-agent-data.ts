import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ChatBox } from '../chat-box/chat-box';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ServiceGeneral } from '../service/service-general';
import { GenerationDataAgentInterface } from '../models/generation-data-agent-interface';

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
  base64String: WritableSignal<string> = signal('');
  conversationId: string = this.generateId();

  constructor(private serviceGeneral: ServiceGeneral){}
  
  ngOnInit(): void {
    this.subscribeUntilDestroyed(this.serviceGeneral.selectedPromptBill$, data => this.prompt.set(data));
    this.subscribeUntilDestroyed(this.serviceGeneral.statusMessage$, status => this.statusMessage.set(status));
    this.subscribeUntilDestroyed(this.serviceGeneral.responseMessagePrompt$, token => this.setResponseMessage(token));
    this.subscribeUntilDestroyed(this.serviceGeneral.imageGenerated$, image => this.setImageinChatBox(image));
  }

  ngOnDestroy(): void {
    this.serviceGeneral.setSelectedPromptBill("");
    this.showImage.set(false);
    this.base64String.set('');
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
      this.base64String.set(image);
    }
  }

  generateId(): string {
    return crypto.randomUUID();
  }

  setResponseMessage( token: string): void {
    this.showImage.set(false);
    this.responseMessage.update(currentValue => currentValue + token);
  }
}
