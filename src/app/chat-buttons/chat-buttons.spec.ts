import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ChatButtons } from './chat-buttons';
import { TypePromptEnum } from '../enums/type-prompt-enum';
import { FormControl } from '@angular/forms';

describe('ChatButtons (standalone)', () => {
  let component: ChatButtons;
  let fixture: ComponentFixture<ChatButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatButtons]
    }).compileComponents();

    // Keep tests logic-only; avoid rendering PrimeNG UI
    TestBed.overrideComponent(ChatButtons, { set: { template: '' } });

    fixture = TestBed.createComponent(ChatButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('copy/erase/help/generate events emit payloads', () => {
    const copySpy = spyOn(component.submitCopyTextEmitter, 'emit');
    const eraseSpy = spyOn(component.submitEraseTextEmitter, 'emit');
    const helpSpy = spyOn(component.submitHelpTextEmitter, 'emit');
    const genImgSpy = spyOn(component.submitGenerateImage, 'emit');
    const genPromptSpy = spyOn(component.submitGeneratePrompt, 'emit');

    component.copyTextEvent('c');
    component.eraseEvent('e');
    component.helpEvent('h');
    component.generateImageEvent('gi');
    component.generatePromptEvent('gp');

    expect(copySpy).toHaveBeenCalledWith('c');
    expect(eraseSpy).toHaveBeenCalledWith('e');
    expect(helpSpy).toHaveBeenCalledWith('h');
    expect(genImgSpy).toHaveBeenCalledWith('gi');
    expect(genPromptSpy).toHaveBeenCalledWith('gp');
  });

  it('exportInformation emits when item.format is present', () => {
    const expSpy = spyOn(component.submitDownloadFileEmitter, 'emit');
    component.exportInformation({ format: '.md' } as any, new Event('click'));
    expect(expSpy).toHaveBeenCalledWith('.md');

    expSpy.calls.reset();
    component.exportInformation({} as any, new Event('click'));
    expect(expSpy).not.toHaveBeenCalled();
  });

  it('showDialog sets header, validators, and opens dialog (with duplicate name invalid)', fakeAsync(() => {
    component.headerDialog = [
      { format: 'Template básico', headerDialog: 'Guardar Template' }
    ];
    component.arrayPromptAndData = {
      [TypePromptEnum.BASIC_TEMPLATE]: ['duplicated']
    } as any;

    const event = new Event('click');
    spyOn(event, 'stopPropagation');

    component.showDialog({ format: 'Template básico' }, event);

    const ctrl = component.promptNameControl as FormControl;
    expect(ctrl).toBeTruthy();
    expect(component.headerDialogTitle).toBe('Guardar Template');

    ctrl.setValue('duplicated');
    tick();
    expect(ctrl.invalid).toBeTrue();
    expect(ctrl.errors?.['forbiddenName']).toBeTruthy();

    tick();
    expect(component['visible']).toBeTrue();
  }));

  it('emitSavePrompt logs error if input not found', () => {
    spyOn(document, 'getElementById').and.returnValue(null);
    const errSpy = spyOn(console, 'error');
    const emitSpy = spyOn(component.submitSavePromptEmitter, 'emit');
    component['savePromptDb'] = 'Template básico';
    component.emitSavePrompt('save');
    expect(errSpy).toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('emitSavePrompt emits payload and closes dialog when input exists', () => {
    const fakeInput = { value: 'MyName' } as unknown as HTMLInputElement;
    spyOn(document, 'getElementById').and.callFake((id: string) => id === 'promptName' ? fakeInput as any : null);
    const emitSpy = spyOn(component.submitSavePromptEmitter, 'emit');
    component['savePromptDb'] = 'Template básico';
    component.emitSavePrompt('save');
    expect(emitSpy).toHaveBeenCalledWith({ typePrompt: 'Template básico', name: 'MyName' });
    expect(component['visible']).toBeFalse();
  });

  it('getters reflect input flags', () => {
    component.saveButton = false;
    component.exportButton = false;
    component.copyButton = false;
    component.eraseButton = true;
    component.generateImageButton = true;
    component.generatePromptButton = true;
    component.helpButton = true;

    expect(component.saveAllowButton).toBeFalse();
    expect(component.exportAllowButton).toBeFalse();
    expect(component.copyAllowButton).toBeFalse();
    expect(component.eraseAllowButton).toBeTrue();
    expect(component.generateImage).toBeTrue();
    expect(component.generatePrompt).toBeTrue();
    expect(component.helpAllowButton).toBeTrue();
  });

  it('selectItem and toggle are callable (no-ops)', () => {
    expect(() => component.selectItem({})).not.toThrow();
    expect(() => component.toggle(new Event('click'), {})).not.toThrow();
  });

  it('showDialog with unknown format uses SYNTHETIC_DATA fallback for validators', fakeAsync(() => {
    component.headerDialog = [{ format: 'Unknown', headerDialog: 'Header' }];
    component.arrayPromptAndData = {
      [TypePromptEnum.SYNTHETIC_DATA]: ['dup']
    } as any;

    const evt = new Event('click');
    spyOn(evt, 'stopPropagation');
    component.showDialog({ format: 'Unknown' }, evt);

    const ctrl = component.promptNameControl as FormControl;
    ctrl.setValue('dup');
    tick();
    expect(ctrl.errors?.['forbiddenName']).toBeTruthy();
  }));
});
