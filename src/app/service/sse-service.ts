import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerationDataInterface } from '../models/generation-data-interface';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(private ngZone: NgZone) {}

    public connectPost(url: string, body: GenerationDataInterface): Observable<any> {
        return new Observable((observer) => {
        const controller = new AbortController();
        this.ngZone.runOutsideAngular(async () => {
            try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: controller.signal
            });

            if (!response.ok) {
                this.ngZone.run(() => observer.error(`HTTP Error: ${response.status}`));
                return;
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                this.ngZone.run(() => observer.error('ReadableStream not supported'));
                return;
            }

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                
                const lines = chunk.split('\n');
                for (const line of lines) {
                if (line.startsWith('data:')) {
                    const dataStr = line.replace('data:', '').trim();
                    try {
                    const parsed = JSON.parse(dataStr);
                    
                    if (parsed.message === 'new-message-COMPLETED') {
                        this.ngZone.run(() => observer.complete());
                        controller.abort();
                        return;
                    }

                    this.ngZone.run(() => observer.next({
                                id:  '',
                                event:  'message',
                                data: parsed,
                                comment: ''
                            }));
                    } catch (e) {
                    console.error('Error parsing SSE JSON:', e);
                    }
                }
                }
            }

            this.ngZone.run(() => observer.complete());
            } catch (error: any) {
            if (error.name !== 'AbortError') {
                this.ngZone.run(() => observer.error(error));
            }
            }
        });

        return () => {
            controller.abort();
        };
        });
    }

}
