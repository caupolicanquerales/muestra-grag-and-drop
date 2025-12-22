import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup,FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PopoverModule } from 'primeng/popover';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { nameValidatorInArray } from '../utils/validation-utils';
import { PromptAndDataToValidateInterface } from '../models/prompts-and-data-to-validate-interface';
import { TooltipModule } from 'primeng/tooltip';

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

  visible: boolean= false;
  headerDialogTitle: string="";
  promptForm!: FormGroup;
  private savePromptDb:string= "";
  private arrayToValidation: Array<PromptGenerationImageInterface> | Array<SyntheticDataInterface>=[];

  constructor(){}

  ngOnInit() {
    
    this.promptForm = new FormGroup({
      'promptName': new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25)
      ])
    }, {
      validators: [nameValidatorInArray([])] 
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

  showDialog(item: any, event: Event){
    event.stopPropagation();
    const header=this.headerDialog.filter(header=>header.format==item.format);
    this.headerDialogTitle= header?.[0]?.headerDialog;
    this.savePromptDb= item.format;
    let format: string= item.format;
    const array= this.getArrayNameToValidate(format);
    this.promptForm.setValidators(nameValidatorInArray(array));
    setTimeout(() => {
        this.promptForm.updateValueAndValidity({ emitEvent: true });
        this.visible = true;
    }, 0);
  }

  copyTextEvent(event: string){
    this.submitCopyTextEmitter.emit(event);
  }

  eraseEvent($event: string){
    this.submitEraseTextEmitter.emit($event);
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

  private getArrayNameToValidate(format: string){
    if(format=="Prompt imagen"){
      return this.arrayPromptAndData.prompt_imagen;
    }else if(format=="Prompt datos"){
      return this.arrayPromptAndData.prompt_datos;
    }else if(format=="Prompt facturas"){
      return this.arrayPromptAndData.prompt_facturas;
    }else{
      return this.arrayPromptAndData.dato_sintético;
    }
  }
}
