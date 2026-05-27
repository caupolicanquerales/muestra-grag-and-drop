import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerAnimation } from './spinner-animation';

describe('SpinnerAnimation', () => {
  let component: SpinnerAnimation;
  let fixture: ComponentFixture<SpinnerAnimation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerAnimation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinnerAnimation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
