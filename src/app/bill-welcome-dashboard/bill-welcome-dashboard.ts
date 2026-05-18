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
        image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=150&fit=crop',
        description: 'Interactúa con un agente de IA para generar y gestionar facturas.',
        action: () => {
          this.serviceGeneral.setChangeComponent("bill-agent-data");
        }
      },
      {
        id:2,
        title: 'Imagenes',
        image: 'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=400&h=150&fit=crop',
        description: 'Usa un agente de IA para generar imágenes personalizadas para tus facturas.',
        action: () => {
          this.serviceGeneral.setChangeComponent("show-template");
        }
      },
      {
        id:3,
        title: 'Planilla',
        image: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=150&fit=crop',
        description: 'Visualiza o sube plantillas de facturas en HTML estático.',
        action: () => {
          this.serviceGeneral.setChangeComponent("bill-template");
        }
      },
      {
        id:4,
        title: 'Editor',
        image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=150&fit=crop',
        description: 'Edita el contenido y la estructura de tus plantillas de factura.',
        action: () => {
          this.serviceGeneral.setChangeComponent("bill-template");
        }
      },
      {
        id:5,
        title: 'Constructor',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=150&fit=crop',
        description: 'Integra y construye toda la información necesaria para crear una factura.',
        action: () => {
          this.serviceGeneral.setChangeComponent("bill-constructor");
        }
      },
      {
        id:6,
        title: 'Visualizador',
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=150&fit=crop',
        description: 'Explora y visualiza todas las imágenes generadas por la aplicación.',
        action: () => {
          this.serviceGeneral.setChangeComponent("bill-visualizer");
        }
      }
    ])
  }
}
