import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerationImageInterface } from '../models/generation-image-interface';

@Injectable({
  providedIn: 'root'
})
export class SseImageService {
  
  constructor(private ngZone: NgZone) {}

   public connect(url: string, body: GenerationImageInterface = { prompt: '' }): Observable<string> {
    return new Observable<string>((observer) => {
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

          let lineBuffer = '';

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const text = lineBuffer + chunk;
            const lines = text.split('\n');
            lineBuffer = lines.pop() ?? '';

            for (const line of lines) {
              if (line.startsWith('data:')) {
                const dataStr = line.replace('data:', '').trim();
                this.ngZone.run(() => observer.next(dataStr));
              }
            }
          }

          this.ngZone.run(() => observer.complete());
        } catch (error: any) {
          if (error?.name !== 'AbortError') {
            this.ngZone.run(() => observer.error(error));
          }
        }
      });

      return () => controller.abort();
    });
  }
}
