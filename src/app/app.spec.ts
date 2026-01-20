import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { of, Subject } from 'rxjs';
import { ServiceGeneral } from './service/service-general';
import { ReceiveDataService } from './service/receive-data-service';
import { HttpClientService } from './service/http-client-service';
import { ConvertBase64ByteService } from './service/convert-base64-byte-service';
import { MessageService } from 'primeng/api';
import { ExecutingRestFulService } from './service/executing-rest-ful-service';

class MockServiceGeneral {
  refreshPromptBills$ = new Subject<string>();
  refreshPromptData$ = new Subject<string>();
  refreshPromptImages$ = new Subject<string>();
  refreshSyntheticData$ = new Subject<string>();
  refreshBasicTemplate$ = new Subject<string>();
  refreshPromptGlobalDefect$ = new Subject<string>();
  refreshPromptSystem$ = new Subject<string>();
  refreshPublicityData$ = new Subject<string>();
  imageIds$ = new Subject<any[]>();
  toastMessage$ = new Subject<any>();
  chatClientStreamPrueba$ = new Subject<any>();
  activateBasicTemplateStream$ = new Subject<boolean>();
  activateUploadDocumentStream$ = new Subject<boolean>();
  executingImageStream$ = new Subject<boolean>();
  changeComponent$ = new Subject<string>();

  setStatusMessage = jasmine.createSpy('setStatusMessage');
  setIsUploadingAnimation = jasmine.createSpy('setIsUploadingAnimation');
  setResponseMessagePrompt = jasmine.createSpy('setResponseMessagePrompt');
  setImageGenerated = jasmine.createSpy('setImageGenerated');
  setImageIds = jasmine.createSpy('setImageIds');
  setToastMessage = jasmine.createSpy('setToastMessage');
  setBasicTemplate = jasmine.createSpy('setBasicTemplate');
}

class MockReceiveDataService {
  data$ = new Subject<any>();
  file$ = new Subject<any>();
  basic$ = new Subject<any>();
  image$ = new Subject<any>();
  getDataStream() { return this.data$.asObservable(); }
  getDataStreamFile() { return this.file$.asObservable(); }
  getDataStreamBasicTemplate() { return this.basic$.asObservable(); }
  getDataStreamImage() { return this.image$.asObservable(); }
}

class MockHttpClientService {
  saveImageInRedis() { return of({ ok: true }); }
}

class MockConvertService {
  base64ToBlob() { return new Blob(); }
}

class MockMessageService {
  add = jasmine.createSpy('add');
}

class MockExecutingRestFulService {
  getAllPromptImages = jasmine.createSpy('getAllPromptImages');
  getAllPromptBill = jasmine.createSpy('getAllPromptBill');
  getAllPromptData = jasmine.createSpy('getAllPromptData');
  getAllSyntheticData = jasmine.createSpy('getAllSyntheticData');
  getAllPublicityData = jasmine.createSpy('getAllPublicityData');
  getAllBasicTemplate = jasmine.createSpy('getAllBasicTemplate');
  getAllPromptGlobalDefect = jasmine.createSpy('getAllPromptGlobalDefect');
  getAllPromptSystem = jasmine.createSpy('getAllPromptSystem');
}

