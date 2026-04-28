import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { ServiceGeneral } from '../service/service-general';
import { Subject, takeUntil, Observable } from 'rxjs';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { BasicTemplateInterface } from '../models/basic-template-interface';
import { buildMainNode, getMainNode } from '../utils/tree-prompt-utils';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { removeColorContent } from '../utils/operation-string-utils';
import { TypePromptEnum } from '../enums/type-prompt-enum';
import { composeHtmlCssTemplate, getBasicTemplateInterfaceFromEvent } from '../utils/basic-template-utils';
import { ChatButtons } from '../chat-buttons/chat-buttons';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import {  getUserPromptSubAgent } from '../utils/system-prompt-utils';
import { EditorConfig, getEditors, orderSystem, orderSystemWithPublicity, systemPromptHelp, textHelp, titlesHelp } from '../utils/bill-constructor-utils';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';

@Component({
  selector: 'bill-constructor',
  imports: [CommonModule, NgClass, FormsModule, TreeModule, ChatButtons, RadioButtonModule, JoyrideModule],
  standalone: true,
  templateUrl: './bill-constructor.html',
  styleUrl: './bill-constructor.scss'
})
export class BillConstructor implements OnInit, OnDestroy, AfterViewInit{

  @ViewChildren('editorRef') editorRefs!: QueryList<ElementRef<HTMLDivElement>>;

  titleData: string= "Constructor";
  radioButton1: string ="Sin publicidad";
  radioButton2: string ="Con publicidad"
  selectedOption: string= '';
  selectedAgent: string= '';
  isFocused = signal(false);
  tree: TreeNode[]= [buildMainNode('Prompts', true)];
  editors = signal<EditorConfig[]>([]);
  private destroy$ = new Subject<void>();
  private index: string="";
  private editorBackup: string='';
  private readonly joyrideService = inject(JoyrideService);
  titlesHelp: any= titlesHelp();
  textHelp: any= textHelp();
  promptSystemHelp: any= systemPromptHelp();
  promptUser: string= '';
  placeHolderPromptUser: string= 'Escribe aquí el prompt del usuario para la generación de la imagen...';
  allowPromptUser: boolean= true;

  constructor(private serviceGeneral: ServiceGeneral,
    private executingRestFulService: ExecutingRestFulService){}
  
  ngOnInit(): void {
    this.selectedOption=this.radioButton1;
    this.editors.set(getEditors());
    this.handleDataUpdate('0', TypePromptEnum.BASIC_TEMPLATE, this.serviceGeneral.basicTemplateData$);
    this.handleDataUpdate('1', TypePromptEnum.SYNTHETIC_DATA, this.serviceGeneral.syntheticData$);
    this.handleDataUpdate('2', TypePromptEnum.PUBLICITY_DATA, this.serviceGeneral.publicityData$);
    this.subscribeUntilDestroyed(this.serviceGeneral.basicTemplate$, data => this.setBasicTemplateToEditor(data, this.index));
  }

