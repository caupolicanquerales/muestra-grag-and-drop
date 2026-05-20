import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ServiceGeneral } from '../service/service-general';

@Component({
  selector: 'bill-welcome-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './bill-welcome-dashboard.html',
  styleUrl: './bill-welcome-dashboard.scss'
})
export class BillWelcomeDashboard {
  editorCards = signal<Array<any>>([]);

  constructor(private serviceGeneral: ServiceGeneral) {
    this.editorCards.set([
      {
        id:1,
        title: 'Agente',
        image: 'assets/images/card-agente.svg',
        description: 'Interactúa con un agente de IA para generar y gestionar facturas.',
        action: () => {
          this.serviceGeneral.setChangeComponent("bill-agent-data");
        }
      },
      {
        id:2,
        title: 'Imagenes',
        image: 'assets/images/card-imagenes.svg',
        description: 'Usa un agente de IA para generar imágenes personalizadas para tus facturas.',
        action: () => {
          this.serviceGeneral.setChangeComponent("show-template");
        }
      },
      {
        id:3,
        title: 'Planilla',
        image: 'assets/images/card-planilla.svg',
        description: 'Visualiza o sube plantillas de facturas en HTML estático.',
        action: () => {
          this.serviceGeneral.setChangeComponent("bill-template");
        }
      },
      {
        id:4,
        title: 'Editor',
        image: 'assets/images/card-editor.svg',
        description: 'Edita el contenido y la estructura de tus plantillas de factura.',
        action: () => {
          this.serviceGeneral.setChangeComponent("bill-editor");
        }
      },
      {
        id:5,
        title: 'Constructor',
        image: 'assets/images/card-constructor.svg',
        description: 'Integra y construye toda la información necesaria para crear una factura.',
        action: () => {
          this.serviceGeneral.setChangeComponent("bill-constructor");
        }
      },
      {
        id:6,
        title: 'Visualizador',
        image: 'assets/images/card-visualizador.svg',
        description: 'Explora y visualiza todas las imágenes generadas por la aplicación.',
        action: () => {
          this.serviceGeneral.setChangeComponent("bill-visualizer");
        }
      }
    ]);
  }
}
  