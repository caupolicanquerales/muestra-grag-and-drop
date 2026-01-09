import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillHeader } from './bill-header/bill-header';
import { BillFooter } from './bill-footer/bill-footer';
import { BillMenu } from './bill-menu/bill-menu';
import { ServiceGeneral } from './service/service-general';
import { finalize, Subject, Subscription, take, takeUntil, Observable } from 'rxjs';
import { ReceiveDataService } from './service/receive-data-service';
import { nanoid } from 'nanoid';
import { HttpClientService } from './service/http-client-service';
import { ConvertBase64ByteService } from './service/convert-base64-byte-service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'
import { ExecutingRestFulService } from './service/executing-rest-ful-service';
import { getMapComponentToDisplay } from './utils/map-component-utils';
import { getToastMessageOption } from './utils/toast-message-option-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GenerationDataInterface } from './models/generation-data-interface';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule,BillHeader ,BillMenu, BillFooter, ToastModule ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('dynamicContainer', { read: ViewContainerRef })
  private viewContainerRef!: ViewContainerRef;
  subscriptions: Subscription = new Subscription();
  subscriptionsFile: Subscription = new Subscription();
  subscriptionsImage: Subscription = new Subscription();
  subscriptionsImagePrompt: Subscription = new Subscription();
  private imageIds: Array<any>=[];
  private mimeType: string = 'image/png';
  private destroy$ = new Subject<void>();
  private flagToStartBasicTemplate: string= "Basic Template generation started for prompt";

  private destroyRef = inject(DestroyRef);
  private sseSubscription?: Subscription;
  
  constructor(private serviceGeneral: ServiceGeneral, private receiveData:ReceiveDataService,
    private httpClient: HttpClientService, private convertBase64Byte: ConvertBase64ByteService,
    private messageService: MessageService, private executingRestFulService: ExecutingRestFulService){}

  ngOnInit(): void {
    this.subscribeUntilDestroyed(this.serviceGeneral.refreshPromptBills$, data => this.getAll('promptBills', data));
    this.subscribeUntilDestroyed(this.serviceGeneral.refreshPromptData$, data => this.getAll('promptData', data));
    this.subscribeUntilDestroyed(this.serviceGeneral.refreshPromptImages$, data => this.getAll('promptImages', data));
    this.subscribeUntilDestroyed(this.serviceGeneral.refreshSyntheticData$, data => this.getAll('syntheticData', data));
    this.subscribeUntilDestroyed(this.serviceGeneral.refreshBasicTemplate$, data => this.getAll('basicTemplate', data));
    this.subscribeUntilDestroyed(this.serviceGeneral.refreshPromptGlobalDefect$, data => this.getAll('promptGlobalDefect', data));
    this.subscribeUntilDestroyed(this.serviceGeneral.refreshPromptSystem$, data => this.getAll('promptSystem', data));
    this.subscribeUntilDestroyed(this.serviceGeneral.refreshPublicityData$, data => this.getAll('publicityData', data));
    this.subscribeUntilDestroyed(this.serviceGeneral.imageIds$, data => this.imageIds = data);
    this.subscribeUntilDestroyed(this.serviceGeneral.toastMessage$, data => this.messageService.add(data));
    this.subscribeUntilDestroyed(this.serviceGeneral.chatClientStreamPrueba$, data => this.setSubscriptionToDataReceiver(data));
    this.subscribeUntilDestroyed(this.serviceGeneral.activateBasicTemplateStream$, data => this.setSubscriptionToBasicTemplateReceiver(data));
    this.serviceGeneral.activateUploadDocumentStream$.pipe(takeUntil(this.destroy$)).pipe(take(2)).subscribe(data=>this.setSubscriptionToFileReceiver(data));
    this.subscribeUntilDestroyed(this.serviceGeneral.executingImageStream$, data => this.setSubscriptionToImageReceiver(data));
    this.serviceGeneral.changeComponent$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      if(data!=''){
        this.loadComponent(data);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.subscriptionsFile.unsubscribe();
    this.subscriptionsImage.unsubscribe();
    this.subscriptionsImagePrompt.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.loadComponent('show-presentation');
  }


  private loadComponent(componentName: string): void {
    const componentType = getMapComponentToDisplay()[componentName];
    if (!componentType) return;
    this.viewContainerRef.clear()
    const componentRef = this.viewContainerRef.createComponent(componentType);
  }

  private setSubscriptionToDataReceiver(request: GenerationDataInterface) {
    if (this.sseSubscription) {
        this.sseSubscription.unsubscribe();
    }

    if (request && request.prompt!='') {
        this.sseSubscription = this.receiveData.getDataStream(request)
            .pipe(
                takeUntilDestroyed(this.destroyRef), 
                finalize(() => console.log('Observable stream fully finalized'))
            )
            .subscribe({
                next: (token) => {
                    this.serviceGeneral.setStatusMessage(true);
                    this.serviceGeneral.setIsUploadingAnimation(false);
                    this.serviceGeneral.setResponseMessagePrompt(token.data.message);
                },
                error: (err) => {
                    this.serviceGeneral.setStatusMessage(false);
                    this.serviceGeneral.setIsUploadingAnimation(false);
                    this.serviceGeneral.setResponseMessagePrompt('Error: Could not complete the request.');
                },
                complete: () => {
                    console.log('Stream completed via backend signal');
                }
            });
        this.subscriptions.add(this.sseSubscription);
    }
}

  private setSubscriptionToFileReceiver(executing: boolean): void{
    if(executing){
      this.subscriptionsFile.add(
        this.receiveData.getDataStreamFile().subscribe({
          next: (response) => {
            this.setToastMessage('success', 'Documento procesado correctamente');
            this.serviceGeneral.setIsUploadingAnimation(false);
          },
          error: (err) =>{
            this.setToastMessage('error', 'Error en el procesamiento del documento');
            this.serviceGeneral.setIsUploadingAnimation(false);
          },
        })
      );
    }
  }

  private setSubscriptionToBasicTemplateReceiver(executing: boolean): void{
    if(executing){
      this.subscriptionsFile.add(
        this.receiveData.getDataStreamBasicTemplate().subscribe({
          next: (response) => {
            if(response!=this.flagToStartBasicTemplate){
              this.catchErrorInJsonTransformation(response);
            }
          },
          error: (err) =>{
            this.setToastMessage('error', 'Error en el procesamiento de los archivos');
            this.serviceGeneral.setIsUploadingAnimation(false);
          },
        })
      );
    }
  }

  private setSubscriptionToImageReceiver(executing:boolean):void{
    if(executing){
      this.subscriptionsImage.add(
        this.receiveData.getDataStreamImage().subscribe({
            next: (response) => {
              if(response!="Image generation started for prompt"){
                this.setToastMessage('success', 'Imagen generada');       
                this.saveImageInRedis(response);
              }
            },
            error: (err) =>{
              console.log(err);
              this.setToastMessage('error', err);
              this.serviceGeneral.setIsUploadingAnimation(false);
            },
          })
        );
    }
  }

  private saveImageInRedis(image:string){
    const id= nanoid(10);
    const imageBlob= this.convertBase64Byte.base64ToBlob(image, this.mimeType);
    this.serviceGeneral.setImageGenerated(image);
    this.httpClient.saveImageInRedis(this.setRequestRedis(imageBlob,id))
      .subscribe(response=>{
          this.imageIds.push({"image": id,"time": 2025});
          this.serviceGeneral.setImageIds(this.imageIds);
          this.serviceGeneral.setIsUploadingAnimation(false);
      });
  }

  private setRequestRedis(imageBlob:Blob, id:string): FormData{
    const formData = new FormData();
    formData.append('image', imageBlob, id);
    return formData;
  }

  private subscribeUntilDestroyed<T>(obs: Observable<T>, handler: (v: T) => void) {
    obs.pipe(takeUntil(this.destroy$)).subscribe(handler);
  }

  private getAll(kind: 'promptImages'|'promptBills'|'promptData'|'syntheticData'|'publicityData'|'basicTemplate'|'promptGlobalDefect'|'promptSystem', event: string){
    if(!event) return;
    const actions: Record<string, () => void> = {
      promptImages: () => this.executingRestFulService.getAllPromptImages(),
      promptBills: () => this.executingRestFulService.getAllPromptBill(),
      promptData: () => this.executingRestFulService.getAllPromptData(),
      syntheticData: () => this.executingRestFulService.getAllSyntheticData(),
      publicityData: () => this.executingRestFulService.getAllPublicityData(),
      basicTemplate: () => this.executingRestFulService.getAllBasicTemplate(),
      promptGlobalDefect: () => this.executingRestFulService.getAllPromptGlobalDefect(),
      promptSystem: () => this.executingRestFulService.getAllPromptSystem(),
    };
    const action = actions[kind];
    if(action) action();
  }

  private setToastMessage(state: string, details: string){
    const message= getToastMessageOption(state,details);
    this.serviceGeneral.setToastMessage(message);
  }

  private catchErrorInJsonTransformation(cleanJson: string){
    try {
      this.serviceGeneral.setIsUploadingAnimation(false);
      const result= JSON.parse(cleanJson);
      this.serviceGeneral.setBasicTemplate(result); 
      this.setToastMessage('success', 'Archivos correctamente procesados'); 
    } catch (error) {
      this.setToastMessage("warn", 'Error en la estructura del json de respuesta'); 
    }  
  }
}
