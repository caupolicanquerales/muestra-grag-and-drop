import { Component, Input, OnInit, Signal, signal } from '@angular/core';
import { EditorConfig } from '../utils/bill-constructor-utils';
import { CommonModule, NgClass } from '@angular/common';
import { ChatButtons } from '../reusable-component/chat-buttons/chat-buttons';
import { getHeaderDialogJsonSkeleton, getSaveFormartJsonSkeleton } from '../utils/dialog-parameters-utils';
import { TypePromptEnum } from '../enums/type-prompt-enum';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';

@Component({
  selector: 'bill-json-skeleton',
  standalone: true,
  imports: [CommonModule, NgClass, ChatButtons],
  templateUrl: './bill-json-skeleton.html',
  styleUrl: './bill-json-skeleton.scss'
})
export class BillJsonSkeleton implements OnInit {

  @Input() set information(value: EditorConfig[]) {
    this.editors.set(value);
  }

  titleData: string= "Información del template";
  isFocused = signal(false);
  editors = signal<EditorConfig[]>([]);
  itemsSavePrompt: Map<any, any>=new Map();
  headerDialog: Map<any, any>=new Map();

  constructor(private executingRestFulService: ExecutingRestFulService) {}

  ngOnInit(): void {
    this.headerDialog = getHeaderDialogJsonSkeleton();
    this.itemsSavePrompt = getSaveFormartJsonSkeleton();
  }

  updatePromptFromContentEditable(event: Event, editorId: string): void {
    const target = event.target as HTMLDivElement;
    const newValue = target.innerText;
    this.adjustHeight(target);
  }

  private adjustHeight(el: HTMLDivElement) {
    el.style.height = 'auto';
    setTimeout(() => {
      el.style.height = el.scrollHeight + 'px';
    }, 0);
  }

  emitSavePrompt($event: any, id: string): void {
      const textToCopy = this.getTextToCopy(id); 
      const actions: Record<string, () => void> = {
        [TypePromptEnum.SYNTHETIC_DATA]: () => this.executingRestFulService.saveSyntheticData(this.getSyntheticRequest(textToCopy, $event.name)),
        [TypePromptEnum.PUBLICITY_DATA]: () => this.executingRestFulService.savePublicityData(this.getSyntheticRequest(textToCopy, $event.name)),
      };
  
      const action = actions[$event?.typePrompt];
      if (action) action();
  }

  private getTextToCopy(id: string): string{
    const contentElement = document.getElementById(id);
    if (!contentElement) {
      return '';
    }
    return contentElement.innerHTML;
  }

  private getSyntheticRequest(textToCopy: string, name: string): SyntheticDataInterface{
    return {
      id: null,
      data: textToCopy,
      name: name
    } 
  }

  getHeaderDialog(typePrompt: string): Array<any>{
    const header = this.headerDialog.get(typePrompt);
    return header ? header : [];
  }
  
  getItemsSavePrompt(typePrompt: string): Array<any>{
    const items = this.itemsSavePrompt.get(typePrompt);
    return items ? items : [];
  }

}
