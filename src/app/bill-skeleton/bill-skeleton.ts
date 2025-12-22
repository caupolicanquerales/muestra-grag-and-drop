import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'bill-skeleton',
  encapsulation: ViewEncapsulation.None,
  imports: [],
  templateUrl: './bill-skeleton.html',
  styleUrl: './bill-skeleton.scss'
})
export class BillSkeleton{

  html: string="";
  css: string= "";

  @Input()
  set htmlString(value: string) {
      if (value !== undefined) {
        this.html=value;
        this.updateView(); 
      }
    }
  
  @Input()
  set scssString(value: string) {
      if (value !== undefined) {
        this.css=value;
        this.updateView(); 
      }
    }

  sanitizedHtml: SafeHtml | undefined; 

  constructor(private sanitizer: DomSanitizer) { }

  private updateView(): void {
    const fullHtml = `<style>${this.css}</style>${this.html}`;
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(fullHtml);
  }
}

