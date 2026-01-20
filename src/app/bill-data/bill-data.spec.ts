import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { BillData } from './bill-data';
import { HttpClientService } from '../service/http-client-service';
import { ServiceGeneral } from '../service/service-general';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { GenerationDataInterface } from '../models/generation-data-interface';

// Stub ChatBox to avoid Joyride providers and heavy template
@Component({
  selector: 'chat-box',
  standalone: true,
  template: ''
})
class FakeChatBox {
  @Input() prompt = '';
  @Input() responseMessage: any;
  @Input() statusMessage: any;
  @Input() titleData = '';
  @Input() subTitleData = '';
  @Input() placeHolder = '';
  @Input() labelExtractButton = '';
  @Input() formatFiles = '';
  @Input() itemsExportPrompt: any[] = [];
  @Input() itemsSavePrompt: any[] = [];
  @Input() headerDialog: any[] = [];
  @Input() helpButton = false;
  @Input() informationHelpTour: any = {};
  @Input() arrayPromptAndData: any = {};
  @Input() deleteFilesFromOutside = false;
  @Output() submitPromptEmitter = new EventEmitter<string>();
  @Output() promptEmitter = new EventEmitter<string>();
  @Output() selectedFilesEmitter = new EventEmitter<Array<File>>();
  @Output() savePromptEmitterInDB = new EventEmitter<any>();
}

// Mocks
class MockHttpClientService {
  getPromptExtractionFromRepository = jasmine.createSpy('getPromptExtractionFromRepository')
    .and.returnValue(of({ prompt: 'extraction-base' }));
  sendingFileForGenerationData = jasmine.createSpy('sendingFileForGenerationData')
    .and.returnValue(of({}));
}

class MockServiceGeneral {
  // minimal observables used by ngOnInit
  statusMessage$ = of(false);
  responseMessagePrompt$ = of('');
  selectedPrompt$ = of('');
  promptImages$ = of([]);
  promptData$ = of([]);
  syntheticData$ = of([]);

  setImageGenerated = jasmine.createSpy('setImageGenerated');
  setActivateChatClientStreamPrueba = jasmine.createSpy('setActivateChatClientStreamPrueba');
  setResizeInput = jasmine.createSpy('setResizeInput');
  setIsUploadingAnimation = jasmine.createSpy('setIsUploadingAnimation');
  setSelectedPrompt = jasmine.createSpy('setSelectedPrompt');
  setSelectedPromptBill = jasmine.createSpy('setSelectedPromptBill');
}

class MockExecutingRestFulService {
  savePromptImage = jasmine.createSpy('savePromptImage');
  savePromptData = jasmine.createSpy('savePromptData');
  saveSyntheticData = jasmine.createSpy('saveSyntheticData');
}

describe('BillData (standalone)', () => {
  let component: BillData;
  let fixture: ComponentFixture<BillData>;
  let httpMock: MockHttpClientService;
  let serviceMock: MockServiceGeneral;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillData],
      providers: [
        { provide: HttpClientService, useClass: MockHttpClientService },
        { provide: ServiceGeneral, useClass: MockServiceGeneral },
        { provide: ExecutingRestFulService, useClass: MockExecutingRestFulService }
      ]
    }).compileComponents();

    // Replace ChatBox with lightweight stub
    TestBed.overrideComponent(BillData, {
      set: {
        imports: [FakeChatBox]
      }
    });

    fixture = TestBed.createComponent(BillData);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpClientService) as unknown as MockHttpClientService;
    serviceMock = TestBed.inject(ServiceGeneral) as unknown as MockServiceGeneral;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submitPrompt sends prompt and updates state (length >= 10)', fakeAsync(() => {
    const longPrompt = '0123456789hello';
    component.prompt.set(longPrompt);

    component.submitPrompt();

    expect(serviceMock.setActivateChatClientStreamPrueba).toHaveBeenCalledWith({ prompt: longPrompt } as GenerationDataInterface);

    // Flush setTimeout in executingPrompt -> updatePromptToGenerateData
    tick(60);
    fixture.detectChanges();

    expect(component.prompt()).toBe('');
    expect(serviceMock.setResizeInput).toHaveBeenCalledWith(true);
    expect(serviceMock.setIsUploadingAnimation).toHaveBeenCalledWith(true);
  }));

  it('submitPrompt does nothing when prompt too short (<10)', () => {
    component.prompt.set('short');
    component.submitPrompt();
    expect(serviceMock.setActivateChatClientStreamPrueba).not.toHaveBeenCalled();
  });

  it('error handling: sending files errors should not throw and not trigger prompt execution', () => {
    // Prepare a file and force error on upload
    const file = new File(['abc'], 'a.txt', { type: 'text/plain' });
    component.selectedFiles = [file];
    component.prompt.set('0123456789valid');

    httpMock.sendingFileForGenerationData.and.returnValue(throwError(() => new Error('upload failed')));

    expect(() => component.submitPrompt()).not.toThrow();
    // Since upload failed, executingPrompt should not be called; we expect no stream activation
    expect(serviceMock.setActivateChatClientStreamPrueba).not.toHaveBeenCalled();
    // Files should remain (no success path clearing)
    expect(component.selectedFiles.length).toBe(1);
  });

  it('sendingFileAndPrompt success clears files, flags delete, and triggers execution', fakeAsync(() => {
    const file = new File(['abc'], 'a.txt', { type: 'text/plain' });
    component.selectedFiles = [file];
    component.prompt.set('0123456789valid');

    // success is already default, but ensure explicitly
    httpMock.sendingFileForGenerationData.and.returnValue(of({ ok: true } as any));

    component.submitPrompt();

    // On success, it should clear selected files and set external delete flag
    expect(component.selectedFiles.length).toBe(0);
    expect(component.deleteFilesFromOutside()).toBeTrue();

    // executingPrompt is called: stream activation happens immediately
    expect(serviceMock.setActivateChatClientStreamPrueba).toHaveBeenCalledWith({ prompt: '0123456789valid' } as GenerationDataInterface);

    // Then the deferred UI updates after timeout
    tick(60);
    expect(serviceMock.setResizeInput).toHaveBeenCalledWith(true);
    expect(serviceMock.setIsUploadingAnimation).toHaveBeenCalledWith(true);
  }));

  it('getSavePromptEmitterInDB routes by type to correct service', () => {
    const rest = TestBed.inject(ExecutingRestFulService) as unknown as MockExecutingRestFulService;

    component.getSavePromptEmitterInDB({ typePrompt: 'Prompt imagen', prompt: 'p1', name: 'n1' } as any);
    expect(rest.savePromptImage).toHaveBeenCalled();

    component.getSavePromptEmitterInDB({ typePrompt: 'Prompt datos', prompt: 'p2', name: 'n2' } as any);
    expect(rest.savePromptData).toHaveBeenCalled();

    component.getSavePromptEmitterInDB({ typePrompt: 'Dato sintético', prompt: 'p3', name: 'n3' } as any);
    expect(rest.saveSyntheticData).toHaveBeenCalled();
  });
});
