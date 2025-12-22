import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { TabsModule } from 'primeng/tabs';
import { createNewObjTab } from '../utils/tab-operations-utils'
import { TabsDefectInterface } from '../models/tabs-defect-interface';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { GlobalDefectInterface } from '../models/global-defect-interface';
import { ChatButtons } from '../chat-buttons/chat-buttons';
import { PromptAndDataToValidateInterface } from '../models/prompts-and-data-to-validate-interface';
import { getSavePromptGlobalDefect, getHeaderDialogGlobalDefect } from '../utils/dialog-parameters-utils';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { getConfigurationTabGlobalDefect } from '../utils/tab-configuration-utils';
import { ServiceGeneral } from '../service/service-general';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'bill-editor-defect',
  imports: [CommonModule, SplitterModule, TabsModule, CheckboxModule, FormsModule, ChatButtons],
  standalone: true,
  templateUrl: './bill-editor-defect.html',
  styleUrl: './bill-editor-defect.scss'
})
export class BillEditorDefect implements OnInit{

  tabs: Array<TabsDefectInterface>= [];
  selectedStainDefects: Array<GlobalDefectInterface>=[];
  itemsSavePrompt: Array<any>=[];
  headerDialog: Array<any>=[];
  promptAndDataToValidate: PromptAndDataToValidateInterface={};
  desiredOrder= getConfigurationTabGlobalDefect();
  private destroy$ = new Subject<void>();

  constructor(private executingRestFulService: ExecutingRestFulService,
    private serviceGeneral: ServiceGeneral){}

  ngOnInit(): void {
    this.serviceGeneral.globalDefect$.pipe(takeUntil(this.destroy$)).subscribe(data=>this.setTabs(data));
    this.serviceGeneral.setImageGenerated('');
    this. itemsSavePrompt= getSavePromptGlobalDefect();
    this.headerDialog= getHeaderDialogGlobalDefect();
  }

  private setTabs(defects: Array<GlobalDefectInterface>){
    this.desiredOrder.forEach((item, index) => {
      const defectArray=  defects.filter(defect=>defect.category==item.category);
      const obj= this.setObjetForTab(defectArray, item.title, item.category, index.toString());
      this.tabs=createNewObjTab(this.tabs,obj,item.category);
    });
  }
  private setObjetForTab(data?: any, title?: string, type?: string, value?: string){
    return {
      value:value,
      title: title,
      defects: data,
      type: type
    }
  }

  emitSavePrompt($event: any){
    if(this.selectedStainDefects.length!=0){
      const prompt= this.selectedStainDefects.map((item, index)=>`${index+1}. ${item.prompt}`).join('<br>');
      const request= this.getRequest(prompt, $event.name)
      this.executingRestFulService.savePromptGlobalDefect(request);
    }
  }

  private getRequest(prompt: string, name: string): PromptGenerationImageInterface{
    return  {
            id: null,
            prompt: prompt,
            name: name
          };
  }
}
