import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { RadioButtonModule } from 'primeng/radiobutton';
import { of } from 'rxjs';

import { BillEditor } from './bill-editor';
import { ServiceGeneral } from '../service/service-general';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { TypePromptEnum } from '../enums/type-prompt-enum';
import * as downloadUtils from '../utils/download-file-utils';

// Stub ChatButtons to keep the template light and avoid heavy dependencies
@Component({
  selector: 'chat-buttons',
  standalone: true,
  template: ''
})
class FakeChatButtons {
  @Input() itemsExportPrompt: any[] = [];
  @Input() itemsSavePrompt: any[] = [];
  @Input() headerDialog: any[] = [];
  @Input() eraseButton = false;
  @Input() generateImageButton = false;
  @Input() generatePromptButton = false;
  @Input() arrayPromptAndData: any = {};
  @Output() submitDownloadFileEmitter = new EventEmitter<string>();
  @Output() submitCopyTextEmitter = new EventEmitter<string>();
  @Output() submitSavePromptEmitter = new EventEmitter<any>();
  @Output() submitEraseTextEmitter = new EventEmitter<string>();
  @Output() submitGenerateImage = new EventEmitter<string>();
  @Output() submitGeneratePrompt = new EventEmitter<string>();
}

class MockServiceGeneral {
  setSelectedPromptBill = jasmine.createSpy('setSelectedPromptBill');
  setSelectedPrompt = jasmine.createSpy('setSelectedPrompt');
  setChangeComponent = jasmine.createSpy('setChangeComponent');
  setImageGenerated = jasmine.createSpy('setImageGenerated');
  promptImages$ = of([]);
  promptBills$ = of([]);
  promptData$ = of([]);
  syntheticData$ = of([]);
  publicityData$ = of([]);
  promptGlobalDefect$ = of([]);
  promptSystem$ = of([]);
  basicTemplateData$ = of([]);
  basicTemplate$ = of(null);
  setBasicTemplate = jasmine.createSpy('setBasicTemplate');
}

class MockExecutingRestFulService {
  savePromptBill = jasmine.createSpy('savePromptBill');
  savePromptImage = jasmine.createSpy('savePromptImage');
  savePromptData = jasmine.createSpy('savePromptData');
  saveSyntheticData = jasmine.createSpy('saveSyntheticData');
  savePublicityData = jasmine.createSpy('savePublicityData');
  savePromptSystem = jasmine.createSpy('savePromptSystem');
  getBasicTemplateById = jasmine.createSpy('getBasicTemplateById');
}

