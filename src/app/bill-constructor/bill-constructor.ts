import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { ServiceGeneral } from '../service/service-general';
import { Subject, takeUntil } from 'rxjs';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { BasicTemplateInterface } from '../models/basic-template-interface';
import { buildMainNode, getMainNode } from '../utils/tree-prompt-utils';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { removeColorContent } from '../utils/operation-string-utils';
import { TypePromptEnum } from '../enums/type-prompt-enum';
import { ChatButtons } from '../chat-buttons/chat-buttons';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { getSystemPrompt } from '../utils/system-prompt-utils';

interface EditorConfig {
  id: string;
  tree: any[]; 
  styledPrompt: string;
  typePrompt: string;
}

@Component({
  selector: 'bill-constructor',
  imports: [CommonModule, NgClass, FormsModule, TreeModule, ChatButtons, RadioButtonModule],
  standalone: true,
  templateUrl: './bill-constructor.html',
  styleUrl: './bill-constructor.scss'
})
export class BillConstructor implements OnInit, OnDestroy{

  @ViewChildren('editorRef') editorRefs!: QueryList<ElementRef<HTMLDivElement>>;

  titleData: string= "Constructor";
  radioButton1: string ="Prompt de sistema"
  radioButton2: string ="Prompt de usuario"
  selectedOption: string= '';
  isFocused = signal(false);
  tree: TreeNode[]= [buildMainNode('Prompts', true)];
  treeTwo: TreeNode[]= [buildMainNode('Prompts', true)];
  selectedNode: TreeNode | null =null;
  selectedNodeTwo: TreeNode | null =null;
  selectedNodeThree: TreeNode | null =null;
  editors = signal<EditorConfig[]>([]);
  private destroy$ = new Subject<void>();
  private index: string="";
  private editorBackup: string='';

  constructor(private serviceGeneral: ServiceGeneral,
    private executingRestFulService: ExecutingRestFulService){}
  
  ngOnInit(): void {
    this.selectedOption=this.radioButton1;
    this.editors.set([
        { id: '0', tree: [], styledPrompt: '', typePrompt:''},
        { id: '1', tree: [], styledPrompt: '', typePrompt:'' },
        { id: '2', tree: [], styledPrompt: '', typePrompt:'' }
      ]);
    this.serviceGeneral.basicTemplateData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      const node= this.setChildrenInTreeNode( TypePromptEnum.BASIC_TEMPLATE,TypePromptEnum.BASIC_TEMPLATE, data, TypePromptEnum.BASIC_TEMPLATE);
      this.updateSpecificEditor('0', { tree: node, typePrompt: TypePromptEnum.BASIC_TEMPLATE });
    });
    this.serviceGeneral.syntheticData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      const node = this.setChildrenInTreeNode(TypePromptEnum.SYNTHETIC_DATA,TypePromptEnum.SYNTHETIC_DATA, data, TypePromptEnum.SYNTHETIC_DATA);
      this.updateSpecificEditor('1', { tree: node, typePrompt: TypePromptEnum.SYNTHETIC_DATA });
    });
    this.serviceGeneral.promptSystem$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      const node = this.setChildrenInTreeNode( TypePromptEnum.SYSTEM_PROMPT,TypePromptEnum.SYSTEM_PROMPT, data, TypePromptEnum.SYSTEM_PROMPT);
      this.updateSpecificEditor('2', { tree: node, typePrompt: TypePromptEnum.SYSTEM_PROMPT });
    });
    this.serviceGeneral.basicTemplate$.pipe(takeUntil(this.destroy$)).subscribe(data=>this.setBasicTemplateToEditor(data, this.index));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.resizeAllTextareas();
  }

  resizeAllTextareas() {
    this.editorRefs.forEach((editor) => {
      this.adjustHeight(editor.nativeElement);
    });
  }

  private adjustHeight(el: HTMLDivElement) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
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

  private getBasicTemplateInterface($event:any):BasicTemplateInterface{
    return {
        id: $event.id,
        htmlString: "",
        cssString: "",
        name: ""
      }; 
  }

  private setBasicTemplateToEditor(data: any, index: string){
    if(data && data?.["cssString"] && data?.["htmlString"]){
     const template= `<style>${data?.["cssString"]}</style>${data?.["htmlString"]}`;
     this.insertStringIntoEditor(template, index);
    } 
  }
  
  private insertingInformationInTextarea($event: any, index: string){
    this.insertStringIntoEditor('', index);  
    const coloredSpan = removeColorContent($event?.data, "rgb(0, 0, 0)");
    this.insertStringIntoEditor(coloredSpan, index);
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
    this.insertStringIntoEditor('', index);
  }

  onRadioChange($event:any){
    let backup=this.setEditorBackup();
    if(this.selectedOption==this.radioButton1){
      let typePrompts= [TypePromptEnum.BASIC_TEMPLATE,
        TypePromptEnum.SYNTHETIC_DATA, TypePromptEnum.SYSTEM_PROMPT];  
      this.setEditors(backup, typePrompts);
    }else{
      let typePrompts= [TypePromptEnum.SYNTHETIC_DATA];
      this.setEditors(backup, typePrompts);
    }
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
    if(this.selectedOption==this.radioButton1){
      let mapPrompt: Map<string,string>= this. extractAllContent(["0","1","2"]);
      let systemPrompt= getSystemPrompt(mapPrompt.get("0"),mapPrompt.get("1"),mapPrompt.get("2"));
      const prompt= JSON.stringify(systemPrompt);
      this.serviceGeneral.setSelectedPromptBill(prompt);
    }
    this.serviceGeneral.setChangeComponent('show-template');
  }

}
