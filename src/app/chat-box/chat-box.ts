import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, signal, ViewChild, WritableSignal } from '@angular/core';
import { SafeHtmlPipePipe } from '../pipes/safe-html-pipe-pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ServiceGeneral } from '../service/service-general';
import { UploadDocumentChat } from '../upload-document-chat/upload-document-chat';
import { triggerDownloadTheFile, getMapTypeFormatDownloadFile } from '../utils/download-file-utils';
import { SavePromptDbInterface } from '../models/save-prompt-db-interface';
import { ChatButtons } from '../chat-buttons/chat-buttons';
import { removeTagHtmlToText } from '../utils/operation-string-utils'
import { Subject, takeUntil } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'chat-box',
  standalone:true,
  imports: [CommonModule,SafeHtmlPipePipe,FormsModule,NgClass,ButtonModule, UploadDocumentChat,
    ChatButtons, TooltipModule],
  templateUrl: './chat-box.html',
  styleUrl: './chat-box.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBox implements OnInit, OnDestroy{

  promptInput = signal('');
  private destroy$ = new Subject<void>();

  @Input()
  titleData: string='';
  @Input()
  subTitleData: string= '';
  @Input()
  placeHolder: string= '';
  @Input()
  labelExtractButton: string= ''; 
  @Input()
  formatFiles: string= ''; 
  @Input()
  statusMessage: WritableSignal<boolean> = signal(false);
  @Input()
  responseMessage: WritableSignal<string> = signal('');
  @Input()
  itemsSavePrompt: Array<any>=[];
  @Input()
  itemsExportPrompt: Array<any>=[];
  @Input()
  headerDialog: Array<any>=[];
  @Input()
  set prompt(value: string | undefined) {
    if (value !== undefined) {
        const text= removeTagHtmlToText(value);
        this.promptInput.set(text.trim());
        setTimeout(() => {
            this.resizeTextarea();
        }, 0);
    }
  }

  @Output()
  submitExtractJsonEmitter: EventEmitter<string>= new EventEmitter<string>();

  @Output()
  submitPromptEmitter: EventEmitter<string>= new EventEmitter<string>();

  @Output()
  promptEmitter: EventEmitter<string>= new EventEmitter<string>();

  @Output()
  selectedFilesEmitter: EventEmitter<Array<File>>= new EventEmitter<Array<File>>();

  @Output()
  savePromptEmitterInDB: EventEmitter<SavePromptDbInterface>= new EventEmitter<SavePromptDbInterface>();

  textAreaRef: any;
  isFocused = signal(false);

  constructor(private serviceGeneral: ServiceGeneral, private cd: ChangeDetectorRef){}

  ngOnInit(): void {
    this.serviceGeneral.resizeInput$.pipe(takeUntil(this.destroy$)).subscribe(data=> this.resizeTextAreAfter(data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();    
  }

  @HostListener('window:resize', [])
  onResize() {
    this.resizeTextarea();
  }

  resizeTextarea(): void {
    setTimeout(() => {
    const el = document.getElementById('prompt-input') as HTMLTextAreaElement;
      if (el) {
        el.style.height = 'auto';
        const newHeight = Math.ceil(el.scrollHeight);
        el.style.height = `${newHeight}px`;
      }
    }, 270);
  }

  private resizeTextAreAfter(resize: boolean): void{
    if(resize){
      const el = document.getElementById('prompt-input') as HTMLTextAreaElement;
      el.style.height = 'auto'; 
      el.style.height = '108px';
    }
  }

  sendPromptEmitter(event?: Event){
    const textArea= document.getElementById('prompt-input') as HTMLTextAreaElement
    const newValue = textArea.value;
    this.promptEmitter.emit(newValue);
  }

  async submitCopyText($event: string): Promise<void> {
    const contentElement = document.getElementById("response");
    if (!contentElement) {
      return;
    }
    const textToCopy = contentElement.textContent;
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (e) {
      console.error("Error, Trying to copy respose.",e);
    }
    this.submitExtractJsonEmitter.emit('executing-extract-json-event');
  }

  submitPrompt():void{
    this.submitPromptEmitter.emit('executing-submit-prompt-event');
  }

  selectedFilesEvent($event:Array<File>):void{
    this.selectedFilesEmitter.emit($event);
  }

  downloadFile(extension: string){
    const textToCopy = this.getTextToCopy(extension);
    const typeExt= getMapTypeFormatDownloadFile().get(extension);
    if(textToCopy!= undefined){
      triggerDownloadTheFile(textToCopy, typeExt, extension);
    }
  }

  private getTextToCopy(extension: string): string | undefined | null{
    const contentElement = document.getElementById("response");
    if (!contentElement) {
      return;
    }
    if(extension=='.md'){
      return this.responseMessage();
    }
    return contentElement.textContent;
  }
  
  exportInformation($event: string){
    if ($event) {
        this.downloadFile($event);  
    }
    this.cd.detectChanges();
  }

  emitSavePrompt($event: any){
    const contentElement = document.getElementById("response");
    if (!contentElement) {
      return;
    }
    const response= contentElement.innerHTML;
    this.savePromptEmitterInDB.emit({typePrompt:$event?.typePrompt,prompt:response, name: $event?.name});
  }

  emitEraseText($event: any){
        this.promptInput.set('');
        setTimeout(() => {
            this.resizeTextarea();
        }, 0);
  }
}
