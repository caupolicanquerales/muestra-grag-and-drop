import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseImageService {
  
  constructor(private ngZone: NgZone) {}

   public connect(url: string): Observable<any> {
      return new Observable<any>((observer) => {
          let eventSource: EventSource  = new EventSource(url);
          this.ngZone.run(() => {
          
              eventSource.onopen = (event) => {
                  console.log('Connection established (onopen)', event);
              };
  
              eventSource.addEventListener('new-image', (event: any) => {
                  this.ngZone.run(() => {
                      try {
                          const parsedData: string = event.data;
                          observer.next(parsedData);
                      } catch (e) {
                          console.error('SSE JSON Parsing Error:', e, 'Raw data:', event.data);
                      }
                  });
              });
              
              eventSource.onerror = (error) => {
                  this.ngZone.run(() => {
                      observer.error(error);
                      eventSource!.close();
                  });
              };
  
              return () => {
                  eventSource.close();
              };
          });
      });  
  }
}
