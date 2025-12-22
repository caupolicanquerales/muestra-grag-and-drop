import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFooter } from './bill-footer';

describe('BillFooter', () => {
  let component: BillFooter;
  let fixture: ComponentFixture<BillFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
