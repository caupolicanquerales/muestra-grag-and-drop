import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

marked.use({
  gfm: true, 
  breaks: true 
});


@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null): SafeHtml{
    if (!value) {
        return this.sanitizer.bypassSecurityTrustHtml('');
    }
    const htmlContent = marked.parse(value) as string;
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }
}
