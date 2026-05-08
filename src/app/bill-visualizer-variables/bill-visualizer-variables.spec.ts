import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillVisualizerVariables } from './bill-visualizer-variables';

describe('BillVisualizerVariables', () => {
  let component: BillVisualizerVariables;
  let fixture: ComponentFixture<BillVisualizerVariables>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillVisualizerVariables]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillVisualizerVariables);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
