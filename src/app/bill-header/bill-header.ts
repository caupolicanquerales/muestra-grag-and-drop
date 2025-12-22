import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ServiceGeneral } from '../service/service-general';

@Component({
  selector: 'bill-header',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './bill-header.html',
  styleUrl: './bill-header.scss'
})
export class BillHeader {

  titleApplication: string = $localize`@@titleApplication:`;

  constructor(private serviceGeneral: ServiceGeneral){}

  presentation(){
    this.serviceGeneral.setChangeComponent('show-presentation');
  }
}