describe('BillEditor (standalone)', () => {
  let component: BillEditor;
  let fixture: ComponentFixture<BillEditor>;
  let serviceMock: MockServiceGeneral;
  let execMock: MockExecutingRestFulService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillEditor],
      providers: [
        { provide: ServiceGeneral, useClass: MockServiceGeneral },
        { provide: ExecutingRestFulService, useClass: MockExecutingRestFulService }
      ]
    }).compileComponents();

    // Replace ChatButtons with stub to avoid its internals
    TestBed.overrideComponent(BillEditor, {
      set: { imports: [CommonModule, NgClass, FormsModule, TreeModule, RadioButtonModule, FakeChatButtons] }
    });

    fixture = TestBed.createComponent(BillEditor);
    component = fixture.componentInstance;
    serviceMock = TestBed.inject(ServiceGeneral) as unknown as MockServiceGeneral;
    execMock = TestBed.inject(ExecutingRestFulService) as unknown as MockExecutingRestFulService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('generateImage submits content and navigates to show-template', () => {
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    const editorDiv = el.querySelector('#prompt-editor') as HTMLDivElement;
    editorDiv.innerHTML = '  some content  ';

    component.generateImage({});

    expect(serviceMock.setSelectedPromptBill).toHaveBeenCalledWith('some content');
    expect(serviceMock.setChangeComponent).toHaveBeenCalledWith('show-template');
  });

  it('generatePrompt submits content and navigates to generate-data', () => {
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    const editorDiv = el.querySelector('#prompt-editor') as HTMLDivElement;
    editorDiv.innerHTML = 'prompt text';

    component.generatePrompt({});

    expect(serviceMock.setSelectedPrompt).toHaveBeenCalledWith('prompt text');
    expect(serviceMock.setChangeComponent).toHaveBeenCalledWith('generate-data');
  });

  it('emitSavePrompt with known types dispatches to services', () => {
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    const editorDiv = el.querySelector('#prompt-editor') as HTMLDivElement;
    editorDiv.innerHTML = '<p>saved</p>';

    component.emitSavePrompt({ typePrompt: TypePromptEnum.IMAGE_PROMPT, name: 'n' });
    expect(execMock.savePromptImage).toHaveBeenCalled();

    component.emitSavePrompt({ typePrompt: TypePromptEnum.DATA_PROMPT, name: 'n' });
    expect(execMock.savePromptData).toHaveBeenCalled();

    component.emitSavePrompt({ typePrompt: TypePromptEnum.SYNTHETIC_DATA, name: 'n' });
    expect(execMock.saveSyntheticData).toHaveBeenCalled();

    component.emitSavePrompt({ typePrompt: TypePromptEnum.BILL_PROMPT, name: 'n' });
    expect(execMock.savePromptBill).toHaveBeenCalled();

    component.emitSavePrompt({ typePrompt: TypePromptEnum.PUBLICITY_DATA, name: 'n' });
    expect(execMock.savePublicityData).toHaveBeenCalled();

    component.emitSavePrompt({ typePrompt: TypePromptEnum.SYSTEM_PROMPT, name: 'n' });
    expect(execMock.savePromptSystem).toHaveBeenCalled();
  });

  it('error handling: emitSavePrompt with unknown type does nothing', () => {
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    const editorDiv = el.querySelector('#prompt-editor') as HTMLDivElement;
    editorDiv.innerHTML = 'text';

    expect(() => component.emitSavePrompt({ typePrompt: 'unknown', name: 'x' })).not.toThrow();
    expect(execMock.savePromptImage).not.toHaveBeenCalled();
    expect(execMock.savePromptData).not.toHaveBeenCalled();
    expect(execMock.saveSyntheticData).not.toHaveBeenCalled();
  });

  it('nodeSelect with BASIC_TEMPLATE calls getBasicTemplateById', () => {
    component.selectedNode = { data: { type: TypePromptEnum.BASIC_TEMPLATE } } as any;
    const evt = { node: { data: { data: { id: 't1' } } } };
    component.nodeSelect(evt as any);
    expect(execMock.getBasicTemplateById).toHaveBeenCalled();
  });

  it('nodeSelect with non-template calls setColorText with mapped color', () => {
    component.selectedNode = { data: { type: TypePromptEnum.BILL_PROMPT, data: {} } } as any;
    const spy = spyOn<any>(component, 'setColorText');
    component.nodeSelect({} as any);
    expect(spy).toHaveBeenCalled();
  });

  it('onRadioChange toggles options for Otros Prompt', () => {
    component.selectedOption = 'Otros Prompt';
    (component as any).backUpTree = JSON.stringify([{ children: [] }]);
    component.onRadioChange({} as any);
    expect(component.generateImageButton).toBeTrue();
    expect(component.generatePromptButton).toBeTrue();
  });

  it('onRadioChange toggles options for Prompt sistema', () => {
    component.selectedOption = 'Prompt sistema';
    (component as any).backUpTree = JSON.stringify([{ children: [] }]);
    component.onRadioChange({} as any);
    expect(component.generateImageButton).toBeFalse();
    expect(component.generatePromptButton).toBeFalse();
  });

  it('onRadioChange toggles options for Prompt dato', () => {
    component.selectedOption = 'Prompt dato';
    (component as any).backUpTree = JSON.stringify([{ children: [] }]);
    component.onRadioChange({} as any);
    expect(component.generateImageButton).toBeFalse();
    expect(component.generatePromptButton).toBeTrue();
  });

  it('exportInformation ignores falsy event and just triggers change detection', () => {
    const cdSpy = spyOn((component as any).cd, 'detectChanges');
    expect(() => component.exportInformation('')).not.toThrow();
    expect(cdSpy).toHaveBeenCalled();
  });

  it('generatePrompt handles missing #prompt-editor element gracefully', () => {
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    const editorDiv = el.querySelector('#prompt-editor') as HTMLDivElement;
    editorDiv.remove();
    component.generatePrompt({});
    expect(serviceMock.setSelectedPrompt).toHaveBeenCalledWith('');
  });

  it('resizeTextarea sets height when textarea exists', () => {
    const ta = document.createElement('textarea');
    ta.id = 'prompt-input';
    document.body.appendChild(ta);
    Object.defineProperty(ta, 'scrollHeight', { value: 50 });
    component.resizeTextarea();
    expect(ta.style.height).toBe('50px');
    document.body.removeChild(ta);
  });

  it('resizeTextarea does nothing when textarea is missing', () => {
    // Ensure element is not present
    const existing = document.getElementById('prompt-input');
    if (existing) existing.remove();
    expect(() => component.resizeTextarea()).not.toThrow();
  });

  it('exportInformation with value triggers download and change detection', () => {
    const dlSpy = spyOn<any>(component, 'downloadFile');
    const cdSpy = spyOn((component as any).cd, 'detectChanges');
    component.exportInformation('txt');
    expect(dlSpy).toHaveBeenCalledWith('txt');
    expect(cdSpy).toHaveBeenCalled();
  });

  it('submitCopyText logs error if clipboard write fails', async () => {
    const errSpy = spyOn(console, 'error');
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('no clipboard')) },
      configurable: true
    });
    await component.submitCopyText('');
    expect(errSpy).toHaveBeenCalled();
  });

  it('setBasicTemplateToEditor applies template only when data has css and html', () => {
    const stSpy = spyOn<any>(component, 'setTimeout');
    (component as any).setBasicTemplateToEditor({});
    expect(stSpy).not.toHaveBeenCalled();
    (component as any).setBasicTemplateToEditor({ cssString: 'c', htmlString: 'h' });
    expect(stSpy).toHaveBeenCalled();
  });

  it('nodeSelect without mapped color does not call setColorText', () => {
    component.selectedNode = { data: { type: 'UNKNOWN', data: {} } } as any;
    const spy = spyOn<any>(component, 'setColorText');
    component.nodeSelect({} as any);
    expect(spy).not.toHaveBeenCalled();
  });

  it('updatePromptFromContentEditable updates prompt signal', () => {
    const div = document.createElement('div');
    div.innerText = 'Hello World';
    component.updatePromptFromContentEditable({ target: div } as any);
    expect(component.prompt()).toBe('Hello World');
  });

  it('emitEraseText clears editor content and prompt', () => {
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    const editorDiv = el.querySelector('#prompt-editor') as HTMLDivElement;
    editorDiv.innerHTML = 'SOME';
    component.emitEraseText({});
    expect(editorDiv.innerHTML).toBe('');
    expect(component.prompt()).toBe('');
  });

  it('setColorText appends colored span and resizes textarea', (done) => {
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    const editorDiv = el.querySelector('#prompt-editor') as HTMLDivElement;
    // Ensure textarea exists for resize path
    const ta = document.createElement('textarea');
    ta.id = 'prompt-input';
    Object.defineProperty(ta, 'scrollHeight', { value: 42 });
    document.body.appendChild(ta);

    component.setColorText({ data: '<p>hello</p>' } as any, 'rgb(0, 0, 0)');
    setTimeout(() => {
      expect(editorDiv.innerHTML).toContain('<span');
      expect(ta.style.height).toBe('42px');
      document.body.removeChild(ta);
      done();
    }, 0);
  });

  it('downloadFile creates anchor and clicks with text/plain for .txt', () => {
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    const editorDiv = el.querySelector('#prompt-editor') as HTMLDivElement;
    editorDiv.innerHTML = 'DOWN';

    const origCreateURL = window.URL.createObjectURL;
    const origRevokeURL = window.URL.revokeObjectURL;
    const origCreateEl = document.createElement;
    let clickCount = 0;
    let appended: any = null;

    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:test');
    spyOn(window.URL, 'revokeObjectURL').and.callThrough();
    spyOn(document.body as any, 'appendChild').and.callFake((node: any) => {
      appended = node;
      return node;
    });
    spyOn(document.body as any, 'removeChild').and.callFake((_node: any) => {});
    spyOn(document as any, 'createElement').and.callFake((tag: string) => {
      const el = origCreateEl.call(document, tag) as any;
      if (tag === 'a') {
        el.click = () => { clickCount++; };
      }
      return el;
    });

    (component as any).downloadFile('.txt');
    expect(clickCount).toBe(1);
    expect(appended).toBeTruthy();
    expect((appended as HTMLAnchorElement).download.endsWith('.txt')).toBeTrue();
    expect((appended as HTMLAnchorElement).href).toBe('blob:test');

    // restore (implicitly handled after test by spies)
    window.URL.createObjectURL = origCreateURL;
    window.URL.revokeObjectURL = origRevokeURL;
  });
});
