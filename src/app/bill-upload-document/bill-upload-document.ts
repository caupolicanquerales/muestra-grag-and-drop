import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpClientService } from '../service/http-client-service';
import { ServiceGeneral } from '../service/service-general';
import { UploadDocument } from '../upload-document/upload-document';

@Component({
  selector: 'bill-upload-document',
  imports: [CommonModule, UploadDocument],
  standalone: true,
  templateUrl: './bill-upload-document.html',
  styleUrl: './bill-upload-document.scss'
})
export class BillUploadDocument implements OnInit{

  selectedFileInBill: WritableSignal<File | null> = signal(null);
  allowButton: WritableSignal<boolean> = signal(false);

  formatFiles: string= ".pdf,.doc,.docx,.jpg,.png";
  uploadMessage: string= $localize`@@uploadMessage` 
  formatFileMessage: string= $localize`@@formatFileMessage`

  constructor(private httpClient:HttpClientService,
    private serviceGeneral: ServiceGeneral){}

  ngOnInit(): void {
    this.serviceGeneral.setActivateUploadDocumentStream(true);
  }

  selectedFileEmitter($event: File){
    this.selectedFileInBill.set($event);
  }

  uploadFile($event: string): void {
    if (!this.selectedFileInBill()) return;
    const file= this.selectedFileInBill();
    if(file){
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.executingSaveFile(formData)
    }
  }

  private executingSaveFile(formData: FormData){
    this.httpClient.saveFileForGenerationData(formData).subscribe({
      next: (event) => {
        this.allowButton.set(false);
        console.log(!this.allowButton())
        this.serviceGeneral.setIsUploadingAnimation(true);
      },
      error: (error) => {
        console.error('Upload failed:', error);
      }
    });
  }
}
