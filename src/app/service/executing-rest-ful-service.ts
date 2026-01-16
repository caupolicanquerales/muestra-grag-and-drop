import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client-service';
import { ServiceGeneral } from './service-general';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { getToastMessageOption } from '../utils/toast-message-option-utils';
import { BasicTemplateInterface } from '../models/basic-template-interface';
import { Observable } from 'rxjs';
import { RefreshFlagObservableEnum } from '../enums/refresh-flag-observable';

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
    this.handlePromptAction(this.httpService.savePromptGenerationImage(request), RefreshFlagObservableEnum.REFRESH_PI,
      this.msgSuccessSave, this.errorSave);
  }

  savePromptBill(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.savePromptGenerationBill(request), RefreshFlagObservableEnum.REFRESH_PB,
      this.msgSuccessSave, this.errorSave);
  }

  savePromptData(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.savePromptGenerationData(request), RefreshFlagObservableEnum.REFRESH_PD,
      this.msgSuccessSave, this.errorSave);
  }

  savePromptSystem(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.savePromptGenerationSystem(request), RefreshFlagObservableEnum.REFRESH_PS,
      this.msgSuccessSave, this.errorSave);
  }

  saveSyntheticData(request: SyntheticDataInterface){
    this.handlePromptAction(this.httpService.saveSynteticDataGeneration(request), RefreshFlagObservableEnum.REFRESH_SD,
      this.msgSuccessSave, this.errorSave);
  }

  savePublicityData(request: SyntheticDataInterface){
    this.handlePromptAction(this.httpService.savePublicityDataGeneration(request), RefreshFlagObservableEnum.REFRESH_PUD,
      this.msgSuccessSave, this.errorSave);
  }

  savePromptGlobalDefect(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.savePromptGlobalDefect(request), RefreshFlagObservableEnum.REFRESH_PGD,
      this.msgSuccessSave, this.errorSave);
  }

  saveBasicTemplate(request: BasicTemplateInterface){
    this.handlePromptAction(this.httpService.saveBasicTemplate(request), RefreshFlagObservableEnum.REFRESH_BT,
      this.msgSuccessSaveTemplate, this.errorSaveTemplate);
  }

  deletePromptImageById(request: PromptGenerationImageInterface){
     this.handlePromptAction(this.httpService.deletePromptImageById(request), RefreshFlagObservableEnum.REFRESH_PI,
      this.msgSuccessDelete, this.errorDelete);
  }

  deletePromptBillById(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.deletePromptBillById(request), RefreshFlagObservableEnum.REFRESH_PB,
      this.msgSuccessDelete, this.errorDelete);
  }

  deletePromptDataById(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.deletePromptDataById(request), RefreshFlagObservableEnum.REFRESH_PD,
      this.msgSuccessDelete, this.errorDelete);
  }

  deleteSyntheticDataById(request: SyntheticDataInterface){
    this.handlePromptAction(this.httpService.deleteSyntheticDataById(request), RefreshFlagObservableEnum.REFRESH_SD,
      this.msgSuccessDelete, this.errorDelete);
  }

  deletePublicityDataById(request: SyntheticDataInterface){
    this.handlePromptAction(this.httpService.deletePublicityDataById(request), RefreshFlagObservableEnum.REFRESH_PUD,
      this.msgSuccessDelete, this.errorDelete);
  }

  deleteBasicTemplateById(request: BasicTemplateInterface){
    this.handlePromptAction(this.httpService.deleteBasicTemplateById(request), RefreshFlagObservableEnum.REFRESH_BT,
      'El template básico ha sido eliminado correctamente', 'Hubo un error en la eliminación del template básico');
  }

  deletePromptSystemById(request: PromptGenerationImageInterface){
    this.handlePromptAction(this.httpService.deletePromptSystemById(request), RefreshFlagObservableEnum.REFRESH_PS,
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
        this.getToastMessageOptions('error', msgError);
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  private setRefreshObservable(refreshKey: string){
    const map: Record<string, (key: string) => void> = {
      [RefreshFlagObservableEnum.REFRESH_PB]: (key) => this.serviceGeneral.setRefreshPromptBills(key),
      [RefreshFlagObservableEnum.REFRESH_PD]: (key) => this.serviceGeneral.setRefreshPromptData(key),
      [RefreshFlagObservableEnum.REFRESH_PI]: (key) => this.serviceGeneral.setRefreshPromptImages(key),
      [RefreshFlagObservableEnum.REFRESH_PS]: (key) => this.serviceGeneral.setRefreshPromptSystem(key),
      [RefreshFlagObservableEnum.REFRESH_SD]: (key) => this.serviceGeneral.setRefreshSyntheticData(key),
      [RefreshFlagObservableEnum.REFRESH_PGD]: (key) => this.serviceGeneral.setRefreshPromptGlobalDefect(key),
      [RefreshFlagObservableEnum.REFRESH_BT]: (key) => this.serviceGeneral.setRefreshBasicTemplate(key),
      [RefreshFlagObservableEnum.REFRESH_PUD]: (key) => this.serviceGeneral.setRefreshPublicityData(key),
    };
    const handler = map[refreshKey];
    if (handler) handler(refreshKey);
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
    this.fetchList(this.httpService.getPromptGenerationImage(), r => r?.prompts, l => this.serviceGeneral.setPromptImages(l));
  }

  getAllPromptBill(){
    this.fetchList(this.httpService.getPromptGenerationBill(), r => r?.prompts, l => this.serviceGeneral.setPromptBills(l));
  }

  getAllPromptData(){
    this.fetchList(this.httpService.getPromptGenerationData(), r => r?.prompts, l => this.serviceGeneral.setPromptData(l));
  }

  getAllSyntheticData(){
    this.fetchList(this.httpService.getSyntheticDataGeneration(), r => r?.synthetics, l => this.serviceGeneral.setSyntheticData(l));
  }

  getAllBasicTemplate(){
    this.fetchList(this.httpService.getBasicTemplateGeneration(), r => r?.basicTemplates, l => this.serviceGeneral.setBasicTemplateData(l));
  }

  getAllPromptGlobalDefect(){
    this.fetchList(this.httpService.getPromptGlobalDefect(), r => r?.prompts, l => this.serviceGeneral.setPromptGlobalDefect(l));
  }

  getAllGlobalDefects(){
    this.fetchList(this.httpService.getGlobalDefects(), r => r?.defects, l => this.serviceGeneral.setGlobalDefect(l));
  }

  getAllPromptSystem(){
    this.fetchList(this.httpService.getPromptGenerationSystem(), r => r?.prompts, l => this.serviceGeneral.setPromptSystem(l));
  }

  getAllPublicityData(){
    this.fetchList(this.httpService.getPublicitycDataGeneration(), r => r?.synthetics, l => this.serviceGeneral.setPublicityData(l));
  }

  private getToastMessageOptions(state: string, details: string){
    const message= getToastMessageOption(state,details);
    this.serviceGeneral.setToastMessage(message);
  }

  private fetchList<R, T>(observable: Observable<R>, selector: (r: R) => T[] | null | undefined, setter: (list: T[]) => void): void {
    observable.subscribe(response => {
      const result = selector(response) ?? [];
      setter(result);
    });
  }
  
}
