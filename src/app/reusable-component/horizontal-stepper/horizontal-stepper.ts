import { Component, input, output } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { CommonModule } from '@angular/common';

export interface StepConfig {
  value: number;
  label: string;
  warning?: boolean;
}

@Component({
  selector: 'horizontal-stepper',
  standalone: true,
  imports: [StepperModule, CommonModule],
  templateUrl: './horizontal-stepper.html',
  styleUrl: './horizontal-stepper.scss'
})
export class HorizontalStepper {
  steps = input<StepConfig[]>([]);
  activeStep = input<number>(1);

  stepDoneClick = output<number>();

  isStepDone(stepValue: number): boolean {
    return this.activeStep() > stepValue;
  }

  onDoneStepClick(stepValue: number): void {
    if (this.isStepDone(stepValue)) {
      this.stepDoneClick.emit(stepValue);
    }
  }
}
