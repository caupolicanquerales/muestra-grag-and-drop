import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { BillConstructor } from './bill-constructor';
import { ServiceGeneral } from '../service/service-general';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { JoyrideService } from 'ngx-joyride';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { ChatButtons } from '../chat-buttons/chat-buttons';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TypePromptEnum } from '../enums/type-prompt-enum';

// Minimal mocks for required services
class MockServiceGeneral {
  basicTemplateData$ = of([]);
  syntheticData$ = of([]);
  publicityData$ = of([]);
  promptSystem$ = of([]);
  basicTemplate$ = of(null);

  setSelectedPromptBill = jasmine.createSpy('setSelectedPromptBill');
  setChangeComponent = jasmine.createSpy('setChangeComponent');
  setBasicTemplate = jasmine.createSpy('setBasicTemplate');
}

class MockExecutingRestFulService {
  getBasicTemplateById = jasmine.createSpy('getBasicTemplateById');
}

class MockJoyrideService {
  startTour = jasmine.createSpy('startTour');
}

describe('BillConstructor (standalone)', () => {
  let component: BillConstructor;
  let fixture: ComponentFixture<BillConstructor>;
  let serviceGeneral: MockServiceGeneral;
  const byId = (id: string) => component.editorRefs.toArray().find(r => r.nativeElement.id === id)!.nativeElement as HTMLDivElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillConstructor],
      providers: [
        { provide: ServiceGeneral, useClass: MockServiceGeneral },
        { provide: ExecutingRestFulService, useClass: MockExecutingRestFulService },
        { provide: JoyrideService, useClass: MockJoyrideService }
      ]
    })
      .compileComponents();

    // Override template to minimal editors and avoid Joyride/complex bindings
    TestBed.overrideComponent(BillConstructor, {
      set: {
        template: `
          <div #editorRef id="0" contenteditable="true"></div>
          <div #editorRef id="1" contenteditable="true"></div>
          <div #editorRef id="2" contenteditable="true"></div>
          <div #editorRef id="3" contenteditable="true"></div>
        `,
        imports: [CommonModule, NgClass, FormsModule, TreeModule, ChatButtons, RadioButtonModule]
      }
    });

    fixture = TestBed.createComponent(BillConstructor);
    component = fixture.componentInstance;
    serviceGeneral = TestBed.inject(ServiceGeneral) as unknown as MockServiceGeneral;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submits form (system without publicity) and sets selected prompt', () => {
    const sysDiv = byId('3');
    const tplDiv = byId('0');
    const dataDiv = byId('1');

    tplDiv.innerHTML = '<div>html-template</div>';
    dataDiv.innerHTML = '{"name":"John"}';
    sysDiv.innerHTML = 'system-rules';

    component.generateImage({});

    expect((serviceGeneral.setSelectedPromptBill as jasmine.Spy).calls.count()).toBe(1);
    const payload = (serviceGeneral.setSelectedPromptBill as jasmine.Spy).calls.mostRecent().args[0] as string;
    const parsed = JSON.parse(payload);
    expect(parsed.contents[0].role).toBe('system');
    expect(parsed.contents[0].parts[0].text).toBe('system-rules');
    expect(parsed.contents[1].role).toBe('user');
    expect(parsed.contents[1].parts[0].text).toContain('HTML:<div>html-template</div>');
    expect(parsed.contents[1].parts[0].text).toContain('JSON:{"name":"John"}');

    expect((serviceGeneral.setChangeComponent as jasmine.Spy)).toHaveBeenCalledWith('show-template');
  });

  it('submits form (with publicity) and includes PUBLICITY DATA', () => {
    component.selectedOption = component.radioButton2;
    component.onRadioChange(null);
    fixture.detectChanges();

    const tplDiv = byId('0');
    const dataDiv = byId('1');
    const pubDiv = byId('2');
    const sysDiv = byId('3');

    expect(tplDiv && dataDiv && pubDiv && sysDiv).toBeTruthy();

    tplDiv.innerHTML = '<div>html-template</div>';
    dataDiv.innerHTML = '{"name":"Ana"}';
    pubDiv.innerHTML = '{"ad":"promo"}';
    sysDiv.innerHTML = 'system-rules';

    component.generateImage({});

    const payload = (serviceGeneral.setSelectedPromptBill as jasmine.Spy).calls.mostRecent().args[0] as string;
    const parsed = JSON.parse(payload);
    expect(parsed.contents[1].parts[0].text).toContain('PUBLICITY DATA:{"ad":"promo"}');
  });

  it('error handling: gracefully handles missing editor content', () => {
    // Only set system prompt; others missing
    const sysDiv = byId('3');
    sysDiv.innerHTML = 'system-only';

    expect(() => component.generateImage({})).not.toThrow();
    const payload = (serviceGeneral.setSelectedPromptBill as jasmine.Spy).calls.mostRecent().args[0] as string;
    const parsed = JSON.parse(payload);
    expect(parsed.contents[1].parts[0].text).toContain('HTML:');
    expect(parsed.contents[1].parts[0].text).toContain('JSON:');
  });

  it('erase button clears editor content', fakeAsync(() => {
    const tplDiv = byId('0');
    tplDiv.innerHTML = '<p>to be erased</p>';

    component.emitEraseText({}, '0');
    tick(); // flush setTimeout in insertStringIntoEditor
    fixture.detectChanges();

    expect(tplDiv.innerHTML).toBe('');
  }));

  it('nodeSelect BASIC_TEMPLATE triggers getBasicTemplateById', () => {
    // Ensure editors signal has an item matching id '0'
    (component as any).editors.set([{ id: '0' } as any]);
    const evt = { node: { data: { type: TypePromptEnum.BASIC_TEMPLATE, data: { id: 'abc' } } } } as any;
    component.nodeSelect(evt, { id: '0' } as any, '0');
    const exec = TestBed.inject(ExecutingRestFulService) as unknown as MockExecutingRestFulService;
    expect(exec.getBasicTemplateById).toHaveBeenCalled();
  });

  it('nodeSelect non-template inserts colored span and adjusts height', fakeAsync(() => {
    (component as any).editors.set([{ id: '0' } as any]);
    const target = byId('0');
    Object.defineProperty(target, 'scrollHeight', { value: 33 });
    const evt = { node: { data: { data: '<p>x</p>' } } } as any;
    component.nodeSelect(evt, { id: '0' } as any, '0');
    tick();
    expect(target.innerHTML).toContain('<span');
    // Height adjusted via adjustHeight async
    tick();
    expect(target.style.height).toBe('33px');
  }));

  it('updatePromptFromContentEditable runs adjustHeight on target', fakeAsync(() => {
    const div = document.createElement('div');
    Object.defineProperty(div, 'scrollHeight', { value: 21 });
    component.updatePromptFromContentEditable({ target: div } as any, '0');
    expect(div.style.height).toBe('auto');
    tick();
    expect(div.style.height).toBe('21px');
  }));

  it('resizeAllTextareas iterates editorRefs and adjusts heights', fakeAsync(() => {
    (['0','1','2','3']).forEach(id => {
      const el = byId(id);
      Object.defineProperty(el, 'scrollHeight', { value: 10 });
    });
    component.resizeAllTextareas();
    tick();
    expect(byId('0').style.height).toBe('10px');
  }));

  it('setEditorBackup caches editors and subsequent call returns parsed backup', () => {
    const first = (component as any).setEditorBackup();
    (component as any).editors.set([{ id: 'x' } as any]);
    const second = (component as any).setEditorBackup();
    expect(Array.isArray(first)).toBeTrue();
    expect(Array.isArray(second)).toBeTrue();
  });

  it('setEditors filters by types and clears editor innerHTML', () => {
    const backup = [
      { id: '0', typePrompt: 'A' },
      { id: '1', typePrompt: 'B' },
    ] as any;
    byId('0').innerHTML = 'X';
    byId('1').innerHTML = 'Y';
    (component as any).setEditors(backup, ['A']);
    expect((component as any).editors().length).toBe(1);
    expect(byId('0').innerHTML).toBe('');
    expect(byId('1').innerHTML).toBe('');
  });

  it('startTour builds steps from editors and calls Joyride', () => {
    // Arrange editors signal to known sequence
    (component as any).editors.set([{ id: '0' } as any, { id: '3' } as any]);
    const joy = TestBed.inject(JoyrideService) as unknown as MockJoyrideService;
    // Act
    component.startTour();
    // Assert
    expect(joy.startTour).toHaveBeenCalled();
    const arg = (joy.startTour as any).calls.mostRecent().args[0];
    expect(arg.steps[0]).toBe('modeStep');
    expect(arg.steps).toContain('treeStep_0');
    expect(arg.steps).toContain('treeStep_3');
  });

  it('extractAllContent maps existing editor ids and skips missing', () => {
    const d0 = byId('0');
    const d3 = byId('3');
    d0.innerHTML = 'A';
    d3.innerHTML = 'B';
    const map = component.extractAllContent(['3', 'X', '0']);
    expect(map.get('3')).toBe('B');
    expect(map.get('0')).toBe('A');
    expect(map.get('X')).toBeUndefined();
  });

  it('onRadioChange filters editors by option (system vs publicity)', () => {
    // Ensure typePrompt fields have been set by ngOnInit streams
    // Default selectedOption is radioButton1 (system)
    component.selectedOption = component.radioButton1;
    (component as any).onRadioChange(null);
    expect((component as any).editors().length).toBe(3);

    // With publicity: expect 4 editors retained
    component.selectedOption = component.radioButton2;
    (component as any).onRadioChange(null);
    expect((component as any).editors().length).toBe(4);
  });
});
