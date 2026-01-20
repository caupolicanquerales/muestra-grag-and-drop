import { TestBed } from '@angular/core/testing';
import { SseBasicTemplateService } from './sse-basic-template-service';

describe('SseBasicTemplateService', () => {
  let service: SseBasicTemplateService;
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
      (this.listeners[type] || []).forEach(cb => cb({ data, type, lastEventId: '3' }));
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
    service = TestBed.inject(SseBasicTemplateService);
  });

  afterEach(() => {
    (window as any).EventSource = originalES;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('emits new-basic-template payloads and errors properly', (done) => {
    const events: any[] = [];
    const sub = service.connect('/basic').subscribe({
      next: (v) => events.push(v),
      error: () => { expect(events.length).toBe(1); done(); }
    });
    const created = MockEventSource.lastInstance!;
    created.emit('new-basic-template', '<div>tpl</div>');
    created.onerror && created.onerror(new Error('err'));
    sub.unsubscribe();
  });

  it('emits raw template string even without event metadata', () => {
    let got: any;
    const sub = service.connect('/basic').subscribe({ next: v => got = v });
    const created = MockEventSource.lastInstance! as any;
    created.emitObj('new-basic-template', { data: '<div/>' });
    expect(got).toBe('<div/>');
    sub.unsubscribe();
  });
});
