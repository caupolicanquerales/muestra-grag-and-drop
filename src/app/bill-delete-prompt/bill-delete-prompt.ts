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
import { getConfigurationTabDeletePrompt, TabDeletePromptCategory } from '../utils/tab-configuration-utils';

@Component({
  selector: 'bill-delete-prompt',
  imports: [CommonModule, SplitterModule, TableModule, ButtonModule, TabsModule, DialogModule],
  standalone: true,
  templateUrl: './bill-delete-prompt.html',
  styleUrl: './bill-delete-prompt.scss'
})
export class BillDeletePrompt implements OnInit, OnDestroy{

  titleTableImage: string= "Prompt imagen";
  titleTableData: string= "Prompt dato";
  titleTableBill: string= "Prompt factura";
  titleTableSynthetic: string= "Dato sintético";
  tabs: Array<any>= [];
  headerTitles: any={
    image:"Esta por eliminar un prompt imagen",
    bill:"Esta por eliminar un prompt factura",
    data:"Esta por eliminar un prompt dato",
    synthetic:"Esta por eliminar un dato sintético"
  };
  headerDialogTitle: string="";
  visible: boolean= false;
  selectedPrompt: any={};
  private destroy$ = new Subject<void>();
  desiredOrder=getConfigurationTabDeletePrompt();
  private orderMap: any = {};
  private amountOfTabs: number= 4;

  constructor(private serviceGeneral: ServiceGeneral, private executingRestFulService: ExecutingRestFulService){}

  ngOnInit(): void {
    this.serviceGeneral.setImageGenerated('');
    this.desiredOrder.forEach((name, index) => {this.orderMap[name] = index;});
    this.serviceGeneral.promptImages$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      const page= this.setPagination(data);
      const obj= this.setObjetForTab(data, this.titleTableImage,page, TabDeletePromptCategory.IMAGE, "1");
      this.tabs=createNewObjTab(this.tabs,obj,TabDeletePromptCategory.IMAGE);
      this.tabs= sortedTabs(this.tabs,this.orderMap, this.amountOfTabs);
    });
    this.serviceGeneral.promptBills$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      const page= this.setPagination(data);
      const obj= this.setObjetForTab(data, this.titleTableBill,page, TabDeletePromptCategory.BILL, "3");
      this.tabs=createNewObjTab(this.tabs,obj,TabDeletePromptCategory.BILL);
      this.tabs= sortedTabs(this.tabs,this.orderMap, this.amountOfTabs);
    });
    this.serviceGeneral.promptData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      const page= this.setPagination(data);
      const obj= this.setObjetForTab(data, this.titleTableData,page, TabDeletePromptCategory.DATA, "2");
      this.tabs=createNewObjTab(this.tabs,obj,TabDeletePromptCategory.DATA);
      this.tabs= sortedTabs(this.tabs,this.orderMap, this.amountOfTabs);
    });
    this.serviceGeneral.syntheticData$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      const page= this.setPagination(data);
      const obj= this.setObjetForTab(data, this.titleTableSynthetic,page, TabDeletePromptCategory.SYNTHETIC, "4");
      this.tabs=createNewObjTab(this.tabs,obj,TabDeletePromptCategory.SYNTHETIC);
      this.tabs= sortedTabs(this.tabs,this.orderMap, this.amountOfTabs);
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
    }else if(this.selectedPrompt?.type==TabDeletePromptCategory.SYNTHETIC){
      this.executingRestFulService.deleteSyntheticDataById(requestSynthetic);
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
}
