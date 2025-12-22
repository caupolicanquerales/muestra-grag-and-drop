import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizerCanvas } from './visualizer-canvas';

describe('VisualizerCanvas', () => {
  let component: VisualizerCanvas;
  let fixture: ComponentFixture<VisualizerCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizerCanvas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizerCanvas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
