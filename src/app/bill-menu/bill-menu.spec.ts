import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';

import { BillMenu } from './bill-menu';
import { ServiceGeneral } from '../service/service-general';
import { HttpClientService } from '../service/http-client-service';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { TypePromptEnum } from '../enums/type-prompt-enum';

class MockServiceGeneral {
  private uploading$ = new BehaviorSubject<boolean>(false);
  isUploadingAnimation$ = this.uploading$.asObservable();
  promptImages$ = of([]);
  promptBills$ = of([]);
  promptData$ = of([]);

  setChangeComponent = jasmine.createSpy('setChangeComponent');
  setSelectedPrompt = jasmine.createSpy('setSelectedPrompt');
  setSelectedPromptBill = jasmine.createSpy('setSelectedPromptBill');

  // helper to flip uploading
  setUploading(flag: boolean) { this.uploading$.next(flag); }
}

class MockHttpClientService {
  getMenuConfigFromRepository = jasmine.createSpy('getMenuConfigFromRepository').and.returnValue(of([
    { label: 'Root', items: [] }
  ]));
  getTemplates = jasmine.createSpy('getTemplates').and.returnValue(of({
    ParentA: [{ label: 'Alpha', templateName: 'template-abc' }]
  }));
  getPromptsFromRepository = jasmine.createSpy('getPromptsFromRepository').and.returnValue(of([
    { name: 'PromptFromRepo' }
  ]));
}

class MockExecutingRestFulService {
  getAllPromptImages = jasmine.createSpy('getAllPromptImages');
  getAllPromptBill = jasmine.createSpy('getAllPromptBill');
  getAllPromptData = jasmine.createSpy('getAllPromptData');
  getAllSyntheticData = jasmine.createSpy('getAllSyntheticData');
  getAllBasicTemplate = jasmine.createSpy('getAllBasicTemplate');
  getAllPromptGlobalDefect = jasmine.createSpy('getAllPromptGlobalDefect');
  getAllGlobalDefects = jasmine.createSpy('getAllGlobalDefects');
  getAllPromptSystem = jasmine.createSpy('getAllPromptSystem');
  getAllPublicityData = jasmine.createSpy('getAllPublicityData');
}

