import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { ServiceGeneral } from '../service/service-general';
import { Subject, takeUntil, Observable } from 'rxjs';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { createNewObjTab, sortedTabs } from '../utils/tab-operations-utils'
import { getConfigurationTabDeletePrompt, getDeletePromptTabName, getHeaderDialogTitle, TabDeletePromptCategory } from '../utils/tab-configuration-utils';

@Component({
  selector: 'bill-delete-prompt',
  imports: [CommonModule, SplitterModule, TableModule, ButtonModule, TabsModule, DialogModule],
  standalone: true,
  templateUrl: './bill-delete-prompt.html',
  styleUrl: './bill-delete-prompt.scss'
})
export class BillDeletePrompt implements OnInit, OnDestroy{

  tabTitle: any = getDeletePromptTabName();
  tabs: Array<any>= [];
  headerTitles: any= getHeaderDialogTitle();
  headerDialogTitle: string="";
  visible: boolean= false;
  selectedPrompt: any={};
  private destroy$ = new Subject<void>();
  desiredOrder=getConfigurationTabDeletePrompt();
  private orderMap: any = {};
  private amountOfTabs: number= 6;

  constructor(private serviceGeneral: ServiceGeneral, private executingRestFulService: ExecutingRestFulService){}

  ngOnInit(): void {
    this.serviceGeneral.setImageGenerated('');
    this.desiredOrder.forEach((name, index) => {this.orderMap[name] = index;});
    const tabs = [
      { obs: this.serviceGeneral.promptImages$, title: this.tabTitle[TabDeletePromptCategory.IMAGE], cat: TabDeletePromptCategory.IMAGE, num: '1' },
      { obs: this.serviceGeneral.promptData$, title: this.tabTitle[TabDeletePromptCategory.DATA], cat: TabDeletePromptCategory.DATA, num: '2' },
      { obs: this.serviceGeneral.promptBills$, title: this.tabTitle[TabDeletePromptCategory.BILL], cat: TabDeletePromptCategory.BILL, num: '3' },
      { obs: this.serviceGeneral.promptSystem$, title: this.tabTitle[TabDeletePromptCategory.SYSTEM], cat: TabDeletePromptCategory.SYSTEM, num: '4' },
      { obs: this.serviceGeneral.syntheticData$, title: this.tabTitle[TabDeletePromptCategory.SYNTHETIC], cat: TabDeletePromptCategory.SYNTHETIC, num: '5' },
      { obs: this.serviceGeneral.publicityData$, title: this.tabTitle[TabDeletePromptCategory.PUBLICITY], cat: TabDeletePromptCategory.PUBLICITY, num: '6' },
    ];

    tabs.forEach(t => this.subscribeUntilDestroyed(t.obs as Observable<any>, data => this.setTabs(t.title, t.cat, data, t.num)));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();  
  }

  private subscribeUntilDestroyed<T>(obs: Observable<T>, handler: (v: T) => void) {
    obs.pipe(takeUntil(this.destroy$)).subscribe(handler);
  }

  selectItem($event:any, type: string):void{
    this.headerDialogTitle= this.headerTitles[type];
    this.selectedPrompt={type: type, prompt: $event};
    this.visible=true;
  }

  deletePrompt($event: any){
    const request = this.getPromptGenerationImageInterface(this.selectedPrompt?.prompt);
    const requestSynthetic = this.getPromptSyntheticDataInterface(this.selectedPrompt?.prompt);

    const actions: Record<string, () => void> = {
      [TabDeletePromptCategory.IMAGE]: () => this.executingRestFulService.deletePromptImageById(request),
      [TabDeletePromptCategory.DATA]: () => this.executingRestFulService.deletePromptDataById(request),
      [TabDeletePromptCategory.BILL]: () => this.executingRestFulService.deletePromptBillById(request),
      [TabDeletePromptCategory.SYSTEM]: () => this.executingRestFulService.deletePromptSystemById(request),
      [TabDeletePromptCategory.SYNTHETIC]: () => this.executingRestFulService.deleteSyntheticDataById(requestSynthetic),
      [TabDeletePromptCategory.PUBLICITY]: () => this.executingRestFulService.deletePublicityDataById(requestSynthetic),
    };

    const action = actions[this.selectedPrompt?.type];
    if (action) action();
    this.visible = false;
  }

  private setPagination(array: Array<any>){
    return array.length!=0;
  }

  private setObjetForTab(data: Array<PromptGenerationImageInterface> | Array<SyntheticDataInterface>, title: string,
    pagination: boolean, type: string, value: string){
      return {
        value:value,
        title: title,
        pagination: pagination,
        dataValue: data,
        type: type
      }
  }

  private getPromptGenerationImageInterface(info: any):PromptGenerationImageInterface{
    return {
      id: info?.id,
      prompt: "",
      name: ""
    };
  }
  
  private getPromptSyntheticDataInterface(info: any):SyntheticDataInterface{
    return {
      id: info?.id,
      data: "",
      name: ""
    };
  } 

  private setTabs(tabTitle: string, tabCategory: string, data: Array<PromptGenerationImageInterface> | Array<SyntheticDataInterface>, numberOfTab:string){
    const page= this.setPagination(data);
    const obj= this.setObjetForTab(data, tabTitle ,page, tabCategory, numberOfTab);
    this.tabs=createNewObjTab(this.tabs,obj,tabCategory);
    this.tabs= sortedTabs(this.tabs,this.orderMap, this.amountOfTabs);
  }
}
