import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, signal, ViewChild, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ServiceGeneral } from '../service/service-general';
import { getMapForIconFiles } from '../utils/icon-files-utils';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'upload-document',
  imports: [CommonModule, ButtonModule],
  standalone: true,
  templateUrl: './upload-document.html',
  styleUrl: './upload-document.scss'
})
export class UploadDocument implements OnInit,OnDestroy{

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Input()
  uploadMessage: string= "";
  @Input()
  formatFileMessage: string= "";
  @Input()
  formatFiles: string= "";
  @Input()
  multipleFiles: boolean= false;
  @Input()
  allowButton: WritableSignal<boolean> = signal(false);

  @Output()
  submitUploadFileEmitter: EventEmitter<string>= new EventEmitter<string>();
  @Output()
  selectedFileEmitter: EventEmitter<File>= new EventEmitter<File>();
  @Output()
  selectedMultipleFileEmitter: EventEmitter<FileList>= new EventEmitter<FileList>();
 

  isDraggingOver = false;
  message: WritableSignal<string | null> = signal(null);
  isError: WritableSignal<boolean> = signal(false);
  allowUploadFile = signal(false);
  selectedFile: WritableSignal<File | null> = signal(null);
  selectedFiles:  Array<File> = [];
  readonly MAX_SIZE = 5 * 1024 * 1024;
  private formats: Array<string>=[];
  private destroy$ = new Subject<void>();
  private allFilesOK: boolean= false;

  constructor(private serviceGeneral: ServiceGeneral){}

  ngOnInit(): void {
    this.formats= this.formatFiles.split(",");
    this.serviceGeneral.isUploadingAnimation$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.allowUploadFile.set(data);
      this.selectedFile.set(null);
    });    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  uploadFile(){
    this.submitUploadFileEmitter.emit('upload-file-event');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.serviceGeneral.setIsUploadingAnimation(false);
      this.setValidationForMultipleFiles(input.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.setValidationForMultipleFiles(files);
    }
  }

  private setValidationForMultipleFiles(files : FileList){
    if(!this.multipleFiles){
      this.validateExtensionForOneFile(files[0]);
    }else{
      this.allFilesOK=false;
      this.validateExtensionForMultipleFiles(files);
    }
  }

  validateSizeFile(file: File): boolean {
    this.message.set(null);
    this.isError.set(false);
    if (file.size > this.MAX_SIZE) {
      this.isError.set(true);
      this.message.set('File size exceeds 5MB limit.');
      this.clearSelection();
      return false;
    }
    return true;
  }

  clearSelection(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  conditionSizeSelectedFile(){
    const file=this.selectedFile();
    return file? file.size:null;
  }

  conditionSelectedFile(){
    if(!this.multipleFiles){
      const file=this.selectedFile()
      return !file;
    }
    return this.selectedFiles.length==0;
  }

  private validateExtensionForOneFile(file: File): void{
    if(!this.conditionForExtention(file)){
      this.isError.set(true);
      this.message.set('Formato no permitido.');
    }else{
      if(this.validateSizeFile(file)){
        this.selectedFile.set(file);
        this.selectedFileEmitter.emit(file);
      }
    }
  }

  private validateExtensionForMultipleFiles(files : FileList): void{
    const filesArray: File[] = Array.from(files);
    this.selectedFiles=[];
    for(let i=0;i<filesArray.length;i++){
      if(!this.conditionForExtention(filesArray[i])){
          this.isError.set(true);
          this.message.set('Formato no permitido.');
      }else{
        if(this.validateSizeFile(filesArray[i])){
          this.selectedFiles.push(filesArray[i]);
        }
        if(i==(filesArray.length-1)){
          this.allFilesOK=true;  
          this.selectedMultipleFileEmitter.emit(files);
        }
      }
    }
  }

  private conditionForExtention(file: File): boolean{
    const extension = this.getExtention(file);
    return this.formats.includes(extension);
  }

  private getExtention(file: File): string{
    const fileName = file.name;
    const lastDotIndex = fileName.lastIndexOf('.');
    const extension = fileName.substring(lastDotIndex).toLowerCase();
    return extension;
  }

  trackByFn(index: any, file: File){
    return file.name;
  }

  getFileIcon(file?: File): string | undefined {
    let extension='';
    let mapIcons= getMapForIconFiles();
    if(file){
      extension = this.getExtention(file);
    }else{
      const fileSelected= this.selectedFile();
      if(fileSelected!=null){
        extension = this.getExtention(fileSelected);
      }
    }
    return mapIcons.get(extension);
  }

  conditionToDisableButton():boolean{
    return ((!this.selectedFile() && !this.multipleFiles ) || (!this.allFilesOK && this.multipleFiles )) && !this.allowButton() 
  }
}
