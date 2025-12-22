import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillEditorDefect } from './bill-editor-defect';

describe('BillEditorDefect', () => {
  let component: BillEditorDefect;
  let fixture: ComponentFixture<BillEditorDefect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillEditorDefect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillEditorDefect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
