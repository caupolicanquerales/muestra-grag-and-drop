import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BillDeletePrompt } from './bill-delete-prompt';
import { ServiceGeneral } from '../service/service-general';
import { ExecutingRestFulService } from '../service/executing-rest-ful-service';
import { TabDeletePromptCategory } from '../utils/tab-configuration-utils';

class MockServiceGeneral {
  promptImages$ = of([{ id: 'i1', name: 'img-1', prompt: 'p' }]);
  promptData$ = of([{ id: 'd1', name: 'data-1', prompt: 'p' }]);
  promptBills$ = of([{ id: 'b1', name: 'bill-1', prompt: 'p' }]);
  promptSystem$ = of([{ id: 's1', name: 'sys-1', prompt: 'p' }]);
  syntheticData$ = of([{ id: 'y1', name: 'syn-1', data: '{}' }]);
  publicityData$ = of([{ id: 'u1', name: 'pub-1', data: '{}' }]);
  setImageGenerated = jasmine.createSpy('setImageGenerated');
}

class MockExecutingRestFulService {
  deletePromptImageById = jasmine.createSpy('deletePromptImageById');
  deletePromptDataById = jasmine.createSpy('deletePromptDataById');
  deletePromptBillById = jasmine.createSpy('deletePromptBillById');
  deletePromptSystemById = jasmine.createSpy('deletePromptSystemById');
  deleteSyntheticDataById = jasmine.createSpy('deleteSyntheticDataById');
  deletePublicityDataById = jasmine.createSpy('deletePublicityDataById');
}

describe('BillDeletePrompt (standalone)', () => {
  let component: BillDeletePrompt;
  let fixture: ComponentFixture<BillDeletePrompt>;
  let execMock: MockExecutingRestFulService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillDeletePrompt],
      providers: [
        { provide: ServiceGeneral, useClass: MockServiceGeneral },
        { provide: ExecutingRestFulService, useClass: MockExecutingRestFulService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BillDeletePrompt);
    component = fixture.componentInstance;
    execMock = TestBed.inject(ExecutingRestFulService) as unknown as MockExecutingRestFulService;
    fixture.detectChanges();
  });

  it('should create and populate tabs', () => {
    expect(component).toBeTruthy();
    // Six categories
    expect(component.tabs.length).toBe(6);
    const types = component.tabs.map(t => t.type);
    expect(types).toContain(TabDeletePromptCategory.IMAGE);
    expect(types).toContain(TabDeletePromptCategory.DATA);
    expect(types).toContain(TabDeletePromptCategory.BILL);
    expect(types).toContain(TabDeletePromptCategory.SYSTEM);
    expect(types).toContain(TabDeletePromptCategory.SYNTHETIC);
    expect(types).toContain(TabDeletePromptCategory.PUBLICITY);
  });

  it('opens dialog on selectItem and sets header/title', () => {
    const item = { id: 'i1', name: 'img-1', prompt: 'p' };
    component.selectItem(item, TabDeletePromptCategory.IMAGE);
    expect(component.visible).toBeTrue();
    expect(component.selectedPrompt).toEqual({ type: TabDeletePromptCategory.IMAGE, prompt: item });
    expect(component.headerDialogTitle).toContain('eliminar');
  });

  it('deletePrompt for image calls proper service and closes dialog', () => {
    const item = { id: 'i1', name: 'img-1', prompt: 'p' };
    component.selectItem(item, TabDeletePromptCategory.IMAGE);
    component.deletePrompt({});
    expect(execMock.deletePromptImageById).toHaveBeenCalledWith({ id: 'i1', prompt: '', name: '' });
    expect(component.visible).toBeFalse();
  });

  it('deletePrompt for synthetic calls proper service and closes dialog', () => {
    const item = { id: 'y1', name: 'syn-1', data: '{}' };
    component.selectItem(item, TabDeletePromptCategory.SYNTHETIC);
    component.deletePrompt({});
    expect(execMock.deleteSyntheticDataById).toHaveBeenCalledWith({ id: 'y1', data: '', name: '' });
    expect(component.visible).toBeFalse();
  });

  it('error handling: unknown type does nothing and closes dialog', () => {
    const item = { id: 'x1', name: 'unknown' };
    component.selectItem(item, 'unknown-type' as any);
    expect(() => component.deletePrompt({})).not.toThrow();
    expect(execMock.deletePromptImageById).not.toHaveBeenCalled();
    expect(execMock.deleteSyntheticDataById).not.toHaveBeenCalled();
    expect(component.visible).toBeFalse();
  });
});
