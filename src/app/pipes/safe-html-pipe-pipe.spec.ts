import { TestBed } from '@angular/core/testing';
import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipePipe } from './safe-html-pipe-pipe';

describe('SafeHtmlPipePipe', () => {
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeHtmlPipePipe]
    }).compileComponents();
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('creates an instance with injected sanitizer', () => {
    const pipe = new SafeHtmlPipePipe(sanitizer);
    expect(pipe).toBeTruthy();
  });

  it('transforms markdown into safe HTML', () => {
    const pipe = new SafeHtmlPipePipe(sanitizer);
    const safe = pipe.transform('# Title\n\n**bold**');
    const html = sanitizer.sanitize(SecurityContext.HTML, safe) || '';
    expect(html).toContain('<h1');
    expect(html).toContain('<strong>bold</strong>');
  });

  it('returns empty safe HTML for null/empty input', () => {
    const pipe = new SafeHtmlPipePipe(sanitizer);
    const safeNull = pipe.transform(null);
    const htmlNull = sanitizer.sanitize(SecurityContext.HTML, safeNull) || '';
    expect(htmlNull).toBe('');

    const safeEmpty = pipe.transform('');
    const htmlEmpty = sanitizer.sanitize(SecurityContext.HTML, safeEmpty) || '';
    expect(htmlEmpty).toBe('');
  });
});
