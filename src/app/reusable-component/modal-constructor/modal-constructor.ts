import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepperService } from '../../service/stepper-service';
import { HorizontalStepper } from '../horizontal-stepper/horizontal-stepper';

@Component({
  selector: 'modal-constructor',
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, RadioButtonModule, FormsModule, HorizontalStepper],
  templateUrl: './modal-constructor.html',
  styleUrl: './modal-constructor.scss'
})
export class ModalConstructor {

  @Input()
  visible: boolean = false;

  @Output()
  optionSelectedEvent = new EventEmitter<number>();

  titleModal: string = "Selecciona tu Flujo de Trabajo";
  informationModal: string = "Esta selección adaptara el proceso de construcción de tu factura.";
  editorCards = signal<Array<any>>([]);
  hasBasicTemplate = signal(false);
  hasSyntheticData = signal(false);
  hasPublicityData = signal(false);

  private _option: number | null = null;

  get option(): number | null {
    return this._option;
  }

  set option(value: number | null) {
    this._option = value;
    this.hasBasicTemplate.set(value === 0 || value === 2);
    this.hasSyntheticData.set(value === 1 || value === 2);
  }

  private readonly stepperService = inject(StepperService);
  stepperConfig = this.stepperService.buildConfig(
    this.hasBasicTemplate,
    this.hasSyntheticData,
    this.hasPublicityData
  );
  
  constructor() {
    this.editorCards.set([
      {
        id:0,
        title: 'Template Básico',
        image: 'assets/images/card-planilla.svg',
        description: 'Selecciona el layout de la factura.',
        action: () => {
        }
      },
      {
        id:1,
        title: 'Dato Sintético',
        image: 'assets/images/card-dato-sintetico.svg',
        description: 'Genera o carga la estructura de datos para rellenar las facturas.',
        action: () => {
        }
      },
      {
        id:2,
        title: 'Template + Dato',
        image: 'assets/images/card-planilla-dato.svg',
        description: 'Combina la definición de datos con el diseño visual de forma simultánea.',
        action: () => {
        }
      }
    ]);
  }

  processClick(): void {
    this.visible = false;
    this.optionSelectedEvent.emit(this.option!);
  }

}
