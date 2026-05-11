import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerationDataInterface } from '../models/generation-data-interface';
import { GenerationDataAgentInterface } from '../models/generation-data-agent-interface';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(private ngZone: NgZone) {}

    public connectPost(url: string, body: GenerationDataInterface | GenerationDataAgentInterface): Observable<any> {
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

            let currentEventId = '';
            let currentEventName = 'message';
            // Buffer that accumulates text between chunks so that lines
            // split across TCP/HTTP chunk boundaries are reassembled before
            // being parsed (critical for large payloads such as base64 images).
            let lineBuffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                  // Flush any remaining buffered text as a final line
                  if (lineBuffer.trim()) {
                    lineBuffer += '\n';
                  } else {
                    break;
                  }
                }

                const chunk = decoder.decode(value, { stream: true });
                // Prepend whatever was left over from the previous chunk
                const text = lineBuffer + chunk;

                // Split on newlines; keep the last segment (may be incomplete)
                // as the carry-over buffer for the next iteration.
                const lines = text.split('\n');
                lineBuffer = lines.pop() ?? '';   // last element: potentially partial

                for (const line of lines) {
                if (line.startsWith('id:')) {
                    currentEventId = line.replace('id:', '').trim();
                } else if (line.startsWith('event:')) {
                    currentEventName = line.replace('event:', '').trim();
                } else if (line.startsWith('data:')) {
                    const dataStr = line.replace('data:', '').trim();
                    try {
                    const parsed = JSON.parse(dataStr);

                    const eventId = currentEventId;
                    const eventName = currentEventName;
                    this.ngZone.run(() => observer.next({
                        id: eventId,
                        event: eventName,
                        data: parsed,
                        comment: ''
                    }));

                    if (parsed.message === 'new-message-COMPLETED') {
                        this.ngZone.run(() => observer.complete());
                        controller.abort();
                        return;
                    }
                    } catch (e) {
                    console.error('Error parsing SSE JSON:', e);
                    }
                } else if (line.trim() === '') {
                    // blank line = end of SSE event block, reset per-event fields
                    currentEventId = '';
                    currentEventName = 'message';
                }
                }

                if (done) break;
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
