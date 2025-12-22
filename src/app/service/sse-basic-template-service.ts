import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerSentEvent } from '../models/server-sent-event';
import { DataMessage } from '../models/data-message';

@Injectable({
  providedIn: 'root'
})
export class SseBasicTemplateService {
  
  constructor(private ngZone: NgZone) {}
 
  public connect(url: string): Observable<ServerSentEvent<DataMessage>> {
    return new Observable<ServerSentEvent<DataMessage>>((observer) => {
        let eventSource: EventSource  = new EventSource(url);
        this.ngZone.run(() => {
        
            eventSource.onopen = (event) => {
                console.log('Connection established (onopen)', event);
            };

            eventSource.addEventListener('new-basic-template', (event: MessageEvent) => {
                this.ngZone.run(() => {
                    try {
                        const parsedData: DataMessage = JSON.parse(event.data);
                        const sseNotification: ServerSentEvent<DataMessage> = {
                            id: event.lastEventId || '', 
                            event: event.type || 'message',
                            comment: '', 
                            data: parsedData, 
                        };
                        
                        observer.next(sseNotification);
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
