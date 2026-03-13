import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { BillSkeleton } from '../bill-skeleton/bill-skeleton';
import { UploadDocument } from '../upload-document/upload-document';
import { ServiceGeneral } from '../service/service-general';
import { Subject, takeUntil } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ChatButtons } from '../chat-buttons/chat-buttons';
import { PromptAndDataToValidateInterface } from '../models/prompts-and-data-to-validate-interface';
import { getHeaderDialogToBasicTemplate, getSaveFormartBasicTemplate } from '../utils/dialog-parameters-utils';
import { BasicTemplateInterface } from '../models/basic-template-interface';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { DialogTemplate } from '../dialog-template/dialog-template';
import { TypePromptEnum } from '../enums/type-prompt-enum';
import { getBasicTemplateInterfaceFromEvent } from '../utils/basic-template-utils';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { templateHelp } from '../utils/infor-help-tour-utils';

@Component({
  selector: 'bill-template',
  imports: [CommonModule, BillSkeleton, UploadDocument, TableModule, ButtonModule, ChatButtons,
    DialogTemplate, JoyrideModule],
  standalone: true,
  templateUrl: './bill-template.html',
  styleUrl: './bill-template.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillTemplate implements OnInit, OnDestroy{

  allowButton: WritableSignal<boolean> = signal(false);
  multipleFiles: boolean = true;
  formatFiles: string= ".html,.scss,.css";
  uploadMessage: string= $localize`@@uploadMessage` 
  formatFileMessage: string= $localize`@@formatFileMessageBill`
  htmlString= signal("");
  cssString= signal("");
  selectedFiles: Array<File> = [];
  selectedFilesTemplate: WritableSignal<FileList | null> = signal(null);
  private destroy$ = new Subject<void>();
  templatesIds: Array<BasicTemplateInterface>= [];
  headerDialog: Array<any>=[];
  itemsSavePrompt: Array<any>=[];
  promptAndDataToValidate: PromptAndDataToValidateInterface={};
  pagination: WritableSignal<boolean> = signal(false);
  visible= signal(false);
  headerDialogTitle: string="Esta por eliminar un template básico";
  selectedBasicTemplate: any={};
  actionButtonName: string= "Eliminar";
  displayInfoInSelectedItem: Array<string>=["id","name"];
  private readonly joyrideService = inject(JoyrideService);
  templateHelp: any= templateHelp();

  constructor(private serviceGeneral: ServiceGeneral,
    private executingRestFulService: ExecutingRestFulService){}

  ngOnInit(): void {
    this.serviceGeneral.setImageGenerated('');
    this.headerDialog= getHeaderDialogToBasicTemplate();
    this.itemsSavePrompt= getSaveFormartBasicTemplate();
    this.serviceGeneral.basicTemplateData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.templatesIds=data;
      this.pagination.set(true);
    });
    this.serviceGeneral.basicTemplate$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.htmlString.set(data?.["htmlString"]);
      this.cssString.set(data?.["cssString"]);
      this.serviceGeneral.setActivateBasicTemplateStream(null);
    });
  }

  ngOnDestroy(): void {
    this.serviceGeneral.setBasicTemplate('');
    this.serviceGeneral.setActivateBasicTemplateStream(null);
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectedFileEmitter($event: FileList){
    this.selectedFilesTemplate.set($event);
  }

  uploadFile($event: string): void {
    if (!this.selectedFilesTemplate()) return;
    const file= this.selectedFilesTemplate();
    if(file){
      const formData = this.setFormData(file);
      this.executingSaveFile(formData)
    }
  }

  selectTemplate($event:any):void{
    this.serviceGeneral.setIsUploadingAnimation(true);
    let request= this.getBasicTemplateInterface($event);
    this.executingRestFulService.getBasicTemplateById(request);
  }

  deleteTemplate($event:any):void{
    this.selectedBasicTemplate=$event;
    this.visible.set(true);
  }

  deleteSelectedTemplate($event:any):void{
    let request= this.getBasicTemplateInterface(this.selectedBasicTemplate);
    this.executingRestFulService.deleteBasicTemplateById(request);
  }

  private getBasicTemplateInterface($event:any):BasicTemplateInterface{
    return getBasicTemplateInterfaceFromEvent($event);
  }

  emitSavePrompt($event: any){
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

  private executingSaveFile(request:FormData){
    this.allowButton.set(false);
    this.serviceGeneral.setIsUploadingAnimation(true);
    this.serviceGeneral.setActivateBasicTemplateStream(request);
  }

  private setFormData(selectedFiles: FileList): FormData{
    const formData = new FormData();
    for(let i=0;i<selectedFiles.length;i++){
      formData.append('files', selectedFiles[i], selectedFiles[i]?.name);
    }
    return formData;  
  }

  startTour() {
      this.joyrideService.startTour({ steps: ['modeStep'] });
  }
}
