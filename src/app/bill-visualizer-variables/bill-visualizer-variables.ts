import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { ChatButtons } from '../chat-buttons/chat-buttons';

@Component({
  selector: 'bill-visualizer-variables',
  standalone: true,
  imports: [CommonModule, ChatButtons],
  templateUrl: './bill-visualizer-variables.html',
  styleUrl: './bill-visualizer-variables.scss'
})
export class BillVisualizerVariables {

  titles:string="Variables de imagenes en la plantilla seleccionada";
  
  @Input()
  variables = signal<Array<any>>([]);
  
  constructor() {
  
  }

  async submitCopyText($event: any, name: string) {
    try {
      await navigator.clipboard.writeText(name);
    } catch (e) {
      console.error("Error, Trying to copy respose.",e);
    }
  }
}
