import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client-service';
import { ServiceGeneral } from './service-general';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { getToastMessageOption } from '../utils/toast-message-option-utils';
import { BasicTemplateInterface } from '../models/basic-template-interface';

@Injectable({
  providedIn: 'root'
})
export class ExecutingRestFulService {
  
  constructor(private httpService :HttpClientService,private serviceGeneral: ServiceGeneral){}

  savePromptImage(request: PromptGenerationImageInterface){
    this.httpService.savePromptGenerationImage(request).subscribe({
      next: (data) => {
        this.getToastMessageOptions('success','El prompt ha sido guardado correctamente');
        this.serviceGeneral.setRefreshPromptImages('refresh-prompt-images');
      },
      error: (err) => {
        this.getToastMessageOptions('error','Hubo un error en el guardado del prompt');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  savePromptBill(request: PromptGenerationImageInterface){
    this.httpService.savePromptGenerationBill(request).subscribe({
      next: (data) => {
        this.getToastMessageOptions('success','El prompt ha sido guardado correctamente');
        this.serviceGeneral.setRefreshPromptBills('refresh-prompt-bills');
      },
      error: (err) => {
        this.getToastMessageOptions('error','Hubo un error en el guardado del prompt');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  savePromptData(request: PromptGenerationImageInterface){
    this.httpService.savePromptGenerationData(request).subscribe({
      next: (data) => {
        this.getToastMessageOptions('success','El prompt ha sido guardado correctamente');
        this.serviceGeneral.setRefreshPromptData('refresh-prompt-data');
      },
      error: (err) => {
        this.getToastMessageOptions('error','Hubo un error en el guardado del prompt');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  saveSyntheticData(request: SyntheticDataInterface){
    this.httpService.saveSynteticDataGeneration(request).subscribe({
      next: (data) => {
        this.getToastMessageOptions('success','Los datos han sido guardado correctamente');
        this.serviceGeneral.setRefreshSyntheticData('refresh-synthetic-data');
      },
      error: (err) => {
        this.getToastMessageOptions('error','Hubo un error en el guardado del prompt');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  saveBasicTemplate(request: BasicTemplateInterface){
    this.httpService.saveBasicTemplate(request).subscribe({
      next: (data) => {
        this.getToastMessageOptions('success','El template basico ha sido guardado correctamente');
        this.serviceGeneral.setRefreshBasicTemplate('refresh-basic-template');
      },
      error: (err) => {
        this.getToastMessageOptions('error','Hubo un error en el guardado del template basico');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  savePromptGlobalDefect(request: PromptGenerationImageInterface){
    this.httpService.savePromptGlobalDefect(request).subscribe({
      next: (data) => {
        this.getToastMessageOptions('success','El prompt ha sido guardado correctamente');
        this.serviceGeneral.setRefreshPromptGlobalDefect('refresh-prompt-global-defect');
      },
      error: (err) => {
        this.getToastMessageOptions('error','Hubo un error en el guardado del prompt');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  deletePromptImageById(request: PromptGenerationImageInterface){
    this.httpService.deletePromptImageById(request).subscribe({
      next: (data) => {
        this.getToastMessageOptions('success','El prompt ha sido eliminado correctamente');
        this.serviceGeneral.setRefreshPromptImages('refresh-prompt-images');
      },
      error: (err) => {
        this.getToastMessageOptions('error','Hubo un error al eliminar del prompt');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  deletePromptBillById(request: PromptGenerationImageInterface){
    this.httpService.deletePromptBillById(request).subscribe({
      next: (data) => {
        this.getToastMessageOptions('success','El prompt ha sido eliminado correctamente');
        this.serviceGeneral.setRefreshPromptBills('refresh-prompt-bills');
      },
      error: (err) => {
        this.getToastMessageOptions('error','Hubo un error al eliminar del prompt');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  deletePromptDataById(request: PromptGenerationImageInterface){
    this.httpService.deletePromptDataById(request).subscribe({
      next: (data) => {
        this.getToastMessageOptions('success','El prompt ha sido eliminado correctamente');
        this.serviceGeneral.setRefreshPromptData('refresh-prompt-data');
      },
      error: (err) => {
        this.getToastMessageOptions('error','Hubo un error al eliminar del prompt');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  deleteSyntheticDataById(request: SyntheticDataInterface){
    this.httpService.deleteSyntheticDataById(request).subscribe({
      next: (data) => {
        this.getToastMessageOptions('success','El dato sintético ha sido eliminado correctamente');
        this.serviceGeneral.setRefreshSyntheticData('refresh-synthetic-data');
      },
      error: (err) => {
        this.getToastMessageOptions('error','Hubo un error en la eliminación del dato sintético');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  deleteBasicTemplateById(request: BasicTemplateInterface){
    this.httpService.deleteBasicTemplateById(request).subscribe({
      next: (data) => {
        this.getToastMessageOptions('success','El template básico ha sido eliminado correctamente');
        this.serviceGeneral.setRefreshBasicTemplate('refresh-basic-template');
      },
      error: (err) => {
        this.getToastMessageOptions('error','Hubo un error en la eliminación del template básico');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

getBasicTemplateById(request: BasicTemplateInterface): void{
    this.httpService.getBasicTemplateByIdInMongo(request).subscribe({
    next: (data) => {
      this.serviceGeneral.setBasicTemplate(data);
      this.serviceGeneral.setIsUploadingAnimation(false);
      
    },
    error: (error) => {
      this.serviceGeneral.setIsUploadingAnimation(false);
      console.error('Upload failed:', error);
    }
    }
  );
}

  getAllPromptImages(){
    this.httpService.getPromptGenerationImage().subscribe(response=>{
      this.serviceGeneral.setPromptImages(response.prompts);      
    });
  }

  getAllPromptBill(){
    this.httpService.getPromptGenerationBill().subscribe(response=>{
      this.serviceGeneral.setPromptBills(response.prompts);      
    });
  }

  getAllPromptData(){
    this.httpService.getPromptGenerationData().subscribe(response=>{
      this.serviceGeneral.setPromptData(response.prompts);      
    });
  }

  getAllSyntheticData(){
    this.httpService.getSyntheticDataGeneration().subscribe(response=>{
      this.serviceGeneral.setSyntheticData(response.synthetics);      
    });
  }

  getAllBasicTemplate(){
    this.httpService.getBasicTemplateGeneration().subscribe(response=>{
      this.serviceGeneral.setBasicTemplateData(response.basicTemplates);      
    });
  }

  getAllPromptGlobalDefect(){
    this.httpService.getPromptGlobalDefect().subscribe(response=>{
      this.serviceGeneral.setPromptGlobalDefect(response.prompts);      
    });
  }

  getAllGlobalDefects(){
    this.httpService.getGlobalDefects().subscribe(data=>{
      this.serviceGeneral.setGlobalDefect(data.defects);
    });
  }

  private getToastMessageOptions(state: string, details: string){
    const message= getToastMessageOption(state,details);
    this.serviceGeneral.setToastMessage(message);
  }
  
}
