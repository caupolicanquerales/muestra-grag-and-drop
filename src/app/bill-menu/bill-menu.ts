import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ServiceGeneral } from '../service/service-general';
import { HttpClientService } from '../service/http-client-service';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { bfsSearchNodeToInsertFunctionCommand } from '../utils/bfs-search-node-utils';
import { Subject, takeUntil, Observable } from 'rxjs';
import { TypePromptEnum } from '../enums/type-prompt-enum';

@Component({
  selector: 'bill-menu',
  imports: [CommonModule, TieredMenuModule, AvatarModule, ProgressSpinnerModule],
  templateUrl: './bill-menu.html',
  styleUrl: './bill-menu.scss'
})
export class BillMenu implements OnInit, OnDestroy{

  items: MenuItem[] =  [];
  templates: any= {};
  menuTitle: string= $localize`menuTitle`;
  promptsImages: any= [];
  promptsBills: any= [];
  promptsData: any= [];
  itemPrompt: MenuItem[] =  [];
  itemPromptImages: MenuItem[] =  [];
  itemPromptBills: MenuItem[] =  [];
  itemPromptData: MenuItem[] =  [];
  isUploading = signal(false);
  upMenu: boolean= true;
  private eraseOptionData: string= "Datos";
  private eraseAction: string= "Borrar";
  private handlerFunction: any;
  private destroy$ = new Subject<void>();
  private menuLoaded = false;

  constructor(private serviceGeneral: ServiceGeneral, private httpClient:HttpClientService,
    private executingRestFulService: ExecutingRestFulService ){}

