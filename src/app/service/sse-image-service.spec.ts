import { TestBed } from '@angular/core/testing';
import { SseImageService } from './sse-image-service';

describe('SseImageService', () => {
  let service: SseImageService;
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
      (this.listeners[type] || []).forEach(cb => cb({ data, type, lastEventId: '1' }));
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
    service = TestBed.inject(SseImageService);
  });

  afterEach(() => {
    (window as any).EventSource = originalES;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('emits new-image payloads and supports error', (done) => {
    const events: any[] = [];
    const sub = service.connect('/images').subscribe({
      next: (v) => { events.push(v); },
      error: () => { expect(events.length).toBe(1); done(); }
    });

    const created = MockEventSource.lastInstance!;
    created.emit('new-image', 'img-base64');
    created.onerror && created.onerror(new Error('fail'));
    sub.unsubscribe();
  });

  it('emits raw data string even if event metadata missing', () => {
    let got: any;
    const sub = service.connect('/images').subscribe({ next: v => got = v });
    const created = MockEventSource.lastInstance! as any;
    created.emitObj('new-image', { data: 'abc' });
    expect(got).toBe('abc');
    sub.unsubscribe();
  });
});
