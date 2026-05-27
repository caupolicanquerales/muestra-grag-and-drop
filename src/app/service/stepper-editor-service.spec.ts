import { TestBed } from '@angular/core/testing';

import { StepperEditorService } from './stepper-editor-service';

describe('StepperEditorService', () => {
  let service: StepperEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepperEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
