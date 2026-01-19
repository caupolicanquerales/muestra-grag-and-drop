import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup,FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PopoverModule } from 'primeng/popover';
import { nameValidatorInArray } from '../utils/validation-utils';
import { PromptAndDataToValidateInterface } from '../models/prompts-and-data-to-validate-interface';
import { TooltipModule } from 'primeng/tooltip';
import { TypePromptEnum } from '../enums/type-prompt-enum';

@Component({
  selector: 'chat-buttons',
  imports: [CommonModule, ButtonModule, PopoverModule, DialogModule, 
    ReactiveFormsModule, TooltipModule],
  standalone: true,
  templateUrl: './chat-buttons.html',
  styleUrl: './chat-buttons.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatButtons implements OnInit{

  @Input()
  itemsSavePrompt: Array<any>=[];
  @Input()
  itemsExportPrompt: Array<any>=[];
  @Input()
  headerDialog: Array<any>=[];
  @Input()
  eraseButton: boolean= false;
  @Input()
  saveButton: boolean= true;
  @Input()
  exportButton: boolean= true;
  @Input()
  copyButton: boolean= true;
  @Input()
  generateImageButton: boolean= false;
  @Input()
  generatePromptButton: boolean= false;
  @Input()
  helpButton: boolean= false;
  @Input()
  arrayPromptAndData: PromptAndDataToValidateInterface={};

  @Output()
  submitCopyTextEmitter: EventEmitter<string>= new EventEmitter<string>();
  @Output()
  submitEraseTextEmitter: EventEmitter<string>= new EventEmitter<string>();
  @Output()
  submitDownloadFileEmitter: EventEmitter<string>= new EventEmitter<string>();
  @Output()
  submitSavePromptEmitter: EventEmitter<any>= new EventEmitter<any>();
  @Output()
  submitGenerateImage: EventEmitter<string>= new EventEmitter<string>();
  @Output()
  submitGeneratePrompt: EventEmitter<string>= new EventEmitter<string>();
  @Output()
  submitHelpTextEmitter: EventEmitter<string>= new EventEmitter<string>();

  visible: boolean= false;
  headerDialogTitle: string="";
  promptForm!: FormGroup;
  private savePromptDb:string= "";

  constructor(){}

  ngOnInit() {
    
    this.promptForm = new FormGroup({
      'promptName': new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25)
      ])
    });
  }

  get promptNameControl() {
    return this.promptForm.get('promptName');
  }

  get saveAllowButton(){
    return this.saveButton;
  }

  get exportAllowButton(){
    return this.exportButton;
  }

  get copyAllowButton(){
    return this.copyButton;
  }

  get eraseAllowButton(){
    return this.eraseButton;
  }

  get generateImage(){
    return this.generateImageButton;
  }

  get generatePrompt(){
    return this.generatePromptButton;
  }

  get helpAllowButton(){
    return this.helpButton;
  }

  showDialog(item: any, event: Event){
    event.stopPropagation();
    const header=this.headerDialog.filter(header=>header.format==item.format);
    this.headerDialogTitle= header?.[0]?.headerDialog;
    this.savePromptDb= item.format;
    let format: string= item.format;
    const array= this.getArrayNameToValidate(format);
    const ctrl = this.promptNameControl as FormControl;
    if (ctrl) {
      ctrl.setValidators([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
        nameValidatorInArray(array)
      ]);
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity({ emitEvent: true });
    }
    setTimeout(() => {
        this.visible = true;
    }, 0);
  }

  copyTextEvent(event: string){
    this.submitCopyTextEmitter.emit(event);
  }

  eraseEvent($event: string){
    this.submitEraseTextEmitter.emit($event);
  }

  helpEvent($event: string){
    this.submitHelpTextEmitter.emit($event);
  }

  generateImageEvent($event: string){
    this.submitGenerateImage.emit($event);
  }

  generatePromptEvent($event: string){
    this.submitGeneratePrompt.emit($event);
  }

  selectItem(member:any){}

  toggle($event:Event, target?:any){}

  exportInformation(item: any,$event: Event){
    if (item?.format) {
      this.submitDownloadFileEmitter.emit(item?.format);
    }
  }

  emitSavePrompt($event: string){
    const inputName = document.getElementById("promptName") as HTMLInputElement;
    if (!inputName) {
      console.error(`Element with ID "${'response'}" not found.`);
      return;
    }
    const namePrompt= inputName.value;
    this.submitSavePromptEmitter.emit({typePrompt: this.savePromptDb, name: namePrompt});
    this.visible= false;
  }

  private getArrayNameToValidate(format: string) {
    const map: Record<string, any> = {
      'Prompt imagen': this.arrayPromptAndData[TypePromptEnum.IMAGE_PROMPT],
      'Prompt datos': this.arrayPromptAndData[TypePromptEnum.DATA_PROMPT],
      'Prompt facturas': this.arrayPromptAndData[TypePromptEnum.BILL_PROMPT],
      'Dato sintético': this.arrayPromptAndData[TypePromptEnum.SYNTHETIC_DATA],
      'Template básico': this.arrayPromptAndData[TypePromptEnum.BASIC_TEMPLATE],
      'Prompt defecto global': this.arrayPromptAndData[TypePromptEnum.GLOBAL_DEFECT_PROMPT],
      'Prompt publicidad': this.arrayPromptAndData[TypePromptEnum.PUBLICITY_DATA],
      'Prompt sistema': this.arrayPromptAndData[TypePromptEnum.SYSTEM_PROMPT]
    };
    return map[format] ?? this.arrayPromptAndData[TypePromptEnum.SYNTHETIC_DATA];
  }
}