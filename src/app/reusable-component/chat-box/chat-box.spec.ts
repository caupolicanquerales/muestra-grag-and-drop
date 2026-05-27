import { ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import { of, Subject } from 'rxjs';

import { ChatBox } from './chat-box';
import { ServiceGeneral } from '../service/service-general';
import { JoyrideService } from 'ngx-joyride';
import * as DownloadUtils from '../utils/download-file-utils';

class MockServiceGeneral {
  resizeInput$ = new Subject<boolean>();
}

class MockJoyrideService {
  startTour = jasmine.createSpy('startTour');
}

describe('ChatBox (standalone)', () => {
  let component: ChatBox;
  let fixture: ComponentFixture<ChatBox>;
  let svc: MockServiceGeneral;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBox],
      providers: [
        { provide: ServiceGeneral, useClass: MockServiceGeneral },
        { provide: JoyrideService, useClass: MockJoyrideService }
      ]
    }).compileComponents();

    // Keep tests logic-only by avoiding heavy child/PrimeNG rendering
    TestBed.overrideComponent(ChatBox, { set: { template: '' } });

    fixture = TestBed.createComponent(ChatBox);
    component = fixture.componentInstance;
    svc = TestBed.inject(ServiceGeneral) as unknown as MockServiceGeneral;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sendPromptEmitter emits current textarea value', () => {
    const el = { value: 'hello world' } as HTMLTextAreaElement;
    spyOn(document, 'getElementById').and.callFake((id: string) => id === 'prompt-input' ? el as any : null);
    const emitSpy = spyOn(component.promptEmitter, 'emit');
    component.sendPromptEmitter();
    expect(emitSpy).toHaveBeenCalledWith('hello world');
  });

  it('submitPrompt emits submit event token', () => {
    const emitSpy = spyOn(component.submitPromptEmitter, 'emit');
    component.submitPrompt();
    expect(emitSpy).toHaveBeenCalledWith('executing-submit-prompt-event');
  });

  it('selectedFilesEvent resets deleteFiles and emits files', () => {
    component.deleteFiles = true;
    const files = [new File(['a'], 'a.txt')];
    const emitSpy = spyOn(component.selectedFilesEmitter, 'emit');
    component.selectedFilesEvent(files as any);
    expect(component.deleteFiles).toBeFalse();
    expect(emitSpy).toHaveBeenCalledWith(files as any);
  });

  it('emitHelpTextEvent triggers Joyride tour', () => {
    const joy = TestBed.inject(JoyrideService) as unknown as MockJoyrideService;
    component.emitHelpTextEvent({});
    expect(joy.startTour).toHaveBeenCalled();
  });

  it('submitCopyText copies response text and emits extract event', fakeAsync(() => {
    const responseEl = { textContent: 'RESP' } as unknown as HTMLElement;
    spyOn(document, 'getElementById').and.callFake((id: string) => id === 'response' ? responseEl as any : null);
    if (!("clipboard" in navigator)) {
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.resolve() }, configurable: true });
    }
    spyOn(navigator.clipboard as any, 'writeText').and.returnValue(Promise.resolve());
    const emitSpy = spyOn(component.submitExtractJsonEmitter, 'emit');
    component.submitCopyText('ignored');
    flushMicrotasks();
    expect((navigator as any).clipboard.writeText).toHaveBeenCalledWith('RESP');
    expect(emitSpy).toHaveBeenCalledWith('executing-extract-json-event');
  }));

  it('submitCopyText logs error but still emits when clipboard fails', fakeAsync(() => {
    const responseEl = { textContent: 'RESP' } as unknown as HTMLElement;
    spyOn(document, 'getElementById').and.returnValue(responseEl as any);
    if (!("clipboard" in navigator)) {
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.resolve() }, configurable: true });
    }
    spyOn(navigator.clipboard as any, 'writeText').and.returnValue(Promise.reject(new Error('fail')));
    const errSpy = spyOn(console, 'error');
    const emitSpy = spyOn(component.submitExtractJsonEmitter, 'emit');
    component.submitCopyText('ignored');
    flushMicrotasks();
    expect(errSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('executing-extract-json-event');
  }));

  it('exportInformation triggers change detection after download call path', () => {
    component.responseMessage.set('# Title');
    spyOn(document, 'getElementById').and.returnValue({ textContent: 'HTML TEXT' } as any);
    const cdSpy = spyOn((component as any).cd, 'detectChanges');
    expect(() => component.exportInformation('.md')).not.toThrow();
    expect(cdSpy).toHaveBeenCalled();
  });

  it('exportInformation with .md uses responseMessage and triggers anchor click', () => {
    component.responseMessage.set('# Markdown');
    spyOn(document, 'getElementById').and.returnValue({ textContent: 'IGNORED' } as any);
    const fakeLink = { click: jasmine.createSpy('click') } as any;
    spyOn(document, 'createElement').and.returnValue(fakeLink);
    spyOn(document.body as any, 'appendChild').and.stub();
    spyOn(document.body as any, 'removeChild').and.stub();
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:fake');
    spyOn(window.URL, 'revokeObjectURL').and.stub();
    component.exportInformation('.md');
    expect(fakeLink.click).toHaveBeenCalled();
  });

  it('exportInformation with non-md and missing DOM does nothing', () => {
    spyOn(document, 'getElementById').and.returnValue(null as any);
    const elSpy = spyOn(document, 'createElement');
    component.exportInformation('.txt');
    expect(elSpy).not.toHaveBeenCalled();
  });

  it('submitCopyText returns early when response element missing', fakeAsync(() => {
    spyOn(document, 'getElementById').and.returnValue(null as any);
    if (!('clipboard' in navigator)) {
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.resolve() }, configurable: true });
    }
    const clipSpy = spyOn((navigator as any).clipboard, 'writeText');
    const emitSpy = spyOn(component.submitExtractJsonEmitter, 'emit');
    component.submitCopyText('ignored');
    flushMicrotasks();
    expect(clipSpy).not.toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
  }));

  it('emitSavePrompt reads response HTML and emits save payload', () => {
    const fake = { innerHTML: '<b>HTML</b>' } as unknown as HTMLElement;
    spyOn(document, 'getElementById').and.callFake((id: string) => id === 'response' ? fake as any : null);
    const emitSpy = spyOn(component.savePromptEmitterInDB, 'emit');
    component.emitSavePrompt({ typePrompt: 'TYPE', name: 'N' });
    expect(emitSpy).toHaveBeenCalledWith({ typePrompt: 'TYPE', prompt: '<b>HTML</b>', name: 'N' });
  });

  it('emitEraseText clears prompt and marks deleteFiles', fakeAsync(() => {
    component.promptInput.set('SOMETHING');
    const rzSpy = spyOn<any>(component, 'resizeTextarea');
    component.emitEraseText({});
    tick();
    expect(component.promptInput()).toBe('');
    expect(component.deleteFiles).toBeTrue();
    expect(rzSpy).toHaveBeenCalled();
  }));

  it('emitSavePrompt returns early when response element is missing', () => {
    spyOn(document, 'getElementById').and.returnValue(null as any);
    const emitSpy = spyOn(component.savePromptEmitterInDB, 'emit');
    expect(() => component.emitSavePrompt({ typePrompt: 'T', name: 'N' })).not.toThrow();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('prompt input setter sanitizes and trims, triggers resize', fakeAsync(() => {
    const rzSpy = spyOn<any>(component, 'resizeTextarea');
    (component as any).prompt = '  <b>Hi</b>  ';
    tick();
    expect(component.promptInput()).toBe('Hi');
    expect(rzSpy).toHaveBeenCalled();
  }));

  it('deleteFilesFromOutside setter updates flag', () => {
    (component as any).deleteFilesFromOutside = true;
    expect(component.deleteFiles).toBeTrue();
  });

  it('resizeTextarea updates height when element exists', fakeAsync(() => {
    const ta = document.createElement('textarea');
    ta.id = 'prompt-input';
    document.body.appendChild(ta);
    Object.defineProperty(ta, 'scrollHeight', { value: 77 });
    component.resizeTextarea();
    tick(300);
    expect(ta.style.height).toBe('77px');
    document.body.removeChild(ta);
  }));

  it('resizeTextAreAfter sets fixed height when resize flag true', () => {
    const ta = document.createElement('textarea');
    ta.id = 'prompt-input';
    document.body.appendChild(ta);
    (svc.resizeInput$ as Subject<boolean>).next(true);
    expect(ta.style.height).toBe('108px');
    document.body.removeChild(ta);
  });
});
