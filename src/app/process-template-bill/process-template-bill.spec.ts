import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { ProcessTemplateBill } from './process-template-bill';
import { ServiceGeneral } from '../service/service-general';
import { HttpClientService } from '../service/http-client-service';

class MockServiceGeneral {
  selectedPromptBill$ = new Subject<string>();
  imageGenerated$ = new Subject<string>();

  setImageGenerated = jasmine.createSpy('setImageGenerated');
  setSelectedPromptBill = jasmine.createSpy('setSelectedPromptBill');
  setSelectedPrompt = jasmine.createSpy('setSelectedPrompt');
  setResizeInput = jasmine.createSpy('setResizeInput');
  setIsUploadingAnimation = jasmine.createSpy('setIsUploadingAnimation');
  setExecutingImageStream = jasmine.createSpy('setExecutingImageStream');
  setSelectedPromptImage = jasmine.createSpy('setSelectedPromptImage');
}

class MockHttpClientService {
  setPromptForGenerationImage = jasmine.createSpy('setPromptForGenerationImage').and.returnValue(of({}));
}

describe('ProcessTemplateBill (standalone)', () => {
  let component: ProcessTemplateBill;
  let fixture: ComponentFixture<ProcessTemplateBill>;
  let svc: MockServiceGeneral;
  let http: MockHttpClientService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessTemplateBill],
      providers: [
        { provide: ServiceGeneral, useClass: MockServiceGeneral },
        { provide: HttpClientService, useClass: MockHttpClientService }
      ]
    }).compileComponents();

    // Avoid rendering child components, keep logic-only
    TestBed.overrideComponent(ProcessTemplateBill, { set: { template: '' } });

    fixture = TestBed.createComponent(ProcessTemplateBill);
    component = fixture.componentInstance;
    svc = TestBed.inject(ServiceGeneral) as unknown as MockServiceGeneral;
    http = TestBed.inject(HttpClientService) as unknown as MockHttpClientService;
    fixture.detectChanges();
  });

  it('should create and subscribe to streams', () => {
    expect(component).toBeTruthy();

    svc.selectedPromptBill$.next('PROMPT');
    expect(component.prompt()).toBe('PROMPT');

    svc.imageGenerated$.next('BASE64');
    expect(component.showImage()).toBeTrue();
    expect(component.base64String()).toBe('BASE64');
  });

  it('ngOnDestroy resets state and calls service methods', () => {
    component.showImage.set(true);
    component.base64String.set('X');
    component.ngOnDestroy();
    expect(component.showImage()).toBeFalse();
    expect(component.base64String()).toBe('');
    expect(svc.setImageGenerated).toHaveBeenCalledWith('');
    expect(svc.setSelectedPromptBill).toHaveBeenCalledWith('');
    expect(svc.setSelectedPrompt).toHaveBeenCalledWith('');
  });

  it('submitPrompt sends only when prompt length >= 10', () => {
    component.prompt.set('short');
    component.submitPrompt();
    expect(http.setPromptForGenerationImage).not.toHaveBeenCalled();

    component.prompt.set('0123456789');
    component.submitPrompt();
    expect(http.setPromptForGenerationImage).toHaveBeenCalled();
  });

  it('successful setPrompt path resets prompt and triggers service flags', () => {
    component.prompt.set('0123456789');
    component.submitPrompt();
    expect(component.prompt()).toBe('');
    expect(svc.setResizeInput).toHaveBeenCalledWith(true);
    expect(svc.setIsUploadingAnimation).toHaveBeenCalledWith(true);
    expect(svc.setExecutingImageStream).toHaveBeenCalledWith(true);
    expect(svc.setSelectedPromptImage).toHaveBeenCalledWith('');
  });

  it('error in setPrompt logs without throwing', () => {
    http.setPromptForGenerationImage.and.returnValue(throwError(() => new Error('fail')));
    component.prompt.set('0123456789');
    const errSpy = spyOn(console, 'error');
    expect(() => component.submitPrompt()).not.toThrow();
    expect(errSpy).toHaveBeenCalled();
  });

  it('promptEmitter updates prompt and clears image', () => {
    component.showImage.set(true);
    component.base64String.set('IMG');
    component.promptEmitter('NEW');
    expect(component.prompt()).toBe('NEW');
    expect(component.showImage()).toBeFalse();
    expect(component.base64String()).toBe('');
  });
});
