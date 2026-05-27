import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBox } from '../reusable-component/chat-box/chat-box';
import { GenerationImageInterface } from '../models/generation-image-interface';
import { ServiceGeneral } from '../service/service-general';
import { Subject, takeUntil } from 'rxjs';
import { informationImageGenerationHelp } from '../utils/infor-help-tour-utils';

interface Item {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'process-template-bill',
  standalone: true,
  imports: [ CommonModule, ChatBox],
  templateUrl: './process-template-bill.html',
  styleUrl: './process-template-bill.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessTemplateBill implements OnInit, OnDestroy{
  protected readonly title = signal('muestra-grag-and-drop');
  prompt: WritableSignal<string> = signal('');
  responseMessage: WritableSignal<string> = signal('');
  statusMessage: WritableSignal<boolean> = signal(false);
  showImage: WritableSignal<boolean> = signal(false);
  base64String: WritableSignal<string> = signal('');
  titleData: string =$localize`@@titleImage:`;
  subTitleData: string= $localize`@@subTitleImage:`;
  placeHolder: string= $localize`@@placeHolder:`; 
  labelExtractButton: string= $localize`@@labelExtractButton:`;
  private destroy$ = new Subject<void>();
  informationImageGenerationHelp: any= informationImageGenerationHelp();
  
  constructor(private serviceGeneral: ServiceGeneral){}

  ngOnInit(): void {
    this.serviceGeneral.selectedPromptBill$.pipe(takeUntil(this.destroy$)).subscribe(data=>this.prompt.set(data));
    this.serviceGeneral.imageGenerated$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      if(data!=""){
        this.showImage.set(true);
        this.base64String.set(data);
      }
    });
  }

  ngOnDestroy(): void {
    this.showImage.set(false);
    this.base64String.set('');
    this.serviceGeneral.setImageGenerated('');
    this.serviceGeneral.setSelectedPromptBill("");
    this.serviceGeneral.setSelectedPrompt("");
    this.serviceGeneral.setExecutingImageStreamAgent(null);
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitPrompt(): void {
    if (this.prompt().length >= 10) {
      this.sendPromptToGenerateImage();
    }
  }

  private sendPromptToGenerateImage(){
    this.setVariableBeforeSendingPrompt();
    this.executingPrompt();  
  }

  private setVariableBeforeSendingPrompt(){
    this.statusMessage.set(false);
    this.responseMessage.set('');
    this.showImage.set(true);
    this.base64String.set('');
  }

  private executingPrompt(){
    const request= this.getRequestGenerationData();
    this.prompt.set('');
    this.serviceGeneral.setResizeInput(true);
    this.serviceGeneral.setExecutingImageStreamAgent(request);
    this.serviceGeneral.setSelectedPromptImage('');
  }

  private getRequestGenerationData():GenerationImageInterface{
    return {
      prompt: this.prompt()
    }
  }

  promptEmitter(value: string){
    this.prompt.set(value);
    this.showImage.set(false);
    this.base64String.set('');
  }
}
