import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillWelcomeDashboard } from './bill-welcome-dashboard';

describe('BillWelcomeDashboard', () => {
  let component: BillWelcomeDashboard;
  let fixture: ComponentFixture<BillWelcomeDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillWelcomeDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillWelcomeDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
