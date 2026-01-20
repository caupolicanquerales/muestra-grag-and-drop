import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { BillTemplate } from './bill-template';
import { ServiceGeneral } from '../service/service-general';
import { HttpClientService } from '../service/http-client-service';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { JoyrideService } from 'ngx-joyride';
import { TypePromptEnum } from '../enums/type-prompt-enum';

class MockServiceGeneral {
  basicTemplateData$ = new Subject<any[]>();
  basicTemplate$ = new Subject<any>();

  setImageGenerated = jasmine.createSpy('setImageGenerated');
  setActivateBasicTemplateStream = jasmine.createSpy('setActivateBasicTemplateStream');
  setIsUploadingAnimation = jasmine.createSpy('setIsUploadingAnimation');
  setBasicTemplate = jasmine.createSpy('setBasicTemplate');
}

class MockHttpClientService {
  sendingFileForBasicTemplate = jasmine.createSpy('sendingFileForBasicTemplate').and.returnValue(of({}));
  updatePromptForBasicTemplate = jasmine.createSpy('updatePromptForBasicTemplate').and.returnValue(of({}));
}

class MockExecutingRestFulService {
  getBasicTemplateById = jasmine.createSpy('getBasicTemplateById');
  deleteBasicTemplateById = jasmine.createSpy('deleteBasicTemplateById');
  saveBasicTemplate = jasmine.createSpy('saveBasicTemplate');
}

class MockJoyrideService {
  startTour = jasmine.createSpy('startTour');
}

