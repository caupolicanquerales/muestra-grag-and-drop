import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { ToastMessageOptions } from 'primeng/api';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { BasicTemplateInterface } from '../models/basic-template-interface';
import { GlobalDefectInterface } from '../models/global-defect-interface';
import { GenerationDataInterface } from '../models/generation-data-interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceGeneral {

  private changeComponent = new BehaviorSubject<string>('');
  changeComponent$: Observable<string> = this.changeComponent.asObservable();

  private selectedPrompt = new BehaviorSubject<string>('');
  selectedPrompt$: Observable<string> = this.selectedPrompt.asObservable();

  private selectedPromptImage = new BehaviorSubject<string>('');
  selectedPromptImage$: Observable<string> = this.selectedPromptImage.asObservable();

  private selectedPromptBill = new BehaviorSubject<string>('');
  selectedPromptBill$: Observable<string> = this.selectedPromptBill.asObservable();

  private responseMessagePrompt = new BehaviorSubject<string>('');
  responseMessagePrompt$: Observable<string> = this.responseMessagePrompt.asObservable();

  private statusMessage = new BehaviorSubject<boolean>(false);
  statusMessage$: Observable<boolean> = this.statusMessage.asObservable();

  private isUploadingAnimation = new BehaviorSubject<boolean>(false);
  isUploadingAnimation$: Observable<boolean> = this.isUploadingAnimation.asObservable();

  private resizeInput = new BehaviorSubject<boolean>(false);
  resizeInput$: Observable<boolean> = this.resizeInput.asObservable();

  private imageBase64 = new BehaviorSubject<string>('');
  imageBase64$: Observable<string> = this.imageBase64.asObservable();

  private executingImageStream = new BehaviorSubject<boolean>(false);
  executingImageStream$: Observable<boolean> = this.executingImageStream.asObservable();

  private executingBasicTemplateStream = new BehaviorSubject<boolean>(false);
  executingBasicTemplateStream$: Observable<boolean> = this.executingBasicTemplateStream.asObservable();
  
  private imageIds = new BehaviorSubject<Array<any>>([]);
  imageIds$: Observable<Array<any>> = this.imageIds.asObservable();

  private promptImages = new BehaviorSubject<Array<PromptGenerationImageInterface>>([]);
  promptImages$: Observable<Array<PromptGenerationImageInterface>> = this.promptImages.asObservable();

  private promptBills = new BehaviorSubject<Array<PromptGenerationImageInterface>>([]);
  promptBills$: Observable<Array<PromptGenerationImageInterface>> = this.promptBills.asObservable();

  private promptSystem = new BehaviorSubject<Array<PromptGenerationImageInterface>>([]);
  promptSystem$: Observable<Array<PromptGenerationImageInterface>> = this.promptSystem.asObservable();

  private promptData = new BehaviorSubject<Array<PromptGenerationImageInterface>>([]);
  promptData$: Observable<Array<PromptGenerationImageInterface>> = this.promptData.asObservable();

  private promptGlobalDefect = new BehaviorSubject<Array<PromptGenerationImageInterface>>([]);
  promptGlobalDefect$: Observable<Array<PromptGenerationImageInterface>> = this.promptGlobalDefect.asObservable();

  private syntheticData = new BehaviorSubject<Array<SyntheticDataInterface>>([]);
  syntheticData$: Observable<Array<SyntheticDataInterface>> = this.syntheticData.asObservable();

  private publicityData = new BehaviorSubject<Array<SyntheticDataInterface>>([]);
  publicityData$: Observable<Array<SyntheticDataInterface>> = this.publicityData.asObservable();

  private basicTemplateData = new BehaviorSubject<Array<BasicTemplateInterface>>([]);
  basicTemplateData$: Observable<Array<BasicTemplateInterface>> = this.basicTemplateData.asObservable();

  private toastMessage = new BehaviorSubject<ToastMessageOptions>({});
  toastMessage$: Observable<ToastMessageOptions> = this.toastMessage.asObservable();

  private refreshPromptBills = new BehaviorSubject<string>('');
  refreshPromptBills$: Observable<string> = this.refreshPromptBills.asObservable();

  private refreshPromptData = new BehaviorSubject<string>('');
  refreshPromptData$: Observable<string> = this.refreshPromptData.asObservable();

  private refreshPromptImages = new BehaviorSubject<string>('');
  refreshPromptImages$: Observable<string> = this.refreshPromptImages.asObservable();

  private refreshSyntheticData = new BehaviorSubject<string>('');
  refreshSyntheticData$: Observable<string> = this.refreshSyntheticData.asObservable();

  private refreshPublicityData = new BehaviorSubject<string>('');
  refreshPublicityData$: Observable<string> = this.refreshPublicityData.asObservable();

  private refreshBasicTemplate = new BehaviorSubject<string>('');
  refreshBasicTemplate$: Observable<string> = this.refreshBasicTemplate.asObservable();

  private refreshPromptGlobalDefect = new BehaviorSubject<string>('');
  refreshPromptGlobalDefect$: Observable<string> = this.refreshPromptGlobalDefect.asObservable();

  private refreshPromptSystem = new BehaviorSubject<string>('');
  refreshPromptSystem$: Observable<string> = this.refreshPromptSystem.asObservable();

  private activateBasicTemplateStream = new BehaviorSubject<boolean>(false);
  activateBasicTemplateStream$: Observable<boolean> = this.activateBasicTemplateStream.asObservable();

  private activateUploadDocumentStream = new BehaviorSubject<boolean>(false);
  activateUploadDocumentStream$: Observable<boolean> = this.activateUploadDocumentStream.asObservable();

  private activateChatClientStream = new BehaviorSubject<boolean>(false);
  activateChatClientStream$: Observable<boolean> = this.activateChatClientStream.asObservable();

  private basicTemplate = new BehaviorSubject<any>({});
  basicTemplate$: Observable<any> = this.basicTemplate.asObservable();

  private imageGenerated = new BehaviorSubject<string>('');
  imageGenerated$: Observable<string> = this.imageGenerated.asObservable();

  private globalDefect = new BehaviorSubject<Array<GlobalDefectInterface>>([]);
  globalDefect$: Observable<Array<GlobalDefectInterface>> = this.globalDefect.asObservable();

  private chatClientStreamPrueba = new BehaviorSubject<GenerationDataInterface>({prompt:''});
  chatClientStreamPrueba$: Observable<GenerationDataInterface> = this.chatClientStreamPrueba.asObservable();
  

  setChangeComponent(component:string): void{
    this.changeComponent.next(component);
  }

  setSelectedPrompt(prompt:string): void{
    this.selectedPrompt.next(prompt);
  }

  setSelectedPromptImage(prompt:string): void{
    this.selectedPromptImage.next(prompt);
  }

  setSelectedPromptBill(prompt:string): void{
    this.selectedPromptBill.next(prompt);
  }

  setResponseMessagePrompt(responseMessage:string): void{
    this.responseMessagePrompt.next(responseMessage);
  }

  setStatusMessage(statusMessage:boolean): void{
    this.statusMessage.next(statusMessage);
  }

  setIsUploadingAnimation(isUploadingAnimation:boolean): void{
    this.isUploadingAnimation.next(isUploadingAnimation);
  }

  setResizeInput(resizeInput:boolean): void{
    this.resizeInput.next(resizeInput);
  }

  setImageBase64(imageBase64:string): void{
    this.imageBase64.next(imageBase64);
  }

  setExecutingImageStream(executingImageStream:boolean): void{
    this.executingImageStream.next(executingImageStream);
  }

  setExecutingBasicTemplatStream(executingBasicTemplateStream:boolean): void{
    this.executingBasicTemplateStream.next(executingBasicTemplateStream);
  }

  setImageIds(imageIds:Array<any>): void{
    this.imageIds.next(imageIds);
  }

  setPromptImages(promptImages:Array<PromptGenerationImageInterface>): void{
    this.promptImages.next(promptImages);
  }

  setPromptBills(promptBills:Array<PromptGenerationImageInterface>): void{
    this.promptBills.next(promptBills);
  }

  setPromptSystem(promptSystem:Array<PromptGenerationImageInterface>): void{
    this.promptSystem.next(promptSystem);
  }

  setPromptData(promptData:Array<PromptGenerationImageInterface>): void{
    this.promptData.next(promptData);
  }

  setPromptGlobalDefect(promptGlobalDefect:Array<PromptGenerationImageInterface>): void{
    this.promptGlobalDefect.next(promptGlobalDefect);
  }

  setGlobalDefect(globalDefect:Array<GlobalDefectInterface>): void{
    this.globalDefect.next(globalDefect);
  }

  setSyntheticData(syntheticData:Array<SyntheticDataInterface>): void{
    this.syntheticData.next(syntheticData);
  }

  setPublicityData(publicityData:Array<SyntheticDataInterface>): void{
    this.publicityData.next(publicityData);
  }

  setBasicTemplateData(basicTemplateData:Array<BasicTemplateInterface>): void{
    this.basicTemplateData.next(basicTemplateData);
  }

  setToastMessage(toastMessage:ToastMessageOptions): void{
    this.toastMessage.next(toastMessage);
  }

  setRefreshPromptBills(refresh:string): void{
    this.refreshPromptBills.next(refresh);
  }

  setRefreshPromptData(refresh:string): void{
    this.refreshPromptData.next(refresh);
  }

  setRefreshPromptImages(refresh:string): void{
    this.refreshPromptImages.next(refresh);
  }

  setRefreshSyntheticData(refresh:string): void{
    this.refreshSyntheticData.next(refresh);
  }

  setRefreshPublicityData(refresh:string): void{
    this.refreshPublicityData.next(refresh);
  }

  setRefreshBasicTemplate(refresh:string): void{
    this.refreshBasicTemplate.next(refresh);
  }

  setRefreshPromptGlobalDefect(refresh:string): void{
    this.refreshPromptGlobalDefect.next(refresh);
  }

  setRefreshPromptSystem(refresh:string): void{
    this.refreshPromptSystem.next(refresh);
  }

  setActivateBasicTemplateStream(activateBasicTemplate:boolean): void{
    this.activateBasicTemplateStream.next(activateBasicTemplate);
  }

  setActivateUploadDocumentStream(activateUploadDocument:boolean): void{
    this.activateUploadDocumentStream.next(activateUploadDocument);
  }

  setActivateChatClientStream(activateChatClient:boolean): void{
    this.activateChatClientStream.next(activateChatClient);
  }

  setBasicTemplate(basicTemplate:any): void{
    this.basicTemplate.next(basicTemplate);
  }

  setImageGenerated(image:string): void{
    this.imageGenerated.next(image);
  }

  setActivateChatClientStreamPrueba(promptChatClient:GenerationDataInterface): void{
    this.chatClientStreamPrueba.next(promptChatClient);
  }

}
