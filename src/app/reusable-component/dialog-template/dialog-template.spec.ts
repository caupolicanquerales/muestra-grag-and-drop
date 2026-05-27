import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTemplate } from './dialog-template';

describe('DialogTemplate (standalone)', () => {
  let component: DialogTemplate;
  let fixture: ComponentFixture<DialogTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogTemplate]
    }).compileComponents();

    // Avoid rendering PrimeNG dialog; focus on logic
    TestBed.overrideComponent(DialogTemplate, { set: { template: '' } });

    fixture = TestBed.createComponent(DialogTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.visibleInput()).toBeFalse();
    expect(component.promptInput).toEqual([]);
  });

  it('visible input setter toggles signal and emits via action/hide', () => {
    const visibleSpy = spyOn(component.visibleChange, 'emit');

    component.visible = true as any;
    expect(component.visibleInput()).toBeTrue();

    component.onHideModal();
    expect(component.visibleInput()).toBeFalse();
    expect(visibleSpy).toHaveBeenCalledWith(false);
  });

  it('selectedItem setter converts object entries into promptInput array', () => {
    component.selectedItem = { id: 1, name: 'X' } as any;
    expect(Array.isArray(component.promptInput)).toBeTrue();
    expect(component.promptInput.length).toBeGreaterThan(0);

    // undefined should not throw or change
    const prev = component.promptInput;
    (component as any).selectedItem = undefined;
    expect(component.promptInput).toBe(prev);
  });

  it('conditionToShowItem respects displayInfoInSelectedItem list', () => {
    component.displayInfoInSelectedItem = ['id'];
    const item: any[] = ['id', 123];
    const item2: any[] = ['other', 123];
    expect(component.conditionToShowItem(item)).toBeTrue();
    expect(component.conditionToShowItem(item2)).toBeFalse();
  });

  it('actionEvent emits submit and closes the dialog', () => {
    const submitSpy = spyOn(component.submitActionButtonEmitter, 'emit');
    const visibleSpy = spyOn(component.visibleChange, 'emit');
    component.visible = true as any;
    component.actionEvent('action-event');
    expect(submitSpy).toHaveBeenCalledWith('action-event');
    expect(component.visibleInput()).toBeFalse();
    expect(visibleSpy).toHaveBeenCalledWith(false);
  });
});
