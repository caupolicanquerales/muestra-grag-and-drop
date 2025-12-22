import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillHeader } from './bill-header';

describe('BillHeader', () => {
  let component: BillHeader;
  let fixture: ComponentFixture<BillHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
