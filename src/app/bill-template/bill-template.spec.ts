import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillTemplate } from './bill-template';

describe('BillTemplate', () => {
  let component: BillTemplate;
  let fixture: ComponentFixture<BillTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
