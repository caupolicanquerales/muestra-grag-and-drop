import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'visualizer-canvas',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './visualizer-canvas.html',
  styleUrl: './visualizer-canvas.scss'
})
export class VisualizerCanvas implements OnInit, OnChanges {

  constructor(private sanitizer: DomSanitizer){}
  
  @Input() 
  base64String: string = '';
  @Input() 
  mimeType: string = 'image/png';
  
  safeImageSource!: SafeResourceUrl;

  ngOnInit(): void {
    this.setImage(this.base64String,this.mimeType);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['base64String']) {
      const currentValue = changes['base64String']?.currentValue;
      const currenExtension= changes['mineType']?.currentValue;
      if (currentValue != '') {
        const extension=currenExtension!=undefined? currenExtension:this.mimeType;
        this.setImage(currentValue,extension);
      }
    }
  }

  private setImage(base64String: string, mimeType: string){
    const imageUri = `data:${mimeType};base64,${base64String}`;
    this.safeImageSource = this.sanitizer.bypassSecurityTrustResourceUrl(imageUri);
  }
}
