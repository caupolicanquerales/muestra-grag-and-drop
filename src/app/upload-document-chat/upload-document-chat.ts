import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { getMapForIconFiles } from '../utils/icon-files-utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'upload-document-chat',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './upload-document-chat.html',
  styleUrl: './upload-document-chat.scss'
})
export class UploadDocumentChat implements OnInit{

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Input()
  formatFiles: string= "";

  @Output()
  selectedFilesEmitter: EventEmitter<Array<File>>= new EventEmitter<Array<File>>();

  isDraggingOver = false;
  selectedFiles: Array<File> = [];
  readonly MAX_SIZE = 5 * 1024 * 1024;
  private formats: Array<string>=[];
  multipleFiles: boolean= true;

  ngOnInit(): void {
    this.formats= this.formatFiles.split(",");
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

  private setValidationForMultipleFiles(files : FileList): void{
    const filesArray: File[] = Array.from(files);
    this.selectedFiles=[];
    for(let i=0;i<filesArray.length;i++){
      if(!this.conditionForExtention(filesArray[i])){
      }else{
        if(this.validateSizeFile(filesArray[i])){
          this.selectedFiles.push(filesArray[i]);
          this.selectedFilesEmitter.emit(this.selectedFiles);
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

  validateSizeFile(file: File): boolean {
    if (file.size > this.MAX_SIZE) {
      return false;
    }
    return true;
  }

  getFileIcon(file?: File): string | undefined {
      let extension='';
      let mapIcons= getMapForIconFiles();
      if(file){
        extension = this.getExtention(file);
      }
      return mapIcons.get(extension);
  }
  
  trackByFn(index: any, file: File){
    return file.name;
  }
}
