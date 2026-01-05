import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillConstructor } from './bill-constructor';

describe('BillConstructor', () => {
  let component: BillConstructor;
  let fixture: ComponentFixture<BillConstructor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillConstructor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillConstructor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
