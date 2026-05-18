import { Component, signal } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';
import { ServiceGeneral } from '../service/service-general';

@Component({
  selector: 'app-bill-presentation',
  imports: [],
  templateUrl: './bill-presentation.html',
  styleUrl: './bill-presentation.scss'
})
export class BillPresentation {

  appImageURL: string= "assets/images/imagen_de_entrada.png"
  canvasColor = signal('rgb(255, 255, 255)');

  constructor(private serviceGeneral: ServiceGeneral) {}

  getBackgroundImageStyle(): string {
    return `url('${this.appImageURL}')`; 
  }

  goToWelcomeDashboard(): void {
    this.serviceGeneral.setChangeComponent("bill-welcome-dashboard");
  }
}
