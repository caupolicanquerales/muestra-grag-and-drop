import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillVisualizer } from './bill-visualizer';

describe('BillVisualizer', () => {
  let component: BillVisualizer;
  let fixture: ComponentFixture<BillVisualizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillVisualizer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillVisualizer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
