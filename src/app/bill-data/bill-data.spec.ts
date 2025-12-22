import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillData } from './bill-data';

describe('BillData', () => {
  let component: BillData;
  let fixture: ComponentFixture<BillData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
