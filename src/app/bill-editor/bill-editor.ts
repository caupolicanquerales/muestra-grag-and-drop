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
import { getHeaderDialogToBillEditor, getSaveFormartPromptToBillEditor, getExportFormatToBillEditor } from '../utils/dialog-parameters-utils';
import { buildMainNode, getMainNode } from '../utils/tree-prompt-utils';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { searchNodeToDisableNode } from '../utils/bfs-search-node-utils'
import { RadioButtonModule } from 'primeng/radiobutton';
import { BasicTemplateInterface } from '../models/basic-template-interface';

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
  radioButton1: string ="Prompt dato"
  radioButton2: string ="Otros Prompt"
  generateImageButton: boolean= true;

  @ViewChild('editorRef') editorRef!: ElementRef<HTMLDivElement>;
  
  constructor(private serviceGeneral: ServiceGeneral, private cd: ChangeDetectorRef,
    private executingRestFulService: ExecutingRestFulService){}

  ngOnInit(): void {
    this.selectedOption=this.radioButton2;
    this.serviceGeneral.setImageGenerated('');
    this.headerDialog= getHeaderDialogToBillEditor();
    this.itemsSavePrompt= getSaveFormartPromptToBillEditor();
    this.itemsExportPrompt= getExportFormatToBillEditor();
    this.serviceGeneral.promptImages$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.promptAndDataToValidate.prompt_imagen=data;
      this.tree= this.setChildrenInTreeNode('Prompt imagen', 'Prompt imagen', data);
      this.backUpTree= JSON.stringify(this.tree);
    });
    this.serviceGeneral.promptBills$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.promptAndDataToValidate.prompt_facturas=data;
      this.tree= this.setChildrenInTreeNode('Prompt factura','Prompt factura', data);
      this.backUpTree= JSON.stringify(this.tree);
    });
    this.serviceGeneral.promptData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.promptAndDataToValidate.prompt_datos=data;
      this.tree= this.setChildrenInTreeNode('Prompt dato','Prompt dato', data);
      this.backUpTree= JSON.stringify(this.tree);
    });
    this.serviceGeneral.syntheticData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.promptAndDataToValidate.dato_sintético=data;
      this.tree= this.setChildrenInTreeNode('Dato sintético','Dato sintético', data);
      this.backUpTree= JSON.stringify(this.tree);
    });
    this.serviceGeneral.promptGlobalDefect$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.tree= this.setChildrenInTreeNode('Prompt defecto global','Prompt defecto global', data);
      this.backUpTree= JSON.stringify(this.tree);
    });
    this.serviceGeneral.basicTemplateData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.tree= this.setChildrenInTreeNode('Template básico','Template básico', data);
      this.backUpTree= JSON.stringify(this.tree);
      this.tree= this.setDisableNodeInTree(this.tree,['Prompt dato']);
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

  promptImageChange($event: any){
    const coloredSpan = removeColorContent($event?.data, "rgb(47, 79, 79)");
    this.setTimeout(coloredSpan);
  }

  promptDataChange($event: any){
    const coloredSpan = removeColorContent($event?.data, "rgb(0, 128, 128)");
    this.setTimeout(coloredSpan);
  }

  promptDataBill($event: any){
    const coloredSpan = removeColorContent($event?.data, "rgb(0, 0, 139)");
    this.setTimeout(coloredSpan);
  }

  syntheticDataChange($event: any){
    const coloredSpan = removeColorContent($event?.data, "rgb(0, 0, 0)");
    this.setTimeout(coloredSpan);
  }

  promptGlobalDefect($event: any){
    const coloredSpan = removeColorContent($event?.data, "rgb(0, 0, 0)");
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
    if($event?.typePrompt=="Prompt facturas"){
      this.executingRestFulService.savePromptBill(request);
    }
    if($event?.typePrompt=="Prompt imagen"){
      this.executingRestFulService.savePromptImage(request);
    }
    if($event?.typePrompt=="Prompt datos"){
      this.executingRestFulService.savePromptData(request);
    }
    if($event?.typePrompt=="Dato sintético"){
      const request= this.getSyntheticRequest(textToCopy, $event.name);
      this.executingRestFulService.saveSyntheticData(request);
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
    this.serviceGeneral.setSelectedPromptBill(textToCopy);
    this.serviceGeneral.setChangeComponent('show-template');
  }

  generatePrompt($event: any){
    const textToCopy = this.getTextToCopy();
    this.serviceGeneral.setSelectedPrompt(textToCopy);
    this.serviceGeneral.setChangeComponent('generate-data');
  }

  private setChildrenInTreeNode(label: string, type: string, 
    data: Array<PromptGenerationImageInterface> | Array<SyntheticDataInterface> | Array<BasicTemplateInterface>){
    let mother= this.tree[0];
    let mainNode= getMainNode(label,type,data);
    mother.children?.push(mainNode);
    return JSON.parse(JSON.stringify([mother]));
  }

  private setDisableNodeInTree(tree: TreeNode[],nodeNames: Array<string>){
    const treeModified= searchNodeToDisableNode(tree,nodeNames);
    return JSON.parse(JSON.stringify(treeModified));
  }

  nodeSelect($event: any){
     if(this.selectedNode?.data.type=="Prompt factura"){
      this.promptDataBill(this.selectedNode?.data);
    }
    if(this.selectedNode?.data.type=="Prompt imagen"){
      this.promptImageChange(this.selectedNode?.data);
    }
    if(this.selectedNode?.data.type=="Prompt dato"){
      this.promptDataChange(this.selectedNode?.data);
    }
    if(this.selectedNode?.data.type=="Dato sintético"){
      this.syntheticDataChange(this.selectedNode?.data);
    }
    if(this.selectedNode?.data.type=="Prompt defecto global"){
      this.promptGlobalDefect(this.selectedNode?.data);
    }
    if(this.selectedNode?.data.type=='Template básico'){
      let request= this.getBasicTemplateInterface($event?.node?.data?.data);
      this.executingRestFulService.getBasicTemplateById(request);
    }
  }

  onRadioChange($event:any){
    let typePrompts=[];
    let backUp= JSON.parse(this.backUpTree);
    this.emitEraseText(null);
    if(this.selectedOption==this.radioButton2){
      typePrompts=['Prompt dato'];
      this.generateImageButton=true;
    }else{
      typePrompts=["Prompt factura","Prompt imagen","Dato sintético","Prompt defecto global"];
      this.generateImageButton=false;
    }
    this.tree= this.setDisableNodeInTree(backUp,typePrompts);
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
     this.setTimeout(template);
    } 
  }
}
