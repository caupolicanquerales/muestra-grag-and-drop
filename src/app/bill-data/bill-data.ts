import { Component, signal, OnInit, WritableSignal, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { HttpClientService } from '../service/http-client-service';
import { GenerationDataInterface } from '../models/generation-data-interface';
import { ServiceGeneral } from '../service/service-general';
import { ChatBox } from '../chat-box/chat-box';
import { SavePromptDbInterface } from '../models/save-prompt-db-interface';
import { PromptGenerationImageInterface} from '../models/prompt-generation-image-interface';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { Subject, takeUntil, Observable } from 'rxjs';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { getHeaderDialogToBillData, getExportFormatToBillData, getSaveFormartPromptToBillData } from '../utils/dialog-parameters-utils';
import { informationDataGenerationHelp } from '../utils/infor-help-tour-utils';
import { PromptAndDataToValidateInterface } from '../models/prompts-and-data-to-validate-interface';
import { TypePromptEnum } from '../enums/type-prompt-enum';
import { extractArrayNamePrompt } from '../utils/tree-prompt-utils';

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
  deleteFilesFromOutside = signal(false);
  promptAndDataToValidate: PromptAndDataToValidateInterface={};

  
  constructor(private httpService :HttpClientService,private serviceGeneral: ServiceGeneral,
    private executingRestFulService: ExecutingRestFulService){}

  ngOnInit(): void {
    this.serviceGeneral.setImageGenerated('');
    this.headerDialog= getHeaderDialogToBillData();
    this.itemsExportPrompt= getExportFormatToBillData();
    this.itemsSavePrompt= getSaveFormartPromptToBillData();
    this.subscribeUntilDestroyed(this.serviceGeneral.statusMessage$, status => this.statusMessage.set(status));
    this.subscribeUntilDestroyed(this.serviceGeneral.responseMessagePrompt$, token => this.responseMessage.update(currentValue => currentValue + token));
    this.subscribeUntilDestroyed(this.serviceGeneral.selectedPrompt$, data => this.prompt.set(data));
    this.httpService.getPromptExtractionFromRepository().subscribe(data=>this.promptExtrationInfo=data['prompt']);
    const sources = [
          { obs: this.serviceGeneral.promptImages$, type: TypePromptEnum.IMAGE_PROMPT },
          { obs: this.serviceGeneral.promptData$, type: TypePromptEnum.DATA_PROMPT },
          { obs: this.serviceGeneral.syntheticData$, type: TypePromptEnum.SYNTHETIC_DATA }
        ];
     sources.forEach(s =>
          this.subscribeUntilDestroyed(s.obs as Observable<any>, data => {
            this.promptAndDataToValidate[s.type]= extractArrayNamePrompt(data);
          }));
  }

  ngOnDestroy(): void {
    this.serviceGeneral.setSelectedPrompt("");
    this.serviceGeneral.setSelectedPromptBill("");
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitPrompt(): void {
    if (this.prompt().length >= 10) {
      this.deleteFilesFromOutside.set(false);
      this.prepareAndExecute();
    }
  }

  submitExtractJson(): void {
    const newPrompt= JSON.stringify(this.promptExtrationInfo.concat(this.responseMessage()));
    const parsed = JSON.parse(newPrompt);
    this.prepareAndExecute(parsed);
  }

  promptEmitter(value: string){
    this.prompt.set(value);
  }

  getSelectedFiles($event:Array<File>){
    this.selectedFiles=$event;
  }

  getSavePromptEmitterInDB($event: SavePromptDbInterface){
    const actions: Record<string, () => void> = {
      'Prompt imagen': () => {
        const request = this.getPromptGenerationRequest($event.prompt, $event.name);
        this.executingRestFulService.savePromptImage(request);
      },
      'Prompt datos': () => {
        const request = this.getPromptGenerationRequest($event.prompt, $event.name);
        this.executingRestFulService.savePromptData(request);
      },
      'Dato sintético': () => this.saveSyntheticData($event),
    };

    const action = actions[$event.typePrompt];
    if (action) action();
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

  private subscribeUntilDestroyed<T>(obs: Observable<T>, handler: (v: T) => void) {
    obs.pipe(takeUntil(this.destroy$)).subscribe(handler);
  }

  private prepareAndExecute(optionalPrompt?: string) {
    if (optionalPrompt !== undefined) {
      try {
        this.prompt.set(optionalPrompt as any);
      } catch (e) {
        this.prompt.set(optionalPrompt as any);
      }
    }
    this.setVariableBeforeSendingPrompt();
    this.sendPromptToGenerateData();
  }

  private executingPrompt(){
    const request= this.getRequestGenerationData();
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
  }

  private sendingFileAndPrompt(){
    const request= this.setFormData(this.selectedFiles);
    this.httpService.sendingFileForGenerationData(request).subscribe({
      next: (data) => {
        this.selectedFiles=[];
        this.deleteFilesFromOutside.set(true);
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
