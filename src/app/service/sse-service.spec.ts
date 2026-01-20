import { fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { SseService } from './sse-service';

describe('SseService', () => {
  let service: SseService;

  beforeEach(() => {
    const fakeZone = { runOutsideAngular: (fn: any) => fn(), run: (fn: any) => fn() } as any;
    service = new SseService(fakeZone);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('connectPost emits parsed data chunks and completes on COMPLETED message', fakeAsync(() => {
    const payload = { foo: 'bar' } as any;
    const readerState = {
      calls: 0,
    };
    const streamChunk = `data: ${JSON.stringify({ message: 'hello' })}\n`;
    const completeChunk = `data: ${JSON.stringify({ message: 'new-message-COMPLETED' })}\n`;
    spyOn(window as any, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
      body: {
        getReader: () => ({
          read: () => {
            readerState.calls++;
            if (readerState.calls === 1) return Promise.resolve({ value: new TextEncoder().encode(streamChunk), done: false });
            if (readerState.calls === 2) return Promise.resolve({ value: new TextEncoder().encode(completeChunk), done: false });
            return Promise.resolve({ value: undefined, done: true });
          }
        })
      }
    } as any));

    const nextSpy = jasmine.createSpy('next');
    const completeSpy = jasmine.createSpy('complete');
    const errorSpy = jasmine.createSpy('error');

    service.connectPost('/sse', payload).subscribe({ next: nextSpy, complete: completeSpy, error: errorSpy });
    flushMicrotasks();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  }));

  it('connectPost errors on non-ok HTTP response', fakeAsync(() => {
    spyOn(window as any, 'fetch').and.returnValue(Promise.resolve({ ok: false, status: 500 } as any));
    const errorSpy = jasmine.createSpy('error');
    service.connectPost('/sse', {} as any).subscribe({ error: errorSpy });
    flushMicrotasks();
    expect(errorSpy).toHaveBeenCalled();
  }));

  it('connectPost errors when ReadableStream not supported (no reader)', fakeAsync(() => {
    spyOn(window as any, 'fetch').and.returnValue(Promise.resolve({ ok: true, body: { getReader: () => null } } as any));
    const errorSpy = jasmine.createSpy('error');
    service.connectPost('/sse', {} as any).subscribe({ error: errorSpy });
    flushMicrotasks();
    expect(errorSpy).toHaveBeenCalled();
  }));

  it('connectPost swallows AbortError without emitting error', fakeAsync(() => {
    const abortErr = new Error('aborted') as any; abortErr.name = 'AbortError';
    spyOn(window as any, 'fetch').and.callFake(() => { throw abortErr; });
    const errorSpy = jasmine.createSpy('error');
    const completeSpy = jasmine.createSpy('complete');
    service.connectPost('/sse', {} as any).subscribe({ error: errorSpy, complete: completeSpy });
    flushMicrotasks();
    expect(errorSpy).not.toHaveBeenCalled();
  }));

  it('ignores non-data lines and logs JSON parse errors', fakeAsync(() => {
    const chunk1 = `note: hello\n`;
    const chunk2 = `data: not-json\n`;
    let call = 0;
    spyOn(window as any, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
      body: {
        getReader: () => ({
          read: () => {
            call++;
            if (call === 1) return Promise.resolve({ value: new TextEncoder().encode(chunk1), done: false });
            if (call === 2) return Promise.resolve({ value: new TextEncoder().encode(chunk2), done: false });
            return Promise.resolve({ value: undefined, done: true });
          }
        })
      }
    } as any));

    const nextSpy = jasmine.createSpy('next');
    const completeSpy = jasmine.createSpy('complete');
    const errorSpy = jasmine.createSpy('error');
    const logSpy = spyOn(console, 'error');

    service.connectPost('/sse', {} as any).subscribe({ next: nextSpy, complete: completeSpy, error: errorSpy });
    flushMicrotasks();

    expect(nextSpy).not.toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
  }));
});
