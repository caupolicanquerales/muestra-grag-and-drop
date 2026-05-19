import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalStepper } from './horizontal-stepper';

describe('HorizontalStepper', () => {
  let component: HorizontalStepper;
  let fixture: ComponentFixture<HorizontalStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalStepper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalStepper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