  ngOnDestroy(): void {
    this.serviceGeneral.setBasicTemplate('');
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.onRadioChange(null);
      this.editorRefs.forEach(editor => {
        this.adjustHeight(editor.nativeElement);
      });
    }, 100);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.resizeAllTextareas();
  }

  resizeAllTextareas() {
    if(this.editorRefs!=undefined){
        this.editorRefs.forEach((editor) => {
        this.adjustHeight(editor.nativeElement);
      });
    }
  }

  private adjustHeight(el: HTMLDivElement) {
    el.style.height = 'auto';
    setTimeout(() => {
      el.style.height = el.scrollHeight + 'px';
    }, 0);
  }

 nodeSelect($event: any, item: EditorConfig, index: any) {
    this.index=index;
    this.editors.update(current => 
      current.map(e => 
        e.id === item.id ? { ...e } : e
      )
    );
    if($event?.node?.data){
      if($event?.node?.data?.type==TypePromptEnum.BASIC_TEMPLATE){
        let request= this.getBasicTemplateInterface($event?.node?.data?.data);
        this.executingRestFulService.getBasicTemplateById(request);
      }else{
        this.insertingInformationInTextarea($event?.node?.data, index);
      }
    }
  }

  updatePromptFromContentEditable(event: Event, editorId: string): void {
    const target = event.target as HTMLDivElement;
    const newValue = target.innerText;
    this.adjustHeight(target);
  }

  private setChildrenInTreeNode(label: string, type: string, 
      data: Array<PromptGenerationImageInterface> | Array<SyntheticDataInterface> | Array<BasicTemplateInterface>,
      nameFolder: string){
      let mother= buildMainNode(nameFolder, false);
      let mainNode= getMainNode(label,type,data);
      mother.children= mainNode?.children;
      return JSON.parse(JSON.stringify([mother]));
    }

  private updateSpecificEditor(id: string, changes: Partial<EditorConfig>): void {
    this.editors.update(current => 
      current.map(editor => 
        editor.id === id ? { ...editor, ...changes } : editor
      )
    );
  }

  private subscribeUntilDestroyed<T>(obs: Observable<T>, handler: (v: T) => void) {
    obs.pipe(takeUntil(this.destroy$)).subscribe(handler);
  }

  private handleDataUpdate(editorId: string, kind: TypePromptEnum, data$: Observable<any>) {
    this.subscribeUntilDestroyed(data$, (data) => {
      const node = this.setChildrenInTreeNode(kind, kind, data, kind);
      this.updateSpecificEditor(editorId, { tree: node, typePrompt: kind });
      if (kind === TypePromptEnum.SYSTEM_PROMPT) {
        this.onRadioChange(null);
      }
    });
  }

  private getBasicTemplateInterface($event:any):BasicTemplateInterface{
    return getBasicTemplateInterfaceFromEvent($event);
  }

  private setBasicTemplateToEditor(data: any, index: string){
    if(data && data?.["cssString"] && data?.["htmlString"]){
     const template= composeHtmlCssTemplate(data);
     this.insertStringIntoEditor(template, index);
    } 
  }
  
  private insertingInformationInTextarea($event: any, index: string){
    this.allowPromptUser = (index=='1')?false: this.allowPromptUser;
    this.insertStringIntoEditor('', index);  
    const formattedData = this.formatDataIfJson($event?.data);
    const coloredSpan = removeColorContent(formattedData, "rgb(0, 0, 0)");
    this.insertStringIntoEditor(coloredSpan, index);
  }

  private formatDataIfJson(data: string): string {
    if (!data) return data;
    try {
      const parsed = JSON.parse(data);
      const formatted = JSON.stringify(parsed, null, 2)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<pre style="white-space: pre-wrap; margin: 0; font-size: inherit;">${formatted}</pre>`;
    } catch {
      return data;
    }
  }

  private insertStringIntoEditor(coloredSpan: string, editorId: string) {
    setTimeout(() => {
      const editorsArray = this.editorRefs.toArray();
      const targetEditor = editorsArray.find(ref => {
        const el = ref.nativeElement;
        return el.id === editorId.toString();
      });
      if (targetEditor) {
        const el = targetEditor.nativeElement;
        el.innerHTML = coloredSpan;
        this.adjustHeight(el);
      }
    }, 0);
  }

  extractAllContent(promptOrder:Array<string>): Map<string,string> {
    let prompts: Map<string,string>= new Map<string,string>();
    const editorsArray = this.editorRefs.toArray();
    for(let i=0; i<promptOrder.length; i++){
      for(let j=0; j<editorsArray.length; j++){
          const el = editorsArray[j].nativeElement;
          if(promptOrder[i]==el.id){
            prompts.set(el.id,el.innerHTML);        
          }
      }
    }
  return prompts;
}

  emitEraseText($event: any, index: string){
    this.allowPromptUser = (index=='1');
    this.insertStringIntoEditor('', index);
  }

  onRadioChange($event:any){
    let backup=this.setEditorBackup();
    if(this.selectedOption==this.radioButton1){
      let typePrompts= orderSystem();  
      this.setEditors(backup, typePrompts);
    }else{
      let typePrompts= orderSystemWithPublicity();
      this.setEditors(backup, typePrompts);
    }
    this.resizeAllTextareas();
  }

  private setEditorBackup(): EditorConfig[]{
    if(this.editorBackup==''){
      this.editorBackup = JSON.stringify(this.editors(), (key, value) => {
        if (key === 'parent') return undefined;
        return value;
      });
    }
    return JSON.parse(this.editorBackup);
  }

  private setEditors(backup: EditorConfig[], typePrompts: Array<string>){  
    const filtered = backup.filter(item => typePrompts.includes(item.typePrompt));
    this.editors.set(filtered);
    this.editorRefs?.forEach(ref => {
        ref.nativeElement.innerHTML = '';
    });
  }

  generateImage($event: any){
      this.setUserPrompt();
      this.serviceGeneral.setChangeComponent('bill-agent-data');
  }

  private setUserPrompt(){
    let prompt= '';
    if(this.selectedOption==this.radioButton1){
      let mapPrompt: Map<string,string>= this. extractAllContent(["0","1"]);
      let systemPrompt= getUserPromptSubAgent(mapPrompt.get("0"),mapPrompt.get("1"), undefined ,this.promptUser);
      prompt= JSON.stringify(systemPrompt);
    }else{
      let mapPrompt: Map<string,string>= this. extractAllContent(["0","1","2"]);
      let systemPrompt= getUserPromptSubAgent(mapPrompt.get("0"),mapPrompt.get("1"), mapPrompt.get("2"), this.promptUser);
      prompt= JSON.stringify(systemPrompt);
    }
    this.serviceGeneral.setSelectedPromptBill(prompt);
  }


  startTour() {
    const dynamicSteps = this.editors().map(item => `treeStep_${item.id}`);
    this.joyrideService.startTour({ steps: ['modeStep', ...dynamicSteps] });
  }
}
