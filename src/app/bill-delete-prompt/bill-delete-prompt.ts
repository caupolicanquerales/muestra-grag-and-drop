import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { ServiceGeneral } from '../service/service-general';
import { Subject, takeUntil } from 'rxjs';
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
    this.serviceGeneral.promptImages$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.setTabs(this.tabTitle[TabDeletePromptCategory.IMAGE], TabDeletePromptCategory.IMAGE, data, "1");
    });
    this.serviceGeneral.promptData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.setTabs(this.tabTitle[TabDeletePromptCategory.DATA], TabDeletePromptCategory.DATA, data, "2");
    });
    this.serviceGeneral.promptBills$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.setTabs(this.tabTitle[TabDeletePromptCategory.BILL], TabDeletePromptCategory.BILL, data, "3");
    });
    this.serviceGeneral.promptSystem$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.setTabs(this.tabTitle[TabDeletePromptCategory.SYSTEM], TabDeletePromptCategory.SYSTEM, data, "4");
    });
    this.serviceGeneral.syntheticData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.setTabs(this.tabTitle[TabDeletePromptCategory.SYNTHETIC], TabDeletePromptCategory.SYNTHETIC, data, "5");
    });
    this.serviceGeneral.publicityData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.setTabs(this.tabTitle[TabDeletePromptCategory.PUBLICITY], TabDeletePromptCategory.PUBLICITY, data, "6");
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();  
  }

  selectItem($event:any, type: string):void{
    this.headerDialogTitle= this.headerTitles[type];
    this.selectedPrompt={type: type, prompt: $event};
    this.visible=true;
  }

  deletePrompt($event: any){
    const request= this.getPromptGenerationImageInterface(this.selectedPrompt?.prompt);
    const requestSynthetic= this.getPromptSyntheticDataInterface(this.selectedPrompt?.prompt);
    if(this.selectedPrompt?.type==TabDeletePromptCategory.IMAGE){
      this.executingRestFulService.deletePromptImageById(request);
    }else if(this.selectedPrompt?.type==TabDeletePromptCategory.DATA){
      this.executingRestFulService.deletePromptDataById(request);
    }else if(this.selectedPrompt?.type==TabDeletePromptCategory.BILL){
      this.executingRestFulService.deletePromptBillById(request);
    }else if(this.selectedPrompt?.type==TabDeletePromptCategory.SYSTEM){
      this.executingRestFulService.deletePromptSystemById(request);
    }else if(this.selectedPrompt?.type==TabDeletePromptCategory.SYNTHETIC){
      this.executingRestFulService.deleteSyntheticDataById(requestSynthetic);
    }else if(this.selectedPrompt?.type==TabDeletePromptCategory.PUBLICITY){
      this.executingRestFulService.deletePublicityDataById(requestSynthetic);
    }
    this.visible=false;
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
