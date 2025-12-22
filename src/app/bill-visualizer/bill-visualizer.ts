import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { VisualizerCanvas } from '../visualizer-canvas/visualizer-canvas';
import { ServiceGeneral } from '../service/service-general';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HttpClientService } from '../service/http-client-service';
import { RedisRequestInterface } from '../models/redis-request-interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'bill-visualizer',
  standalone: true,
  imports: [CommonModule, VisualizerCanvas, TableModule, ButtonModule],
  templateUrl: './bill-visualizer.html',
  styleUrl: './bill-visualizer.scss'
})
export class BillVisualizer implements OnInit, OnDestroy{

  constructor(private serviceGeneral: ServiceGeneral, private httpClient: HttpClientService){}
  
  base64String: WritableSignal<string> = signal('');
  showImage: WritableSignal<boolean> = signal(false);
  imageIds: Array<any>= [];
  pagination: WritableSignal<boolean> = signal(false);
  imageName: WritableSignal<string> = signal('');
  private mimeType: string = 'image/png';
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.serviceGeneral.setImageGenerated('');
    this.serviceGeneral.imageIds$.pipe(takeUntil(this.destroy$)).subscribe(data=>{
      if(data && data.length!=0){
        this.pagination.set(false);
        this.imageIds=data;
        this.pagination.set(true);
      } 
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectImage(event:any):void{
    this.httpClient.getImageInRedis(this.setRequestRedis(event.image))
      .subscribe(response=>{
        this.showImage.set(true);
        this.imageName.set(response.id);
        this.base64String.set(response.image);
      });
  }

  downloadImage(event:any):void{
    this.httpClient.getImageInRedis(this.setRequestRedis(event.image))
      .subscribe(response=>{
        const base64DataUrl = `data:${this.mimeType};base64,${response.image}`;
        const link = document.createElement('a');
        link.href = base64DataUrl; 
        link.download = response.id;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      });
  }

  private setRequestRedis(id:string): RedisRequestInterface{
    return {
      id: id
    }
  }

}
