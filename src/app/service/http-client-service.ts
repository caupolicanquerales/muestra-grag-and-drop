import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerationDataInterface } from '../models/generation-data-interface';
import { GenerationDataResponseInterface } from '../models/generation-data-response-interface';
import { MenuItem } from 'primeng/api';
import { GenerationImageInterface } from '../models/generation-image-interface';
import { RedisRequestInterface } from '../models/redis-request-interface';
import { RedisResponseInterface } from '../models/redis-response-interface';
import { RedisResponseWithImageInterface } from '../models/Redis-response-with-image-interface';
import { MongoResponseAllImagePromptInterface } from '../models/mongo-response-all-image-prompt-interface';
import { PromptGenerationImageInterface } from '../models/prompt-generation-image-interface';
import { SyntheticDataInterface } from '../models/synthetic-data-interface';
import { MongoResponseAllSyntheticDataInterface } from '../models/mongo-response-all-synthetic-data-interface';
import { BasicTemplateInterface } from '../models/basic-template-interface';
import { MongoResponseAllBasicTemplateInterface } from '../models/mongo-response-all-basic-template-interface';
import { MongoResponseGlobalDefectInterface } from '../models/mongo-response-all-global-defect-interface';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private urlRoot = 'http://localhost:8080/';
  private urlRootImage = 'http://localhost:8081/';
  private urlRootRedis = 'http://localhost:8082/';
  private urlRootMongo = 'http://localhost:8083/';
  private urlTemplates= 'assets/configMenu/templates.json';
  private urlPromptExtractionJson= 'https://raw.githubusercontent.com/caupolicanquerales/bill-factory-prompts/main/prompts/prompt-extract-info.json';
  private urlRepositoryMenuConfig= 'https://raw.githubusercontent.com/caupolicanquerales/billFactoryConfig/main/configMenu/menu.json'
  private urlRepositoryPrompts= 'https://raw.githubusercontent.com/caupolicanquerales/bill-factory-prompts/main/prompts/prompts.json';
  private urlRepositoryPromptsImages= 'https://raw.githubusercontent.com/caupolicanquerales/bill-factory-prompts/main/prompts/prompts-imagenes.json';



  constructor(private http:HttpClient){}

  updatePromptForGenerationData(request: GenerationDataInterface): Observable<GenerationDataResponseInterface> {
    return this.http.post<GenerationDataResponseInterface>(this.urlRoot+'generation/prompt', request);
  }

  updatePromptForBasicTemplate(request: GenerationImageInterface): Observable<GenerationDataResponseInterface> {
    return this.http.post<GenerationDataResponseInterface>(this.urlRootImage+'basic-template/prompt', request);
  }

  sendingFileForGenerationData(request: FormData): Observable<GenerationDataResponseInterface> {
    return this.http.post<GenerationDataResponseInterface>(this.urlRoot+'generation/sending-files', request);
  }

  sendingFileForBasicTemplate(request: FormData): Observable<GenerationDataResponseInterface> {
    return this.http.post<GenerationDataResponseInterface>(this.urlRootImage+'basic-template/sending-files', request);
  }

  saveFileForGenerationData(request: FormData): Observable<GenerationDataResponseInterface> {
    return this.http.post<GenerationDataResponseInterface>(this.urlRoot+'qdrant/save-file', request);
  }

  updatePromptForGenerationImage(request: GenerationImageInterface): Observable<GenerationDataResponseInterface> {
    return this.http.post<GenerationDataResponseInterface>(this.urlRootImage+'image/prompt', request);
  }

  setPromptForGenerationImage(request: GenerationImageInterface): Observable<GenerationDataResponseInterface> {
    return this.http.post<GenerationDataResponseInterface>(this.urlRootImage+'image/set-prompt', request);
  }

  saveImageInRedis(request: FormData): Observable<RedisResponseInterface> {
    return this.http.post<RedisResponseInterface>(this.urlRootRedis+'redis/save-image', request);
  }

  getImageInRedis(request: RedisRequestInterface): Observable<RedisResponseWithImageInterface> {
    return this.http.post<RedisResponseWithImageInterface>(this.urlRootRedis+'redis/get-image', request);
  }

  getPromptGenerationImage(): Observable<MongoResponseAllImagePromptInterface> {
    return this.http.get<MongoResponseAllImagePromptInterface>(this.urlRootMongo+'mongo/all-image-prompt');
  }

  getPromptGenerationBill(): Observable<MongoResponseAllImagePromptInterface> {
    return this.http.get<MongoResponseAllImagePromptInterface>(this.urlRootMongo+'mongo/all-bill-prompt');
  }

  getPromptGenerationData(): Observable<MongoResponseAllImagePromptInterface> {
    return this.http.get<MongoResponseAllImagePromptInterface>(this.urlRootMongo+'mongo/all-data-prompt');
  }

  getSyntheticDataGeneration(): Observable<MongoResponseAllSyntheticDataInterface> {
    return this.http.get<MongoResponseAllSyntheticDataInterface>(this.urlRootMongo+'mongo/all-synthetic-data');
  }

  getPublicitycDataGeneration(): Observable<MongoResponseAllSyntheticDataInterface> {
    return this.http.get<MongoResponseAllSyntheticDataInterface>(this.urlRootMongo+'mongo/all-publicity-data');
  }

  getGlobalDefects(): Observable<MongoResponseGlobalDefectInterface> {
    return this.http.get<MongoResponseGlobalDefectInterface>(this.urlRootMongo+'mongo/all-global-defect');
  }

  getPromptGenerationSystem(): Observable<MongoResponseAllImagePromptInterface> {
    return this.http.get<MongoResponseAllImagePromptInterface>(this.urlRootMongo+'mongo/all-system-prompt');
  }

  getBasicTemplateGeneration(): Observable<MongoResponseAllBasicTemplateInterface> {
    return this.http.get<MongoResponseAllBasicTemplateInterface>(this.urlRootMongo+'mongo/all-basic-template');
  }

  savePromptGenerationImage(request: PromptGenerationImageInterface): Observable<PromptGenerationImageInterface> {
    return this.http.post<PromptGenerationImageInterface>(this.urlRootMongo+'mongo/save-image-prompt',request);
  }

  savePromptGenerationBill(request: PromptGenerationImageInterface): Observable<PromptGenerationImageInterface> {
    return this.http.post<PromptGenerationImageInterface>(this.urlRootMongo+'mongo/save-bill-prompt',request);
  }

  savePromptGenerationData(request: PromptGenerationImageInterface): Observable<PromptGenerationImageInterface> {
    return this.http.post<PromptGenerationImageInterface>(this.urlRootMongo+'mongo/save-data-prompt',request);
  }

  savePromptGenerationSystem(request: PromptGenerationImageInterface): Observable<PromptGenerationImageInterface> {
    return this.http.post<PromptGenerationImageInterface>(this.urlRootMongo+'mongo/save-system-prompt',request);
  }

  saveSynteticDataGeneration(request: SyntheticDataInterface): Observable<SyntheticDataInterface> {
    return this.http.post<SyntheticDataInterface>(this.urlRootMongo+'mongo/save-synthetic-data',request);
  }

  savePublicityDataGeneration(request: SyntheticDataInterface): Observable<SyntheticDataInterface> {
    return this.http.post<SyntheticDataInterface>(this.urlRootMongo+'mongo/save-publicity-data',request);
  }

  saveBasicTemplate(request: BasicTemplateInterface): Observable<BasicTemplateInterface> {
    return this.http.post<BasicTemplateInterface>(this.urlRootMongo+'mongo/save-basic-template',request);
  }

  savePromptGlobalDefect(request: PromptGenerationImageInterface): Observable<PromptGenerationImageInterface> {
    return this.http.post<PromptGenerationImageInterface>(this.urlRootMongo+'mongo/save-global-defect-prompt',request);
  }

  getPromptGlobalDefect(): Observable<MongoResponseAllImagePromptInterface> {
    return this.http.get<MongoResponseAllImagePromptInterface>(this.urlRootMongo+'mongo/all-global-defect-prompt');
  }

  getBasicTemplateByIdInMongo(request: BasicTemplateInterface): Observable<BasicTemplateInterface> {
    return this.http.post<BasicTemplateInterface>(this.urlRootMongo+'mongo/get-basic-template', request);
  }

  deletePromptImageById(request: PromptGenerationImageInterface): Observable<any> {
    return this.http.delete(this.urlRootMongo+'mongo/delete-image-prompt', {body: request});
  }

  deletePromptDataById(request: PromptGenerationImageInterface): Observable<any> {
    return this.http.delete(this.urlRootMongo+'mongo/delete-data-prompt', {body: request});
  }

  deletePromptBillById(request: PromptGenerationImageInterface): Observable<any> {
    return this.http.delete(this.urlRootMongo+'mongo/delete-bill-prompt', {body: request});
  }

  deleteSyntheticDataById(request: SyntheticDataInterface): Observable<any> {
    return this.http.delete(this.urlRootMongo+'mongo/delete-synthetic-data', {body: request});
  }

  deletePublicityDataById(request: SyntheticDataInterface): Observable<any> {
    return this.http.delete(this.urlRootMongo+'mongo/delete-publicity-data', {body: request});
  }

  deleteBasicTemplateById(request: BasicTemplateInterface): Observable<any> {
    return this.http.delete(this.urlRootMongo+'mongo/delete-basic-template', {body: request});
  }

  deletePromptSystemById(request: PromptGenerationImageInterface): Observable<any> {
    return this.http.delete(this.urlRootMongo+'mongo/delete-system-prompt', {body: request});
  }

  getTemplates(): Observable<any> {
    return this.http.get<any>(this.urlTemplates);
  }

  getPromptExtractionFromRepository(): Observable<any> {
    return this.http.get<any>(this.urlPromptExtractionJson);
  }

  getPromptsFromRepository(): Observable<any> {
    return this.http.get<any>(this.urlRepositoryPrompts);
  }

  getPromptsImagesFromRepository(): Observable<any> {
    return this.http.get<any>(this.urlRepositoryPromptsImages);
  }

  getMenuConfigFromRepository(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.urlRepositoryMenuConfig);
  }
}
