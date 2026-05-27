import { CommonModule, NgClass } from '@angular/common';
import { Component, computed, ElementRef, EventEmitter, Input, Output, QueryList, signal, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { ChatButtons } from '../chat-buttons/chat-buttons';
import { RadioButtonModule } from 'primeng/radiobutton';
import { JoyrideModule } from 'ngx-joyride';
import { EditorConfig } from '../../utils/bill-constructor-utils';

@Component({
  selector: 'editor-template',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, TreeModule, ChatButtons, RadioButtonModule, JoyrideModule],
  templateUrl: './editor-template.html',
  styleUrl: './editor-template.scss',
})
export class EditorTemplate {

  @ViewChildren('editorRef') editorRefs!: QueryList<ElementRef<HTMLDivElement>>;
  
  @Input()
  editors = signal<EditorConfig[]>([]);
  @Input()
  hasBasicTemplate = signal(false);
  @Input()
  hasSyntheticData = signal(false);
  @Input()
  hasPublicityData = signal(false);
  @Input()
  modalHint = signal<number | null>(null);
  @Input()
  hasEditorContent = signal<{[key: string]: boolean}>({}); 
  @Input()
  textHelp: any= {}; 
  @Input()
  titles: any = {};
  @Input()
  processButtonTooltipHeader: string= "";
  @Input()
  promptUser: string = '';
  @Input()
  generarButton: string = 'Generar';

  @Output()
  submitGenerateImage: EventEmitter<string>= new EventEmitter<string>();
  @Output()
  eraseTextEvent: EventEmitter<{ event: any; index: number }> = new EventEmitter<{ event: any; index: number }>();
  @Output()
  updatePromptEvent: EventEmitter<{ event: Event; item: EditorConfig }> = new EventEmitter<{ event: Event; item: EditorConfig }>();
  @Output()
  nodeSelectEvent: EventEmitter<{ event: any; item: EditorConfig; index: any }> = new EventEmitter<{ event: any; item: EditorConfig; index: any }>();
  @Output()
  promptUserChange: EventEmitter<string> = new EventEmitter<string>();

  isFocused = signal(false);
  hintBasicTemplate = computed(() => this.modalHint() === 0 || this.modalHint() === 2);
  hintSyntheticData = computed(() => this.modalHint() === 1 || this.modalHint() === 2);
  showConnector0 = computed(() => this.hasBasicTemplate() && this.editors().length >= 2);
  showConnector1 = computed(() => this.hasSyntheticData() && this.editors().length >= 2);
  showConnector2 = computed(() => this.hasPublicityData() && this.editors().length >= 3);
  showConnectorSintToPub = computed(() => this.hasSyntheticData() && this.hasPublicityData() && this.editors().length >= 3);
  showConnectorToPrompt = computed(() => {
    if (this.editors().length >= 3) {
      return this.showConnector0()
          || (this.showConnector1() && (!this.showConnector2() || this.showConnector0()))
          || (this.showConnector2() && !this.showConnector1());
    }
    return this.showConnector0() || this.showConnector1();
  });
  showTemplateWarning = computed(() =>
    this.hasSyntheticData() && this.hasPublicityData() && !this.hasBasicTemplate()
  );
  showTemplateOnly = computed(() =>
    this.hasBasicTemplate() && !this.hasSyntheticData() && !this.hasPublicityData()
  );
  showCommandCenter = computed(() => this.hasBasicTemplate() && this.hasSyntheticData());
  allowPromptUser = computed(() =>
    !this.hasSyntheticData() && !this.hasPublicityData()
  );

  clearModalHint(): void {
    this.modalHint.set(null);
  }

  emitEraseText($event: any, index: number){
    this.eraseTextEvent.emit({ event: $event, index });
  }

  updatePromptFromContentEditable(event: Event, item: EditorConfig): void {
    this.updatePromptEvent.emit({ event, item });
  }

  generateImage($event: any){
     this.submitGenerateImage.emit($event);
  }

  nodeSelect($event: any, item: EditorConfig, index: any) {
    this.nodeSelectEvent.emit({ event: $event, item, index });
  }

  onPromptUserChange(value: string): void {
    this.promptUser = value;
    this.promptUserChange.emit(value);
  }

  adjustAllEditorsHeight(): void {
    if (!this.editorRefs) {
      return;
    }
    this.editorRefs.forEach((editor) => {
      this.adjustHeight(editor.nativeElement);
    });
  }

  clearAllEditors(): void {
    if (!this.editorRefs) {
      return;
    }
    this.editorRefs.forEach((ref) => {
      ref.nativeElement.innerHTML = '';
      this.adjustHeight(ref.nativeElement);
    });
  }

  setEditorContent(coloredSpan: string, editorId: string): void {
    setTimeout(() => {
      const editorsArray = this.editorRefs?.toArray() ?? [];
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
    const prompts: Map<string, string> = new Map<string, string>();
    const editorsArray = this.editorRefs?.toArray() ?? [];
    for (let i = 0; i < promptOrder.length; i++) {
      for (let j = 0; j < editorsArray.length; j++) {
        const el = editorsArray[j].nativeElement;
        if (promptOrder[i] === el.id) {
          prompts.set(el.id, el.innerHTML);
        }
      }
    }
    return prompts;
  }

  private adjustHeight(el: HTMLDivElement): void {
    el.style.height = 'auto';
    setTimeout(() => {
      el.style.height = `${el.scrollHeight}px`;
    }, 0);
  }
}