describe('BillTemplate (standalone)', () => {
  let component: BillTemplate;
  let fixture: ComponentFixture<BillTemplate>;
  let svc: MockServiceGeneral;
  let http: MockHttpClientService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillTemplate],
      providers: [
        { provide: ServiceGeneral, useClass: MockServiceGeneral },
        { provide: HttpClientService, useClass: MockHttpClientService },
        { provide: ExecutingRestFulService, useClass: MockExecutingRestFulService },
        { provide: JoyrideService, useClass: MockJoyrideService }
      ]
    }).compileComponents();

    // Prevent heavy PrimeNG/child rendering
    TestBed.overrideComponent(BillTemplate, { set: { template: '' } });

    fixture = TestBed.createComponent(BillTemplate);
    component = fixture.componentInstance;
    svc = TestBed.inject(ServiceGeneral) as unknown as MockServiceGeneral;
    http = TestBed.inject(HttpClientService) as unknown as MockHttpClientService;
    fixture.detectChanges();
  });

  it('should create and initialize streams', () => {
    expect(component).toBeTruthy();
    expect(Array.isArray(component.headerDialog)).toBeTrue();
    expect(Array.isArray(component.itemsSavePrompt)).toBeTrue();

    const dataArr = [{ id: 1, name: 'T1' }];
    svc.basicTemplateData$.next(dataArr);
    expect(component.templatesIds).toEqual(dataArr as any);
    expect(component.pagination()).toBeTrue();

    svc.basicTemplate$.next({ htmlString: '<h1>A</h1>', cssString: 'h1{c:red}' });
    expect(component.htmlString()).toBe('<h1>A</h1>');
    expect(component.cssString()).toBe('h1{c:red}');
    expect(svc.setActivateBasicTemplateStream).toHaveBeenCalledWith(false);
  });

  it('ngOnDestroy cleans up and resets service flags', () => {
    component.ngOnDestroy();
    expect(svc.setBasicTemplate).toHaveBeenCalledWith('');
    expect(svc.setActivateBasicTemplateStream).toHaveBeenCalledWith(false);
  });

  it('selectedFileEmitter sets selectedFilesTemplate signal', () => {
    const fakeList = { length: 1 } as unknown as FileList;
    component.selectedFileEmitter(fakeList);
    expect(component.selectedFilesTemplate()).toBe(fakeList);
  });

  it('uploadFile: no selection does nothing', () => {
    const spyExec = spyOn<any>(component, 'executingSaveFile');
    component.selectedFilesTemplate.set(null);
    component.uploadFile('ignored');
    expect(spyExec).not.toHaveBeenCalled();
  });

  it('uploadFile: selected files triggers executingSaveFile with FormData', () => {
    const fakeList = { length: 2 } as unknown as FileList;
    component.selectedFilesTemplate.set(fakeList);
    const fd = new FormData();
    spyOn<any>(component, 'setFormData').and.returnValue(fd);
    const spyExec = spyOn<any>(component, 'executingSaveFile');
    component.uploadFile('ignored');
    expect(spyExec).toHaveBeenCalledWith(fd);
  });

  it('executingSaveFile: success path updates flags and chains updatePrompt', () => {
    const spyUpdate = spyOn<any>(component, 'updatePromptToGenerateBasicTemplate');
    const spyReq = spyOn<any>(component, 'getRequestGenerationData').and.returnValue({ prompt: ['p'] });
    component['executingSaveFile'](new FormData());
    expect(component.allowButton()).toBeFalse();
    expect(svc.setIsUploadingAnimation).toHaveBeenCalledWith(true);
    expect(spyReq).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalledWith({ prompt: ['p'] });
  });

  it('executingSaveFile: error path logs error without throwing', () => {
    http.sendingFileForBasicTemplate.and.returnValue(throwError(() => new Error('fail')));
    const errSpy = spyOn(console, 'error');
    expect(() => component['executingSaveFile'](new FormData())).not.toThrow();
    expect(errSpy).toHaveBeenCalled();
  });

  it('updatePromptToGenerateBasicTemplate: success activates stream', () => {
    component['updatePromptToGenerateBasicTemplate']({ prompt: ['x'] } as any);
    expect(http.updatePromptForBasicTemplate).toHaveBeenCalled();
    expect(svc.setActivateBasicTemplateStream).toHaveBeenCalledWith(true);
  });

  it('updatePromptToGenerateBasicTemplate: error logs without throwing', () => {
    http.updatePromptForBasicTemplate.and.returnValue(throwError(() => new Error('u-fail')));
    const errSpy = spyOn(console, 'error');
    expect(() => component['updatePromptToGenerateBasicTemplate']({ prompt: ['x'] } as any)).not.toThrow();
    expect(errSpy).toHaveBeenCalled();
  });

  it('selectTemplate triggers service calls', () => {
    const exec = TestBed.inject(ExecutingRestFulService) as unknown as MockExecutingRestFulService;
    component.selectTemplate({ id: 123 });
    expect(svc.setIsUploadingAnimation).toHaveBeenCalledWith(true);
    expect(exec.getBasicTemplateById).toHaveBeenCalled();
  });

  it('deleteTemplate opens dialog and sets selected', () => {
    component.deleteTemplate({ id: 77 });
    expect(component.visible()).toBeTrue();
    expect(component.selectedBasicTemplate).toEqual({ id: 77 } as any);
  });

  it('deleteSelectedTemplate calls delete service', () => {
    const exec = TestBed.inject(ExecutingRestFulService) as unknown as MockExecutingRestFulService;
    component.selectedBasicTemplate = { id: 1 };
    component.deleteSelectedTemplate({});
    expect(exec.deleteBasicTemplateById).toHaveBeenCalled();
  });

  it('emitSavePrompt saves only for BASIC_TEMPLATE', () => {
    const exec = TestBed.inject(ExecutingRestFulService) as unknown as MockExecutingRestFulService;
    component.htmlString.set('<div/>');
    component.cssString.set('div{}');
    component.emitSavePrompt({ typePrompt: TypePromptEnum.BASIC_TEMPLATE, name: 'N' });
    expect(exec.saveBasicTemplate).toHaveBeenCalled();

    exec.saveBasicTemplate.calls.reset();
    component.emitSavePrompt({ typePrompt: 'OTHER', name: 'N' });
    expect(exec.saveBasicTemplate).not.toHaveBeenCalled();
  });

  it('startTour invokes JoyrideService.startTour', () => {
    const joy = TestBed.inject(JoyrideService) as unknown as MockJoyrideService;
    component.startTour();
    expect(joy.startTour).toHaveBeenCalled();
  });
});

