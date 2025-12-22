import { Component } from '@angular/core';

@Component({
  selector: 'bill-footer',
  standalone: true,
  imports: [],
  templateUrl: './bill-footer.html',
  styleUrl: './bill-footer.scss'
})
export class BillFooter {

  currentYear: number = new Date().getFullYear();
}
