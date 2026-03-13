import { TestBed } from '@angular/core/testing';
import { SseBasicTemplateService } from './sse-basic-template-service';

describe('SseBasicTemplateService', () => {
  let service: SseBasicTemplateService;
  let originalFetch: typeof window.fetch;

  /** Builds a ReadableStream from an array of SSE-formatted text chunks. */
  function makeStream(chunks: string[]): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();
    let idx = 0;
    return new ReadableStream<Uint8Array>({
      pull(controller) {
        if (idx < chunks.length) {
          controller.enqueue(encoder.encode(chunks[idx++]));
        } else {
          controller.close();
        }
      }
    });
  }

  function mockFetch(chunks: string[], status = 200): void {
    (window as any).fetch = jasmine.createSpy('fetch').and.returnValue(
      Promise.resolve({ ok: status >= 200 && status < 300, status, body: makeStream(chunks) })
    );
  }

  function makeFormData(fields: Record<string, string> = {}): FormData {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
    return fd;
  }

  beforeEach(() => {
    originalFetch = window.fetch;
    TestBed.configureTestingModule({});
    service = TestBed.inject(SseBasicTemplateService);
  });

  afterEach(() => {
    (window as any).fetch = originalFetch;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sends a POST request with FormData body', (done) => {
    const fd = makeFormData({ foo: 'bar' });
    mockFetch([]);
    service.connect('/basic', fd).subscribe({ complete: done, error: done.fail });
    expect((window as any).fetch).toHaveBeenCalledWith('/basic', jasmine.objectContaining({
      method: 'POST',
      body: fd
    }));
  });

  it('does not set Content-Type header (lets browser set multipart boundary)', (done) => {
    mockFetch([]);
    service.connect('/basic').subscribe({ complete: done, error: done.fail });
    const callArgs = ((window as any).fetch as jasmine.Spy).calls.mostRecent().args[1] as RequestInit;
    expect((callArgs as any).headers).toBeUndefined();
  });

  it('sends POST with empty FormData when no body argument is provided', (done) => {
    mockFetch([]);
    service.connect('/basic').subscribe({ complete: done, error: done.fail });
    const callArgs = ((window as any).fetch as jasmine.Spy).calls.mostRecent().args[1] as RequestInit;
    expect(callArgs.body).toBeInstanceOf(FormData);
  });

  it('emits data lines as plain strings', (done) => {
    const events: string[] = [];
    mockFetch(['data: <div>tpl</div>\n', 'data: <p>more</p>\n']);
    service.connect('/basic').subscribe({
      next: v => events.push(v),
      complete: () => {
        expect(events).toEqual(['<div>tpl</div>', '<p>more</p>']);
        done();
      },
      error: done.fail
    });
  });

  it('ignores non-data SSE lines (event:, id:, blank)', (done) => {
    const events: string[] = [];
    mockFetch(['event: new-basic-template\ndata: hello\nid: 1\n\n']);
    service.connect('/basic').subscribe({
      next: v => events.push(v),
      complete: () => {
        expect(events).toEqual(['hello']);
        done();
      },
      error: done.fail
    });
  });

  it('reassembles data split across multiple chunks', (done) => {
    const events: string[] = [];
    // "data: he" in one chunk, "llo\n" in the next
    mockFetch(['data: he', 'llo\n']);
    service.connect('/basic').subscribe({
      next: v => events.push(v),
      complete: () => {
        expect(events).toEqual(['hello']);
        done();
      },
      error: done.fail
    });
  });

  it('errors on non-OK HTTP status', (done) => {
    mockFetch([], 500);
    service.connect('/basic').subscribe({
      next: () => fail('should not emit'),
      error: (err: string) => {
        expect(err).toContain('500');
        done();
      }
    });
  });

  it('calls observer.complete when stream ends', (done) => {
    mockFetch(['data: line\n']);
    service.connect('/basic').subscribe({ complete: done, error: done.fail });
  });

  it('aborts fetch on unsubscribe', (done) => {
    let capturedSignal: AbortSignal | undefined;
    const stream = new ReadableStream<Uint8Array>({ start() {} }); // infinite — never closes
    (window as any).fetch = jasmine.createSpy('fetch').and.callFake((_url: string, init: RequestInit) => {
      capturedSignal = init.signal as AbortSignal;
      return Promise.resolve({ ok: true, status: 200, body: stream });
    });
    const sub = service.connect('/basic').subscribe({ error: () => {} });
    // Allow the async fetch chain to start before unsubscribing
    setTimeout(() => {
      sub.unsubscribe();
      expect(capturedSignal?.aborted).toBeTrue();
      done();
    }, 50);
  });
});

