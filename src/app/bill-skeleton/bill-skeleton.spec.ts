import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { BillSkeleton } from './bill-skeleton';

describe('BillSkeleton (standalone)', () => {
  let component: BillSkeleton;
  let fixture: ComponentFixture<BillSkeleton>;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillSkeleton]
    }).compileComponents();

    fixture = TestBed.createComponent(BillSkeleton);
    component = fixture.componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates sanitizedHtml when only html is provided', () => {
    const spy = spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callThrough();
    component.htmlString = '<p>Hello</p>';
    expect(spy).toHaveBeenCalledWith('<style></style><p>Hello</p>');
  });

  it('merges css then html in correct order', () => {
    const spy = spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callThrough();
    component.scssString = 'body{color:red}';
    expect(spy.calls.mostRecent().args[0]).toBe('<style>body{color:red}</style>');

    spy.calls.reset();
    component.htmlString = '<p>X</p>';
    expect(spy).toHaveBeenCalledWith('<style>body{color:red}</style><p>X</p>');
  });

  it('renders style and html into the template', () => {
    component.scssString = 'p{font-weight:bold}';
    component.htmlString = '<p>Styled</p>';
    fixture.detectChanges();

    const host: HTMLDivElement = fixture.nativeElement.querySelector('div');
    expect(host).toBeTruthy();
    // style tag should be present inside rendered HTML
    expect(host.querySelector('style')).toBeTruthy();
    expect(host.querySelector('p')?.textContent).toContain('Styled');
  });

  it('ignores undefined inputs without throwing (error handling)', () => {
    const spy = spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callThrough();
    expect(() => ((component as any).htmlString = undefined)).not.toThrow();
    expect(() => ((component as any).scssString = undefined)).not.toThrow();
    expect(spy).not.toHaveBeenCalled();
  });
});