describe('BillMenu (standalone)', () => {
  let component: BillMenu;
  let fixture: ComponentFixture<BillMenu>;
  let svc: MockServiceGeneral;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillMenu],
      providers: [
        { provide: ServiceGeneral, useClass: MockServiceGeneral },
        { provide: HttpClientService, useClass: MockHttpClientService },
        { provide: ExecutingRestFulService, useClass: MockExecutingRestFulService }
      ]
    }).compileComponents();

    // Keep logic-only by removing template rendering
    TestBed.overrideComponent(BillMenu, { set: { template: '' } });

    fixture = TestBed.createComponent(BillMenu);
    component = fixture.componentInstance;
    svc = TestBed.inject(ServiceGeneral) as unknown as MockServiceGeneral;
    fixture.detectChanges();
  });

  it('should create and load menu items', () => {
    expect(component).toBeTruthy();
    expect(Array.isArray(component.items)).toBeTrue();
  });

  it('updates isUploading signal when service emits', () => {
    expect(component.isUploading()).toBeFalse();
    svc.setUploading(true);
    expect(component.isUploading()).toBeTrue();
  });

  it('handleMenuClick: changes template when mapping exists', () => {
    // templates provided by Http mock; simulate click under ParentA/Alpha
    (component as any).templates = { ParentA: [{ label: 'Alpha', templateName: 'template-abc' }] };
    const event = { item: { parent: 'ParentA', label: 'Alpha', grandParent: 'mother' } };
    component.handleMenuClick(event);
    expect(svc.setChangeComponent).toHaveBeenCalledWith('template-abc');
  });

  it('changingTemplate does nothing when no template mapping found', () => {
    (component as any).templates = {}; // no mapping
    (svc.setChangeComponent as any).calls.reset();
    const event = { item: { parent: 'NoParent', label: 'NoLabel', grandParent: 'mother' } };
    (component as any).changingTemplate(event);
    expect(svc.setChangeComponent).not.toHaveBeenCalled();
  });

  it('getLabelForTemplate/getParentForTemplate use grandParent branch when present', () => {
    const event = { item: { parent: 'Child', label: 'Alpha', grandParent: 'Grand' } };
    const label = (component as any).getLabelForTemplate(event);
    const parent = (component as any).getParentForTemplate(event);
    expect(label).toBe('Child');
    expect(parent).toBe('Grand');
  });

  it('bfsSearchNodeFromObservable returns early when items empty', () => {
    (component as any).items = [];
    expect(() => (component as any).bfsSearchNodeFromObservable([{ label: 'A' }], TypePromptEnum.DATA_PROMPT)).not.toThrow();
  });

  it('handleMenuClick: selects image prompt and sets bill + selected prompt', () => {
    component.promptsImages = [{ name: 'N1', prompt: 'P1' }];
    const event = { item: { parent: TypePromptEnum.IMAGE_PROMPT, label: 'N1' } };
    component.handleMenuClick(event);
    expect(svc.setSelectedPrompt).toHaveBeenCalledWith('P1');
    expect(svc.setSelectedPromptBill).toHaveBeenCalledWith('P1');
  });

  it('handleMenuClick: data erase action clears selected prompt (error handling path)', () => {
    const event = { item: { parent: 'Datos', label: 'Borrar' } };
    expect(() => component.handleMenuClick(event)).not.toThrow();
    expect(svc.setSelectedPrompt).toHaveBeenCalledWith('');
  });

  it('extracting prompt with missing label returns empty string', () => {
    const res = (component as any).extractingPrompt([{ name: 'A', prompt: 'X' }], 'B');
    expect(res).toBe('');
  });

  it('handlePromptsObservable calls BFS only when menuLoaded=true', () => {
    const spyBfs = spyOn<any>(component, 'bfsSearchNodeFromObservable');
    (component as any).menuLoaded = false;
    (component as any).handlePromptsObservable([{ name: 'n', prompt: 'p' }], 'promptsImages', 'itemPromptImages', TypePromptEnum.IMAGE_PROMPT);
    expect(spyBfs).not.toHaveBeenCalled();

    (component as any).menuLoaded = true;
    (component as any).handlePromptsObservable([{ name: 'n', prompt: 'p' }], 'promptsImages', 'itemPromptImages', TypePromptEnum.IMAGE_PROMPT);
    expect(spyBfs).toHaveBeenCalled();
  });

  it('refreshMenu returns early when menu not yet loaded', () => {
    (component as any).menuLoaded = false;
    // spy to ensure no inner calls attempted
    const spyBfs = spyOn<any>(component, 'bfsSearchNodeFromObservable');
    (component as any).refreshMenu();
    expect(spyBfs).not.toHaveBeenCalled();
  });

  it('refreshMenu invokes BFS for each prompt category when loaded', () => {
    // Prepare prompt items to be injected
    (component as any).itemPromptImages = [{ label: 'ImgP' }];
    (component as any).itemPromptBills = [{ label: 'BillP' }];
    (component as any).itemPromptData = [{ label: 'DataP' }];
    (component as any).menuLoaded = true;

    const spyBfs = spyOn<any>(component, 'bfsSearchNodeFromObservable');
    (component as any).refreshMenu();
    expect(spyBfs.calls.count()).toBe(3);
    expect(spyBfs.calls.argsFor(0)[0]).toEqual([{ label: 'ImgP' }]);
    expect(spyBfs.calls.argsFor(1)[0]).toEqual([{ label: 'BillP' }]);
    expect(spyBfs.calls.argsFor(2)[0]).toEqual([{ label: 'DataP' }]);
  });

  it('conditionToGetTemplate returns true only when parent has non-empty templates', () => {
    (component as any).templates = { ParentA: [{ label: 'A', templateName: 'T' }], Empty: [] };
    expect((component as any).conditionToGetTemplate('ParentA')).toBeTrue();
    expect((component as any).conditionToGetTemplate('Empty')).toBeFalse();
    expect((component as any).conditionToGetTemplate('Missing')).toBeFalse();
  });

  it('getTemplateName returns specific template name or no-template', () => {
    (component as any).templates = { P: [{ label: 'L1', templateName: 'T1' }] };
    expect((component as any).getTemplateName('P', 'L1')).toBe('T1');
    expect((component as any).getTemplateName('P', 'Other')).toBe('no-template');
  });
});

