import { Component, Input, Signal, signal } from '@angular/core';
import { EditorConfig } from '../utils/bill-constructor-utils';
import { CommonModule, NgClass } from '@angular/common';
import { ChatButtons } from '../chat-buttons/chat-buttons';

@Component({
  selector: 'bill-json-skeleton',
  standalone: true,
  imports: [CommonModule, NgClass, ChatButtons],
  templateUrl: './bill-json-skeleton.html',
  styleUrl: './bill-json-skeleton.scss'
})
export class BillJsonSkeleton {

  @Input() set information(value: EditorConfig[]) {
    this.editors.set(value);
  }

  titleData: string= "Información del template";
  isFocused = signal(false);
  editors = signal<EditorConfig[]>([]);

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

  emitSavePrompt($event: any, index: string){
    
  }

}
