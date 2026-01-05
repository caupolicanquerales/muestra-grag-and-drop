import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client-service';
import { ServiceGeneral } from './service-general';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { getToastMessageOption } from '../utils/toast-message-option-utils';
import { BasicTemplateInterface } from '../models/basic-template-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExecutingRestFulService {

  private msgSuccessSave: string= 'El prompt ha sido guardado correctamente';
  private msgSuccessDelete: string= 'El prompt ha sido eliminado correctamente';
  private msgSuccessSaveTemplate: string= 'El template basico ha sido guardado correctamente'
  private errorSave: string= 'Hubo un error en el guardado del prompt';
  private errorDelete: string= 'Hubo un error al eliminar del prompt';
  private errorSaveTemplate: string= 'Hubo un error en el guardado del template basico';
  
  constructor(private httpService :HttpClientService,private serviceGeneral: ServiceGeneral){}

  savePromptImage(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.savePromptGenerationImage(request), 'refresh-prompt-images',
      this.msgSuccessSave, this.errorSave);
  }

  savePromptBill(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.savePromptGenerationBill(request), 'refresh-prompt-bills',
      this.msgSuccessSave, this.errorSave);
  }

  savePromptData(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.savePromptGenerationData(request), 'refresh-prompt-data',
      this.msgSuccessSave, this.errorSave);
  }

  savePromptSystem(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.savePromptGenerationSystem(request), 'refresh-prompt-system',
      this.msgSuccessSave, this.errorSave);
  }

  saveSyntheticData(request: SyntheticDataInterface){
    this.handlePromptAction(this.httpService.saveSynteticDataGeneration(request), 'refresh-synthetic-data',
      this.msgSuccessSave, this.errorSave);
  }

  savePromptGlobalDefect(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.savePromptGlobalDefect(request), 'refresh-prompt-global-defect',
      this.msgSuccessSave, this.errorSave);
  }

  saveBasicTemplate(request: BasicTemplateInterface){
    this.handlePromptAction(this.httpService.saveBasicTemplate(request), 'refresh-basic-template',
      this.msgSuccessSaveTemplate, this.errorSaveTemplate);
  }

  deletePromptImageById(request: PromptGenerationImageInterface){
     this.handlePromptAction(this.httpService.deletePromptImageById(request), 'refresh-prompt-images',
      this.msgSuccessDelete, this.errorDelete);
  }

  deletePromptBillById(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.deletePromptBillById(request), 'refresh-prompt-bills',
      this.msgSuccessDelete, this.errorDelete);
  }

  deletePromptDataById(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.deletePromptDataById(request), 'refresh-prompt-data',
      this.msgSuccessDelete, this.errorDelete);
  }

  deleteSyntheticDataById(request: SyntheticDataInterface){
    this.handlePromptAction(this.httpService.deleteSyntheticDataById(request), 'refresh-synthetic-data',
      this.msgSuccessDelete, this.errorDelete);
  }

  deleteBasicTemplateById(request: BasicTemplateInterface){
    this.handlePromptAction(this.httpService.deleteBasicTemplateById(request), 'refresh-basic-template',
      'El template básico ha sido eliminado correctamente', 'Hubo un error en la eliminación del template básico');
  }

  deletePromptSystemById(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.deletePromptSystemById(request), 'refresh-prompt-system',
      this.msgSuccessDelete, this.errorDelete);
  }

  private handlePromptAction(observable: Observable<any>, refreshKey: string, msgSuccess: string,
    msgError: string
  ) {
    observable.subscribe({
      next: () => {
        this.getToastMessageOptions('success', msgSuccess);
        this.setRefreshObservable(refreshKey);
      },
      error: () => {
        this.getToastMessageOptions('error', 'Hubo un error en el guardado del prompt');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  private setRefreshObservable(refreshKey: string){
    if (refreshKey === 'refresh-prompt-bills') {
          this.serviceGeneral.setRefreshPromptBills(refreshKey);
    } else if(refreshKey === 'refresh-prompt-data') {
      this.serviceGeneral.setRefreshPromptData(refreshKey);
    } else if(refreshKey ===  'refresh-prompt-images'){
      this.serviceGeneral.setRefreshPromptImages(refreshKey);
    }else if(refreshKey ===  'refresh-prompt-system'){
      this.serviceGeneral.setRefreshPromptSystem(refreshKey);
    }else if(refreshKey ===  'refresh-synthetic-data'){
      this.serviceGeneral.setRefreshSyntheticData(refreshKey);
    }else if(refreshKey ===  'refresh-prompt-global-defect'){
      this.serviceGeneral.setRefreshPromptGlobalDefect(refreshKey);
    }else if(refreshKey ===  'refresh-basic-template'){
       this.serviceGeneral.setRefreshBasicTemplate(refreshKey);
    }
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

  getAllPromptSystem(){
    this.httpService.getPromptGenerationSystem().subscribe(response=>{
      this.serviceGeneral.setPromptSystem(response.prompts);
    });
  }

  private getToastMessageOptions(state: string, details: string){
    const message= getToastMessageOption(state,details);
    this.serviceGeneral.setToastMessage(message);
  }
  
}
