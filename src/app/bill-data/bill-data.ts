import { Component, signal, OnInit, WritableSignal, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { HttpClientService } from '../service/http-client-service';
import { GenerationDataInterface } from '../models/generation-data-interface';
import { ServiceGeneral } from '../service/service-general';
import { ChatBox } from '../chat-box/chat-box';
import { SavePromptDbInterface } from '../models/save-prompt-db-interface';
import { PromptGenerationImageInterface} from '../models/prompt-generation-image-interface';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { Subject, takeUntil } from 'rxjs';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { getHeaderDialogToBillData, getExportFormatToBillData, getSaveFormartPromptToBillData } from '../utils/dialog-parameters-utils';
import { informationDataGenerationHelp } from '../utils/infor-help-tour-utils';

@Component({
  selector: 'bill-data',
  standalone: true,
  imports: [ChatBox ],
  templateUrl: './bill-data.html',
  styleUrl: './bill-data.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillData implements OnInit, OnDestroy{
  
  prompt: WritableSignal<string> = signal('');
  responseMessage: WritableSignal<string> = signal('');
  statusMessage: WritableSignal<boolean> = signal(false);
  titleData: string =$localize`@@titleData:`;
  subTitleData: string= $localize`@@subTitleData:`;
  placeHolder: string= $localize`@@placeHolder:`; 
  labelExtractButton: string= $localize`@@labelExtractButton:`; 
  private promptExtrationInfo: string= "";
  selectedFiles: Array<File> = [];
  formatFiles: string= ".png,.html,.css,.scss";
  itemsExportPrompt: Array<any>=[];
  itemsSavePrompt: Array<any>=[];
  headerDialog: Array<any>= [];
  private destroy$ = new Subject<void>();
  informationDataGenerationHelp: any= informationDataGenerationHelp();

  
  constructor(private httpService :HttpClientService,private serviceGeneral: ServiceGeneral,
    private executingRestFulService: ExecutingRestFulService){}

  ngOnInit(): void {
    this.serviceGeneral.setImageGenerated('');
    this.headerDialog= getHeaderDialogToBillData();
    this.itemsExportPrompt= getExportFormatToBillData();
    this.itemsSavePrompt= getSaveFormartPromptToBillData();
    this.serviceGeneral.statusMessage$.pipe(takeUntil(this.destroy$)).subscribe(status=>this.statusMessage.set(status));
    this.serviceGeneral.responseMessagePrompt$.pipe(takeUntil(this.destroy$)).subscribe(token=>this.responseMessage.update(currentValue=>currentValue + token));
    this.serviceGeneral.selectedPrompt$.pipe(takeUntil(this.destroy$)).subscribe(data=>this.prompt.set(data));
    this.httpService.getPromptExtractionFromRepository().subscribe(data=>this.promptExtrationInfo=data['prompt']);
  }

  ngOnDestroy(): void {
    this.serviceGeneral.setSelectedPrompt("");
    this.serviceGeneral.setSelectedPromptBill("");
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitPrompt(): void {
    if (this.prompt().length >= 10) {
      this.sendPromptToGenerateData();
    }
  }

  submitExtractJson(): void {
    const newPrompt= JSON.stringify(this.promptExtrationInfo.concat(this.responseMessage()));
    this.setVariableBeforeSendingPrompt();
    this.prompt.set(JSON.parse(newPrompt)) ; 
    this.executingPrompt();
  }

  promptEmitter(value: string){
    this.prompt.set(value);
  }

  getSelectedFiles($event:Array<File>){
    this.selectedFiles=$event;
  }

  getSavePromptEmitterInDB($event: SavePromptDbInterface){
    if($event.typePrompt=="Prompt imagen"){
      let request = this.getPromptGenerationRequest($event.prompt, $event.name)
      this.executingRestFulService.savePromptImage(request);
    }
    if($event.typePrompt=="Prompt datos"){
      let request = this.getPromptGenerationRequest($event.prompt, $event.name)
      this.executingRestFulService.savePromptData(request);
    }
    if($event.typePrompt=="Dato sintético"){
      this.saveSyntheticData($event);
    }
    console.log($event);
  }

  private sendPromptToGenerateData(){
    this.setVariableBeforeSendingPrompt();
    this.executingPromptAndFiles();
  }
  
  private getRequestGenerationData():GenerationDataInterface{
    return {
      prompt: this.prompt()
    }
  }

  private setVariableBeforeSendingPrompt(){
    this.statusMessage.set(false);
    this.responseMessage.set('');
  }

  private executingPrompt(){
    const request= this.getRequestGenerationData();
    //this.serviceGeneral.setActivateChatClientStream(true);
    this.serviceGeneral.setActivateChatClientStreamPrueba(request);
    setTimeout(() => {
      this.updatePromptToGenerateData(request);
    }, 50); 
  }

  private executingPromptAndFiles(){
    if(this.selectedFiles.length>0){
      this.sendingFileAndPrompt();
    }else{
      this.executingPrompt();
    } 
  }

  private setFormData(selectedFiles: Array<File>): FormData{
    const formData = new FormData();
    for(let i=0;i<selectedFiles.length;i++){
      formData.append('files', selectedFiles[i], selectedFiles[i]?.name);
    }
    return formData;  
  }

  private updatePromptToGenerateData(request: GenerationDataInterface): void{
    this.prompt.set('');
    this.serviceGeneral.setResizeInput(true);
    this.serviceGeneral.setIsUploadingAnimation(true);
    
    /*
    this.httpService.updatePromptForGenerationData(request).subscribe({
      next: (data) => {
        this.prompt.set('');
        this.serviceGeneral.setResizeInput(true);
        this.serviceGeneral.setIsUploadingAnimation(true);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
      complete: () => {
        console.log('Request completed.');
      }
    })*/
  }

  private sendingFileAndPrompt(){
    const request= this.setFormData(this.selectedFiles);
    this.httpService.sendingFileForGenerationData(request).subscribe({
      next: (data) => {
        this.selectedFiles=[];
        this.executingPrompt();
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
      complete: () => {
        console.log('Request completed.');
      }
    })
  }

  private saveSyntheticData($event: SavePromptDbInterface){
    let request: SyntheticDataInterface = {
      id: null,
      data: $event.prompt,
      name: $event.name
    };
    this.executingRestFulService.saveSyntheticData(request);
  }

  private getPromptGenerationRequest(prompt: string, name: string):PromptGenerationImageInterface{
    return  {
      id: null,
      prompt: prompt,
      name: name
    };
  }

}
