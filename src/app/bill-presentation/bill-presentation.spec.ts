import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPresentation } from './bill-presentation';

describe('BillPresentation', () => {
  let component: BillPresentation;
  let fixture: ComponentFixture<BillPresentation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillPresentation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillPresentation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
