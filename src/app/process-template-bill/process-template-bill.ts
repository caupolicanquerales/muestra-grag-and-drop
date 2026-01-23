import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBox } from '../chat-box/chat-box';
import { GenerationImageInterface } from '../models/generation-image-interface';
import { HttpClientService } from '../service/http-client-service';
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
  imports: [ CommonModule, ChatBox/*, VisualizerCanvas*/],
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
  
  constructor(private httpService :HttpClientService,private serviceGeneral: ServiceGeneral){}

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
  }

  private executingPrompt(){
    const request= this.getRequestGenerationData();
    this.setPrompt(request); 
  }

  private getRequestGenerationData():GenerationImageInterface{
    return {
      prompt: [this.prompt()]
    }
  }
   
  private setPrompt(request: GenerationImageInterface): void{
    this.httpService.setPromptForGenerationImage(request).subscribe({
      next: (data) => {
        this.prompt.set('');
        this.serviceGeneral.setResizeInput(true);
        this.serviceGeneral.setIsUploadingAnimation(true);
        this.serviceGeneral.setExecutingImageStream(true);
        this.serviceGeneral.setSelectedPromptImage('');
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  promptEmitter(value: string){
    this.prompt.set(value);
    this.showImage.set(false);
    this.base64String.set('');
  }
}
