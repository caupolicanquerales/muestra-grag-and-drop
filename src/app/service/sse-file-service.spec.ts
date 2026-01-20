import { TestBed } from '@angular/core/testing';
import { SseFileService } from './sse-file-service';
import { ServerSentEvent } from '../models/server-sent-event';
import { DataMessage } from '../models/data-message';

describe('SseFileService', () => {
  let service: SseFileService;
  let originalES: any;

  class MockEventSource {
    static lastInstance: MockEventSource | null = null;
    url: string;
    onopen: ((ev: any) => any) | null = null;
    onerror: ((ev: any) => any) | null = null;
    private listeners: Record<string, Function[]> = {};
    closed = false;
    constructor(url: string) { this.url = url; MockEventSource.lastInstance = this; }
    addEventListener(type: string, cb: Function) {
      this.listeners[type] = this.listeners[type] || [];
      this.listeners[type].push(cb);
    }
    emit(type: string, data: any) {
      (this.listeners[type] || []).forEach(cb => cb({ data, type, lastEventId: '2' }));
    }
    emitObj(type: string, ev: any) {
      (this.listeners[type] || []).forEach(cb => cb(ev));
    }
    close() { this.closed = true; }
  }

  beforeEach(() => {
    originalES = (window as any).EventSource;
    (window as any).EventSource = MockEventSource as any;
    TestBed.configureTestingModule({});
    service = TestBed.inject(SseFileService);
  });

  afterEach(() => {
    (window as any).EventSource = originalES;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('emits parsed ServerSentEvent<DataMessage> on new-file and errors properly', (done) => {
    const events: Array<ServerSentEvent<DataMessage>> = [];
    const sub = service.connect('/files').subscribe({
      next: (v) => events.push(v),
      error: () => { expect(events.length).toBe(1); done(); }
    });
    const created = MockEventSource.lastInstance!;
    created.emit('new-file', JSON.stringify({ content: 'ok' }));
    created.onerror && created.onerror(new Error('boom'));
    sub.unsubscribe();
  });

  it('uses fallback defaults when event fields are missing', (done) => {
    let captured: ServerSentEvent<DataMessage> | null = null;
    const sub = service.connect('/files').subscribe({
      next: (v) => { captured = v; },
      complete: () => done()
    });
    const created = MockEventSource.lastInstance! as any;
    created.emitObj('new-file', { data: JSON.stringify({ x: 1 }) });
    expect(captured).toBeTruthy();
    expect(captured!.id).toBe('');
    expect(captured!.event).toBe('message');
    sub.unsubscribe();
    done();
  });
});
