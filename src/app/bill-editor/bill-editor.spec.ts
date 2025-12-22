import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillEditor } from './bill-editor';

describe('BillEditor', () => {
  let component: BillEditor;
  let fixture: ComponentFixture<BillEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