describe('App (standalone)', () => {
  let fixture: ComponentFixture<App>;
  let component: App;
  let sg: MockServiceGeneral;
  let rd: MockReceiveDataService;
  let http: MockHttpClientService;
  let exec: MockExecutingRestFulService;
  let msg: MockMessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: ServiceGeneral, useClass: MockServiceGeneral },
        { provide: ReceiveDataService, useClass: MockReceiveDataService },
        { provide: HttpClientService, useClass: MockHttpClientService },
        { provide: ConvertBase64ByteService, useClass: MockConvertService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: ExecutingRestFulService, useClass: MockExecutingRestFulService },
      ],
    }).compileComponents();

    // Override template to avoid dynamic component rendering
    TestBed.overrideComponent(App, { set: { template: '' } });

    fixture = TestBed.createComponent(App);
    // Prevent dynamic loading entirely by stubbing loadComponent
    spyOn(fixture.componentInstance as any, 'loadComponent').and.stub();
    // Also prevent any side effects in ngAfterViewInit explicitly
    spyOn(fixture.componentInstance as any, 'ngAfterViewInit').and.callFake(() => {});
    component = fixture.componentInstance;
    sg = TestBed.inject(ServiceGeneral) as any;
    rd = TestBed.inject(ReceiveDataService) as any;
    http = TestBed.inject(HttpClientService) as any;
    exec = TestBed.inject(ExecutingRestFulService) as any;
    msg = TestBed.inject(MessageService) as any;
    fixture.detectChanges();
  });

  it('creates and wires toast stream to MessageService', () => {
    const message = { severity: 'info', detail: 'hi' };
    sg.toastMessage$.next(message);
    expect(msg.add).toHaveBeenCalledWith(message);
  });

  it('maps refresh streams to REST calls (subset)', () => {
    sg.refreshPromptImages$.next('1');
    sg.refreshPromptBills$.next('1');
    sg.refreshPromptSystem$.next('1');
    expect(exec.getAllPromptImages).toHaveBeenCalled();
    expect(exec.getAllPromptBill).toHaveBeenCalled();
    expect(exec.getAllPromptSystem).toHaveBeenCalled();
  });

  it('handles chat data stream success and error paths', () => {
    const request = { prompt: 'go' } as any;
    sg.chatClientStreamPrueba$.next(request);
    rd.data$.next({ data: { message: 'OK' } });
    expect(sg.setStatusMessage).toHaveBeenCalledWith(true);
    expect(sg.setIsUploadingAnimation).toHaveBeenCalledWith(false);
    expect(sg.setResponseMessagePrompt).toHaveBeenCalledWith('OK');

    sg.chatClientStreamPrueba$.next(request);
    rd.data$.error('boom');
    expect(sg.setStatusMessage).toHaveBeenCalledWith(false);
    expect(sg.setIsUploadingAnimation).toHaveBeenCalledWith(false);
    expect(sg.setResponseMessagePrompt).toHaveBeenCalledWith('Error: Could not complete the request.');
  });

  it('handles file upload stream success and error', () => {
    sg.activateUploadDocumentStream$.next(true);
    rd.file$.next({ ok: true });
    expect(sg.setIsUploadingAnimation).toHaveBeenCalledWith(false);
    expect(sg.setToastMessage).toHaveBeenCalled();

    sg.activateUploadDocumentStream$.next(true);
    rd.file$.error('err');
    expect(sg.setIsUploadingAnimation).toHaveBeenCalledWith(false);
    expect(sg.setToastMessage).toHaveBeenCalled();
  });

  it('handles basic template stream: ignores start flag, parses JSON, warns on invalid', () => {
    sg.activateBasicTemplateStream$.next(true);
    rd.basic$.next('Basic Template generation started for prompt'); // ignored

    sg.activateBasicTemplateStream$.next(true);
    rd.basic$.next('{"ok":true}'); // valid JSON
    expect(sg.setIsUploadingAnimation).toHaveBeenCalledWith(false);
    expect(sg.setBasicTemplate).toHaveBeenCalledWith({ ok: true } as any);
    expect(sg.setToastMessage).toHaveBeenCalled();

    sg.activateBasicTemplateStream$.next(true);
    rd.basic$.next('not json'); // invalid JSON -> warn toast
    expect(sg.setToastMessage).toHaveBeenCalled();
  });

  it('basic template stream error path sets error toast and stops animation', () => {
    sg.activateBasicTemplateStream$.next(true);
    rd.basic$.error('bad');
    expect(sg.setToastMessage).toHaveBeenCalled();
    expect(sg.setIsUploadingAnimation).toHaveBeenCalledWith(false);
  });

  it('handles image stream and persists image', () => {
    spyOn(http, 'saveImageInRedis').and.returnValue(of({ ok: true }));
    sg.executingImageStream$.next(true);
    rd.image$.next('Image generation started for prompt'); // ignored
    rd.image$.next('QUJD'); // base64
    expect(sg.setImageGenerated).toHaveBeenCalledWith('QUJD');
    expect(http.saveImageInRedis).toHaveBeenCalled();
    expect(sg.setIsUploadingAnimation).toHaveBeenCalledWith(false);
  });

  it('image stream success sets success toast payload', () => {
    spyOn(http, 'saveImageInRedis').and.returnValue(of({ ok: true }));
    sg.executingImageStream$.next(true);
    rd.image$.next('ABCD');
    expect(sg.setToastMessage).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success', detail: 'Imagen generada' }));
  });

  it('setSubscriptionToImageReceiver(false) is a no-op', () => {
    const spyGet = spyOn(rd, 'getDataStreamImage').and.callThrough();
    (component as any).setSubscriptionToImageReceiver(false);
    expect(spyGet).not.toHaveBeenCalled();
  });

  it('image stream success pushes ids and calls setImageIds', () => {
    const saveSpy = spyOn(http, 'saveImageInRedis').and.returnValue(of({ ok: true }));
    sg.executingImageStream$.next(true);
    rd.image$.next('WXYZ');
    expect(saveSpy).toHaveBeenCalled();
    expect(sg.setImageIds).toHaveBeenCalled();
  });

  it('setSubscriptionToDataReceiver unsubscribes previous subscription', () => {
    const prev = { unsubscribe: jasmine.createSpy('unsubscribe') } as any;
    (component as any).sseSubscription = prev;
    spyOn(rd, 'getDataStream').and.returnValue(new Subject<any>().asObservable());
    (component as any).setSubscriptionToDataReceiver({ prompt: 'go' } as any);
    expect(prev.unsubscribe).toHaveBeenCalled();
  });

  it('persists image using FormData with image entry', () => {
    const spy = spyOn(http, 'saveImageInRedis').and.returnValue(of({ ok: true }));
    sg.executingImageStream$.next(true);
    rd.image$.next('Image generation started for prompt');
    rd.image$.next('ABCD');
    expect(spy).toHaveBeenCalled();
    const recent = (spy.calls as any).mostRecent();
    const arg = recent.args[0] as any;
    expect(arg instanceof FormData).toBeTrue();
    const imagePart = arg.get('image');
    expect(!!imagePart).toBeTrue();
  });

  it('changeComponent$ calls loadComponent only for non-empty values', () => {
    const loadSpy = (component as any).loadComponent as jasmine.Spy;
    loadSpy.calls.reset();
    sg.changeComponent$.next('');
    expect(loadSpy).not.toHaveBeenCalled();
    sg.changeComponent$.next('show-presentation');
    expect(loadSpy).toHaveBeenCalled();
  });

  it('getAll early-returns when event is falsy', () => {
    const beforeCounts = {
      img: exec.getAllPromptImages.calls.count(),
      bill: exec.getAllPromptBill.calls.count(),
      data: exec.getAllPromptData.calls.count(),
    };
    (component as any).getAll('promptImages', '');
    (component as any).getAll('promptBills', '');
    (component as any).getAll('promptData', '');
    expect(exec.getAllPromptImages.calls.count()).toBe(beforeCounts.img);
    expect(exec.getAllPromptBill.calls.count()).toBe(beforeCounts.bill);
    expect(exec.getAllPromptData.calls.count()).toBe(beforeCounts.data);
  });

  it('getAll maps all kinds to respective REST calls', () => {
    (component as any).getAll('promptImages', '1');
    (component as any).getAll('promptBills', '1');
    (component as any).getAll('promptData', '1');
    (component as any).getAll('syntheticData', '1');
    (component as any).getAll('publicityData', '1');
    (component as any).getAll('basicTemplate', '1');
    (component as any).getAll('promptGlobalDefect', '1');
    (component as any).getAll('promptSystem', '1');

    expect(exec.getAllPromptImages).toHaveBeenCalled();
    expect(exec.getAllPromptBill).toHaveBeenCalled();
    expect(exec.getAllPromptData).toHaveBeenCalled();
    expect(exec.getAllSyntheticData).toHaveBeenCalled();
    expect(exec.getAllPublicityData).toHaveBeenCalled();
    expect(exec.getAllBasicTemplate).toHaveBeenCalled();
    expect(exec.getAllPromptGlobalDefect).toHaveBeenCalled();
    expect(exec.getAllPromptSystem).toHaveBeenCalled();
  });

  it('image stream error path sets error toast and stops animation', () => {
    sg.executingImageStream$.next(true);
    rd.image$.error('kaput');
    expect(sg.setToastMessage).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'error', detail: 'kaput' }));
    expect(sg.setIsUploadingAnimation).toHaveBeenCalledWith(false);
  });

  it('chat stream ignores empty prompt requests', () => {
    const spyGet = spyOn(rd, 'getDataStream').and.callThrough();
    sg.chatClientStreamPrueba$.next({ prompt: '' });
    expect(spyGet).not.toHaveBeenCalled();
  });

  it('file upload success/error set specific toast payloads', () => {
    sg.activateUploadDocumentStream$.next(true);
    rd.file$.next({ ok: true });
    expect(sg.setToastMessage).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success', detail: 'Documento procesado correctamente' }));

    sg.activateUploadDocumentStream$.next(true);
    rd.file$.error('err');
    expect(sg.setToastMessage).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'error', detail: 'Error en el procesamiento del documento' }));
  });

  it('basic template invalid JSON warns with specific message', () => {
    sg.activateBasicTemplateStream$.next(true);
    rd.basic$.next('not json');
    expect(sg.setToastMessage).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'warn', detail: 'Error en la estructura del json de respuesta' }));
  });

  it('loadComponent returns early for unknown component name', () => {
    const result = (App.prototype as any).loadComponent.call(component, 'unknown-component-key');
    expect(result).toBeUndefined();
  });

  it('loadComponent happy path clears container and creates component', () => {
    const vcr = {
      clear: jasmine.createSpy('clear'),
      createComponent: jasmine.createSpy('createComponent')
    } as any;
    const self = Object.assign({}, component, { viewContainerRef: vcr });
    (App.prototype as any).loadComponent.call(self, 'show-presentation');
    expect(vcr.clear).toHaveBeenCalled();
    expect(vcr.createComponent).toHaveBeenCalled();
  });

  it('catchErrorInJsonTransformation success path sets template and success toast', () => {
    (component as any).catchErrorInJsonTransformation('{"ok":true}');
    expect(sg.setIsUploadingAnimation).toHaveBeenCalledWith(false);
    expect(sg.setBasicTemplate).toHaveBeenCalledWith({ ok: true } as any);
    expect(sg.setToastMessage).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
  });

  it('catchErrorInJsonTransformation error path warns', () => {
    (component as any).catchErrorInJsonTransformation('bad-json');
    expect(sg.setToastMessage).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'warn' }));
  });

  it('getAll ignores unknown kind safely', () => {
    (component as any).getAll('unknown', '1');
    // No crash and no additional expectations; verifies no-op branch via any-cast
    expect(true).toBeTrue();
  });

  it('setSubscriptionToFileReceiver(false) is a no-op (no subscription)', () => {
    const spyGet = spyOn(rd, 'getDataStreamFile').and.callThrough();
    (component as any).setSubscriptionToFileReceiver(false);
    expect(spyGet).not.toHaveBeenCalled();
  });

  it('setSubscriptionToFileReceiver(true) subscribes to file stream', () => {
    const spyGet = spyOn(rd, 'getDataStreamFile').and.callThrough();
    (component as any).setSubscriptionToFileReceiver(true);
    expect(spyGet).toHaveBeenCalled();
  });

  it('setSubscriptionToBasicTemplateReceiver(false) is a no-op', () => {
    const spyGet = spyOn(rd, 'getDataStreamBasicTemplate').and.callThrough();
    (component as any).setSubscriptionToBasicTemplateReceiver(false);
    expect(spyGet).not.toHaveBeenCalled();
  });

  it('setSubscriptionToDataReceiver ignores null/undefined requests', () => {
    const spyGet = spyOn(rd, 'getDataStream').and.callThrough();
    (component as any).setSubscriptionToDataReceiver(undefined as any);
    expect(spyGet).not.toHaveBeenCalled();
  });

  it('setRequestRedis builds FormData with image filename', () => {
    const blob = new Blob([new Uint8Array([1,2,3])], { type: 'image/png' });
    const id = 'fixed-id';
    const form = (component as any).setRequestRedis(blob, id) as FormData;
    const part = form.get('image') as any;
    expect(part).toBeTruthy();
    // In jsdom, Blob/File may expose a name when appended with filename
    expect(part.name || part.filename || '').toBe('fixed-id');
  });
});
