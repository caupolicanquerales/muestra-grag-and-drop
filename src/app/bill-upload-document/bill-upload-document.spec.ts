import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillUploadDocument } from './bill-upload-document';

describe('BillUploadDocument', () => {
  let component: BillUploadDocument;
  let fixture: ComponentFixture<BillUploadDocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillUploadDocument]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillUploadDocument);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