  ngOnInit(): void {
    this.handlerFunction = (event:any) => this.handleMenuClick(event);
    this.httpClient.getMenuConfigFromRepository().subscribe(data=> {
      this.items = data;
      this.menuLoaded = true;
      this.refreshMenu();
    });
    const restCalls = [
      () => this.executingRestFulService.getAllPromptImages(),
      () => this.executingRestFulService.getAllPromptBill(),
      () => this.executingRestFulService.getAllPromptData(),
      () => this.executingRestFulService.getAllSyntheticData(),
      () => this.executingRestFulService.getAllBasicTemplate(),
      () => this.executingRestFulService.getAllPromptGlobalDefect(),
      () => this.executingRestFulService.getAllGlobalDefects(),
      () => this.executingRestFulService.getAllPromptSystem(),
      () => this.executingRestFulService.getAllPublicityData(),
    ];
    restCalls.forEach(fn => fn());

    this.serviceGeneral.isUploadingAnimation$.pipe(takeUntil(this.destroy$)).subscribe(data=>this.isUploading.set(data));
    this.subscribeUntilDestroyed(this.serviceGeneral.promptImages$, data => this.handlePromptsObservable(data, 'promptsImages', 'itemPromptImages', TypePromptEnum.IMAGE_PROMPT));
    this.subscribeUntilDestroyed(this.serviceGeneral.promptBills$, data => this.handlePromptsObservable(data, 'promptsBills', 'itemPromptBills', TypePromptEnum.BILL_PROMPT));
    this.subscribeUntilDestroyed(this.serviceGeneral.promptData$, data => this.handlePromptsObservable(data, 'promptsData', 'itemPromptData', TypePromptEnum.DATA_PROMPT));
    this.httpClient.getTemplates().subscribe(data=>this.templates=data);
    this.httpClient.getPromptsFromRepository().subscribe(data=>{
      this.itemPrompt=  this.setItemsForPrompt(data)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeUntilDestroyed<T>(obs: Observable<T>, handler: (v: T) => void) {
    obs.pipe(takeUntil(this.destroy$)).subscribe(handler);
  }

  handleMenuClick(event:any){
    this.changingTemplate(event);
    this.getSelectecPrompt(event);
    this.setEraseAction(event);
  }

  private conditionToGetTemplate( parent: string): boolean{
    return this.templates[parent]!= undefined && this.templates[parent].length!=0;
  }

  private getTemplateName(parent: string, label: string): string {
    const object= this.templates[parent].filter((item:any)=>item['label']==label)[0];
    return object!=undefined?object['templateName']:'no-template';
  }

  private setItemsForPrompt( prompts: Array<any>): MenuItem[]{
    let item= new Array<MenuItem>();
    prompts.map(prompt=>{
      item.push({label:prompt['name']})
    });
    return item;
  }

  private changingTemplate(event:any){
    if(this.conditionToGetTemplate(event['item']['parent']) || this.conditionToGetTemplate(event['item']['grandParent'])){
      const label= this.getLabelForTemplate(event);
      const parent= this.getParentForTemplate(event);
      const templateName= this.getTemplateName(parent, label);
      if(templateName!=undefined){
        this.serviceGeneral.setChangeComponent(templateName);
      }
    }
  }

  private getLabelForTemplate(event: any){
    if(event['item']['grandParent'] && event['item']['grandParent']!="mother"){
      return event['item']['parent'];
    }
    return event['item']['label'];
  }

  private getParentForTemplate(event: any){
    if(event['item']['grandParent'] && event['item']['grandParent']!="mother"){
      return event['item']['grandParent'];
    }
    return event['item']['parent'];
  }

  private getSelectecPrompt(event:any){
    if(event['item']['parent']==TypePromptEnum.DATA_PROMPT){
      this.setExtractedPrompt(this.promptsData, event['item']['label']);
    }else if(event['item']['parent']==TypePromptEnum.IMAGE_PROMPT){
      const promptBill= this.setExtractedPrompt(this.promptsImages, event['item']['label']);
      this.serviceGeneral.setSelectedPromptBill(promptBill);
    }else if(event['item']['parent']==TypePromptEnum.BILL_PROMPT){
      const promptBill= this.setExtractedPrompt(this.promptsBills, event['item']['label']);
      this.serviceGeneral.setSelectedPromptBill(promptBill);
    }
  }

  private setExtractedPrompt(prompts: any, label: string): string{
    const promptSelected= this.extractingPrompt(prompts, label);
    this.serviceGeneral.setSelectedPrompt(promptSelected);
    return promptSelected;
  }

  private extractingPrompt(prompts: Array<any>, label: string): string{
    const prompt= prompts.filter((prompt:any)=>prompt['name']==label);
    return  prompt.length==1? prompt[0]['prompt']: '';
  }

  private setEraseAction(event:any){
    if(event['item']['parent']==this.eraseOptionData && event['item']['label']==this.eraseAction) {
      this.serviceGeneral.setSelectedPrompt('');
    }
  }

  private handlePromptsObservable(prompts: Array<PromptGenerationImageInterface>, assignTargetKey: 'promptsImages'|'promptsBills'|'promptsData', itemTargetKey: 'itemPromptImages'|'itemPromptBills'|'itemPromptData', typePrompt: string){
    const safePrompts = Array.isArray(prompts) ? prompts : [];
    (this as any)[assignTargetKey] = safePrompts;
    (this as any)[itemTargetKey] = this.setItemsForPrompt(safePrompts);
    if (this.menuLoaded) {
      this.bfsSearchNodeFromObservable((this as any)[itemTargetKey], typePrompt);
    }
  }

  private bfsSearchNodeFromObservable(promptsMenu: MenuItem[], typePrompt: string){
    if (!this.items || this.items.length === 0) return;
    const freshItemsCopy: MenuItem[] = JSON.parse(JSON.stringify(this.items));
    let tree={ label:'mother', items: freshItemsCopy }
    const newItems = bfsSearchNodeToInsertFunctionCommand(tree, this.handlerFunction, promptsMenu, typePrompt);
    this.items= newItems;
  }

  private refreshMenu(): void {
    if (!this.menuLoaded) return;
    this.bfsSearchNodeFromObservable(this.itemPromptImages, TypePromptEnum.IMAGE_PROMPT);
    this.bfsSearchNodeFromObservable(this.itemPromptBills, TypePromptEnum.BILL_PROMPT);
    this.bfsSearchNodeFromObservable(this.itemPromptData, TypePromptEnum.DATA_PROMPT);
  }
}
