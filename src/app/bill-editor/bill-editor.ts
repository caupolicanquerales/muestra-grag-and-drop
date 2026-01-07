import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatButtons } from '../chat-buttons/chat-buttons';
import { ServiceGeneral } from '../service/service-general';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { triggerDownloadTheFile, getMapTypeFormatDownloadFile } from '../utils/download-file-utils';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { removeColorContent } from '../utils/operation-string-utils'
import { Subject, takeUntil } from 'rxjs';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { PromptAndDataToValidateInterface } from '../models/prompts-and-data-to-validate-interface';
import { getHeaderDialogToBillEditor, getExportFormatToBillEditor, getSaveFormartPromptForSystem, getSaveFormartPromptForData, getSaveFormartPromptForOther, getHeaderDialogToSystem, getHeaderDialogToData } from '../utils/dialog-parameters-utils';
import { buildMainNode, disablePrompts, setChildInTree } from '../utils/tree-prompt-utils';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { getMapOrder } from '../utils/bfs-search-node-utils'
import { RadioButtonModule } from 'primeng/radiobutton';
import { BasicTemplateInterface } from '../models/basic-template-interface';
import { TypePromptEnum } from '../enums/type-prompt-enum';

@Component({
  selector: 'bill-editor',
  imports: [CommonModule, NgClass, FormsModule, ChatButtons, TreeModule, RadioButtonModule],
  standalone: true,
  templateUrl: './bill-editor.html',
  styleUrl: './bill-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillEditor implements OnInit, OnDestroy {

  isFocused = signal(false);
  prompt: WritableSignal<string> = signal('');
  placeHolder: string= "esto es una prueba";
  titleData: string= "Editor de prompts";
  itemsExportPrompt: Array<any>=[]
  itemsSavePrompt: Array<any>=[];
  headerDialog: Array<any>=[];
  styledPrompt: string="";
  promptAndDataToValidate: PromptAndDataToValidateInterface={};
  private destroy$ = new Subject<void>();
  private backUpTree: string= '';
  tree: TreeNode[]= [buildMainNode('Prompts', true)];
  selectedNode: TreeNode | null =null;
  selectedOption: string= '';
  optionsRadioButton = [
  { id: 'opt1', label: 'Prompt dato' }, 
  { id: 'opt2', label: 'Prompt sistema' },
  { id: 'opt3', label: 'Otros Prompt' }];
  generateImageButton: boolean= true;
  generatePromptButton: boolean= true;
  private htmlCss: string="";
  private orderMap: any = {};
  private amountTypePrompts: number= 8;

  @ViewChild('editorRef') editorRef!: ElementRef<HTMLDivElement>;
  
  constructor(private serviceGeneral: ServiceGeneral, private cd: ChangeDetectorRef,
    private executingRestFulService: ExecutingRestFulService){}

  ngOnInit(): void {
    this.orderMap= getMapOrder();
    this.selectedOption=this.optionsRadioButton[2]['label'];
    this.serviceGeneral.setImageGenerated('');
    this.headerDialog= getHeaderDialogToBillEditor();
    this.itemsSavePrompt= getSaveFormartPromptForOther();
    this.itemsExportPrompt= getExportFormatToBillEditor();
    this.serviceGeneral.promptImages$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.backUpTree= setChildInTree(this.tree,this.backUpTree,TypePromptEnum.IMAGE_PROMPT,data,this.orderMap);
      this.tree= this.setDisablePrompts();
    });
    this.serviceGeneral.promptBills$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.backUpTree= setChildInTree(this.tree,this.backUpTree,TypePromptEnum.BILL_PROMPT,data,this.orderMap);
      this.tree= this.setDisablePrompts();
    });
    this.serviceGeneral.promptData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.backUpTree= setChildInTree(this.tree,this.backUpTree,TypePromptEnum.DATA_PROMPT,data,this.orderMap);
      this.tree= this.setDisablePrompts();
    });
    this.serviceGeneral.syntheticData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.backUpTree= setChildInTree(this.tree,this.backUpTree,TypePromptEnum.SYNTHETIC_DATA,data,this.orderMap);
      this.tree= this.setDisablePrompts();
    });
    this.serviceGeneral.publicityData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.backUpTree= setChildInTree(this.tree,this.backUpTree,TypePromptEnum.PUBLICITY_DATA,data,this.orderMap);
      this.tree= this.setDisablePrompts();
    });
    this.serviceGeneral.promptGlobalDefect$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.backUpTree= setChildInTree(this.tree,this.backUpTree,TypePromptEnum.GLOBAL_DEFECT_PROMPT,data,this.orderMap);
      this.tree= this.setDisablePrompts();
    });
    this.serviceGeneral.promptSystem$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.backUpTree= setChildInTree(this.tree,this.backUpTree,TypePromptEnum.SYSTEM_PROMPT,data,this.orderMap);
      this.tree= this.setDisablePrompts();
    });
    this.serviceGeneral.basicTemplateData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.backUpTree= setChildInTree(this.tree,this.backUpTree,TypePromptEnum.BASIC_TEMPLATE,data,this.orderMap);
      this.tree= this.setDisablePrompts();
    });
    this.serviceGeneral.basicTemplate$.pipe(takeUntil(this.destroy$)).subscribe(data=>this.setBasicTemplateToEditor(data));
  }

  ngOnDestroy(): void {
    this.serviceGeneral.setBasicTemplate('');
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.resizeTextarea();
  }

  resizeTextarea(): void {
    const el = document.getElementById('prompt-input') as HTMLTextAreaElement;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }

  setColorText($event: any, colorRgb: string){
    const coloredSpan = removeColorContent($event?.data, colorRgb);
    this.setTimeout(coloredSpan);
  }

  private setTimeout(coloredSpan: string){
    setTimeout(() => {
      if (this.editorRef) {
        this.editorRef.nativeElement.innerHTML += coloredSpan;
        this.resizeTextarea();
      }
    }, 0);
  }

  updatePromptFromContentEditable(event: Event): void {
    const target = event.target as HTMLDivElement;
    const plainTextValue = target.innerText;
    this.prompt.set(plainTextValue);
  }

  async submitCopyText($event: string): Promise<void> {
    const textToCopy = this.getTextToCopy();
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (e) {
      console.error("Error, Trying to copy prompt-editor.",e);
    }
  }

  exportInformation($event: string){
    if ($event) {
        this.downloadFile($event);  
    }
    this.cd.detectChanges();
  }

  downloadFile(extension: string){
    const textToCopy = this.getTextToCopy();
    const typeExt= getMapTypeFormatDownloadFile().get(extension);
    if(textToCopy!= undefined){
      triggerDownloadTheFile(textToCopy, typeExt, extension);
    }
  }

  private getTextToCopy(): string{
    const contentElement = document.getElementById("prompt-editor");
    if (!contentElement) {
      return '';
    }
    return contentElement.innerHTML;
  }

  emitSavePrompt($event: any){
    const textToCopy = this.getTextToCopy();
    let request: PromptGenerationImageInterface = {
      id: null,
      prompt: textToCopy,
      name: $event.name
    };
    if($event?.typePrompt==TypePromptEnum.BILL_PROMPT){
      this.executingRestFulService.savePromptBill(request);
    }
    if($event?.typePrompt==TypePromptEnum.IMAGE_PROMPT){
      this.executingRestFulService.savePromptImage(request);
    }
    if($event?.typePrompt==TypePromptEnum.DATA_PROMPT){
      this.executingRestFulService.savePromptData(request);
    }
    if($event?.typePrompt==TypePromptEnum.SYNTHETIC_DATA){
      const request= this.getSyntheticRequest(textToCopy, $event.name);
      this.executingRestFulService.saveSyntheticData(request);
    }
    if($event?.typePrompt==TypePromptEnum.PUBLICITY_DATA){
      const request= this.getSyntheticRequest(textToCopy, $event.name);
      this.executingRestFulService.savePublicityData(request);
    }
    if($event?.typePrompt==TypePromptEnum.SYSTEM_PROMPT){
      this.executingRestFulService.savePromptSystem(request);
    }
  }

  private getSyntheticRequest(textToCopy: string, name: string): SyntheticDataInterface{
    return {
      id: null,
      data: textToCopy,
      name: name
    } 
  }

  emitEraseText($event: any){
    this.styledPrompt = '';
    this.prompt.set('');
    if (this.editorRef && this.editorRef.nativeElement) {
      this.editorRef.nativeElement.innerHTML = '';
      this.resizeTextarea(); 
    }
  }

  generateImage($event: any){
    const textToCopy = this.getTextToCopy();
    this.serviceGeneral.setSelectedPromptBill(textToCopy.trim());
    this.serviceGeneral.setChangeComponent('show-template');
  }

  generatePrompt($event: any){
    const textToCopy = this.getTextToCopy();
    this.serviceGeneral.setSelectedPrompt(textToCopy);
    this.serviceGeneral.setChangeComponent('generate-data');
  }

  nodeSelect($event: any){
     if(this.selectedNode?.data?.type==TypePromptEnum.BILL_PROMPT){
      this.setColorText(this.selectedNode?.data, "rgb(0, 0, 139)");
    }
    if(this.selectedNode?.data?.type==TypePromptEnum.IMAGE_PROMPT){
      this.setColorText(this.selectedNode?.data, "rgb(47, 79, 79)");
    }
    if(this.selectedNode?.data?.type==TypePromptEnum.DATA_PROMPT){
      this.setColorText(this.selectedNode?.data, "rgb(0, 128, 128)");
    }
    if(this.selectedNode?.data?.type==TypePromptEnum.SYNTHETIC_DATA ||
      this.selectedNode?.data?.type==TypePromptEnum.SYSTEM_PROMPT ||
      this.selectedNode?.data?.type==TypePromptEnum.GLOBAL_DEFECT_PROMPT ||
      this.selectedNode?.data?.type==TypePromptEnum.PUBLICITY_DATA
    ){
      this.setColorText(this.selectedNode?.data, "rgb(0, 0, 0)");
    }
    if(this.selectedNode?.data?.type==TypePromptEnum.BASIC_TEMPLATE){
      let request= this.getBasicTemplateInterface($event?.node?.data?.data);
      this.executingRestFulService.getBasicTemplateById(request);
    }
  }

  onRadioChange($event:any){
    let backUp= JSON.parse(this.backUpTree);
    this.emitEraseText(null);
    this.generateImageButton=false;
    this.generatePromptButton=false;
    if(this.selectedOption==this.optionsRadioButton[2]['label']){
      this.generateImageButton=true;
      this.generatePromptButton=true;
      this. itemsSavePrompt=getSaveFormartPromptForOther();
      this.headerDialog= getHeaderDialogToBillEditor();
    }else if(this.selectedOption==this.optionsRadioButton[1]['label']){
      this. itemsSavePrompt=getSaveFormartPromptForSystem();
      this.headerDialog= getHeaderDialogToSystem();
    }else{
      this.itemsSavePrompt=getSaveFormartPromptForData();
      this.headerDialog= getHeaderDialogToData();
      this.generatePromptButton=true;
    }
    this.tree= disablePrompts(backUp,this.selectedOption, this.amountTypePrompts);
  }

  private getBasicTemplateInterface($event:any):BasicTemplateInterface{
    return {
        id: $event.id,
        htmlString: "",
        cssString: "",
        name: ""
      }; 
  }
  private setBasicTemplateToEditor(data: any){
    if(data && data?.["cssString"] && data?.["htmlString"]){
     const template= `<style>${data?.["cssString"]}</style>${data?.["htmlString"]}`;
     this.htmlCss= template;
     this.setTimeout(template);
    } 
  }

  private setDisablePrompts():TreeNode[]{
    let tree= JSON.parse(this.backUpTree);
    return disablePrompts(tree,this.selectedOption, this.amountTypePrompts);
  }
}
