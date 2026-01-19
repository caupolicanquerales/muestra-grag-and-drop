import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatButtons } from '../chat-buttons/chat-buttons';
import { ServiceGeneral } from '../service/service-general';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { triggerDownloadTheFile, getMapTypeFormatDownloadFile } from '../utils/download-file-utils';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { removeColorContent } from '../utils/operation-string-utils'
import { Subject, takeUntil, Observable } from 'rxjs';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { PromptAndDataToValidateInterface } from '../models/prompts-and-data-to-validate-interface';
import { getHeaderDialogToBillEditor, getExportFormatToBillEditor, getSaveFormartPromptForSystem, getSaveFormartPromptForData, getSaveFormartPromptForOther, getHeaderDialogToSystem, getHeaderDialogToData } from '../utils/dialog-parameters-utils';
import { buildMainNode, disablePrompts, extractArrayNamePrompt, setChildInTree } from '../utils/tree-prompt-utils';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { getMapOrder } from '../utils/bfs-search-node-utils'
import { RadioButtonModule } from 'primeng/radiobutton';
import { BasicTemplateInterface } from '../models/basic-template-interface';
import { TypePromptEnum } from '../enums/type-prompt-enum';
import { composeHtmlCssTemplate, getBasicTemplateInterfaceFromEvent } from '../utils/basic-template-utils';

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
    const sources = [
      { obs: this.serviceGeneral.promptImages$, type: TypePromptEnum.IMAGE_PROMPT },
      { obs: this.serviceGeneral.promptBills$, type: TypePromptEnum.BILL_PROMPT },
      { obs: this.serviceGeneral.promptData$, type: TypePromptEnum.DATA_PROMPT },
      { obs: this.serviceGeneral.syntheticData$, type: TypePromptEnum.SYNTHETIC_DATA },
      { obs: this.serviceGeneral.publicityData$, type: TypePromptEnum.PUBLICITY_DATA },
      { obs: this.serviceGeneral.promptGlobalDefect$, type: TypePromptEnum.GLOBAL_DEFECT_PROMPT },
      { obs: this.serviceGeneral.promptSystem$, type: TypePromptEnum.SYSTEM_PROMPT },
      { obs: this.serviceGeneral.basicTemplateData$, type: TypePromptEnum.BASIC_TEMPLATE },
    ];

    sources.forEach(s =>
      this.subscribeUntilDestroyed(s.obs as Observable<any>, data => {
        this.backUpTree = setChildInTree(this.tree, this.backUpTree, s.type, data, this.orderMap);
        this.promptAndDataToValidate[s.type]= extractArrayNamePrompt(data);
        this.tree = this.setDisablePrompts();
      })
    );
    this.serviceGeneral.basicTemplate$.pipe(takeUntil(this.destroy$)).subscribe(data=>this.setBasicTemplateToEditor(data));
  }

  ngOnDestroy(): void {
    this.serviceGeneral.setBasicTemplate('');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeUntilDestroyed<T>(obs: Observable<T>, handler: (v: T) => void) {
    obs.pipe(takeUntil(this.destroy$)).subscribe(handler);
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
    const requestBase: PromptGenerationImageInterface = {
      id: null,
      prompt: textToCopy,
      name: $event.name
    };

    const actions: Record<string, () => void> = {
      [TypePromptEnum.BILL_PROMPT]: () => this.executingRestFulService.savePromptBill(requestBase),
      [TypePromptEnum.IMAGE_PROMPT]: () => this.executingRestFulService.savePromptImage(requestBase),
      [TypePromptEnum.DATA_PROMPT]: () => this.executingRestFulService.savePromptData(requestBase),
      [TypePromptEnum.SYNTHETIC_DATA]: () => this.executingRestFulService.saveSyntheticData(this.getSyntheticRequest(textToCopy, $event.name)),
      [TypePromptEnum.PUBLICITY_DATA]: () => this.executingRestFulService.savePublicityData(this.getSyntheticRequest(textToCopy, $event.name)),
      [TypePromptEnum.SYSTEM_PROMPT]: () => this.executingRestFulService.savePromptSystem(requestBase),
    };

    const action = actions[$event?.typePrompt];
    if (action) action();
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
    const type = this.selectedNode?.data?.type;
    if (type === TypePromptEnum.BASIC_TEMPLATE) {
      const request = this.getBasicTemplateInterface($event?.node?.data?.data);
      this.executingRestFulService.getBasicTemplateById(request);
      return;
    }

    const colorMap: Record<string, string> = {
      [TypePromptEnum.BILL_PROMPT]: 'rgb(0, 0, 139)',
      [TypePromptEnum.IMAGE_PROMPT]: 'rgb(47, 79, 79)',
      [TypePromptEnum.DATA_PROMPT]: 'rgb(0, 128, 128)',
      [TypePromptEnum.SYNTHETIC_DATA]: 'rgb(0, 0, 0)',
      [TypePromptEnum.SYSTEM_PROMPT]: 'rgb(0, 0, 0)',
      [TypePromptEnum.GLOBAL_DEFECT_PROMPT]: 'rgb(0, 0, 0)',
      [TypePromptEnum.PUBLICITY_DATA]: 'rgb(0, 0, 0)'
    };

    const color = colorMap[type as string];
    if (color) this.setColorText(this.selectedNode?.data, color);
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
    return getBasicTemplateInterfaceFromEvent($event);
  }
  private setBasicTemplateToEditor(data: any){
    if(data && data?.["cssString"] && data?.["htmlString"]){
     const template= composeHtmlCssTemplate(data);
     this.htmlCss= template;
     this.setTimeout(template);
    } 
  }

  private setDisablePrompts():TreeNode[]{
    let tree= JSON.parse(this.backUpTree);
    return disablePrompts(tree,this.selectedOption, this.amountTypePrompts);
  }
}
