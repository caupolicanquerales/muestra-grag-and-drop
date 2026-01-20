import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPresentation } from './bill-presentation';

describe('BillPresentation (standalone)', () => {
  let component: BillPresentation;
  let fixture: ComponentFixture<BillPresentation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillPresentation]
    }).compileComponents();

    fixture = TestBed.createComponent(BillPresentation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('binds background color from signal', () => {
    const el: HTMLDivElement = fixture.nativeElement.querySelector('.image-canvas-container');
    expect(el).toBeTruthy();
    // Default value
    expect(getComputedStyle(el).backgroundColor).toBe('rgb(255, 255, 255)');

    // Update signal and verify binding
    component.canvasColor.set('rgb(0, 0, 0)');
    fixture.detectChanges();
    expect(getComputedStyle(el).backgroundColor).toBe('rgb(0, 0, 0)');
  });

  it('returns correct background-image style string', () => {
    expect(component.getBackgroundImageStyle()).toBe("url('assets/images/imagen_de_entrada.png')");
    component.appImageURL = 'assets/images/other.png';
    expect(component.getBackgroundImageStyle()).toBe("url('assets/images/other.png')");
  });

  it('template reflects background-image binding', () => {
    const el: HTMLDivElement = fixture.nativeElement.querySelector('.image-canvas-container');
    // Browser may normalize quotes; check substring presence
    const bgImage = getComputedStyle(el).backgroundImage;
    expect(bgImage).toContain('imagen_de_entrada.png');

    component.appImageURL = 'assets/images/other.png';
    fixture.detectChanges();
    const bgImage2 = getComputedStyle(el).backgroundImage;
    expect(bgImage2).toContain('other.png');
  });

  it('handles empty or null image URL without throwing (error handling)', () => {
    component.appImageURL = '';
    expect(() => component.getBackgroundImageStyle()).not.toThrow();
    expect(component.getBackgroundImageStyle()).toBe("url('')");

    (component as any).appImageURL = null;
    expect(() => component.getBackgroundImageStyle()).not.toThrow();
    expect(component.getBackgroundImageStyle()).toBe("url('null')");
  });
});

