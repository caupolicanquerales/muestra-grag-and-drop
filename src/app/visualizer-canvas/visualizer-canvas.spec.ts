import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';

import { VisualizerCanvas } from './visualizer-canvas';

describe('VisualizerCanvas (standalone)', () => {
  let component: VisualizerCanvas;
  let fixture: ComponentFixture<VisualizerCanvas>;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizerCanvas]
    }).compileComponents();

    // Keep tests logic-only; avoid template rendering
    TestBed.overrideComponent(VisualizerCanvas, { set: { template: '' } });

    fixture = TestBed.createComponent(VisualizerCanvas);
    component = fixture.componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);
    fixture.detectChanges();
  });

  it('should create and set initial safe URL on init', () => {
    const spy = spyOn(sanitizer, 'bypassSecurityTrustResourceUrl').and.callThrough();
    component.base64String = 'QUJD'; // 'ABC'
    component.mimeType = 'image/png';
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith('data:image/png;base64,QUJD');
    expect(component.safeImageSource).toBeTruthy();
  });

  it('ngOnChanges updates image when base64String changes (uses current mimeType)', () => {
    const spy = spyOn(sanitizer, 'bypassSecurityTrustResourceUrl').and.callThrough();
    component.mimeType = 'image/jpeg';
    const changes = {
      base64String: new SimpleChange('old', 'R0hJ', false) // 'GHI'
    } as any;
    component.ngOnChanges(changes);
    expect(spy).toHaveBeenCalledWith('data:image/jpeg;base64,R0hJ');
  });

  it('ngOnChanges does nothing for empty base64String', () => {
    const spy = spyOn(sanitizer, 'bypassSecurityTrustResourceUrl').and.callThrough();
    const changes = {
      base64String: new SimpleChange('something', '', false)
    } as any;
    component.ngOnChanges(changes);
    expect(spy).not.toHaveBeenCalled();
  });

  it('changing only mimeType does not update image (watched base64String only)', () => {
    const spy = spyOn(sanitizer, 'bypassSecurityTrustResourceUrl').and.callThrough();
    const changes = {
      mimeType: new SimpleChange('image/png', 'image/gif', false)
    } as any;
    component.ngOnChanges(changes);
    expect(spy).not.toHaveBeenCalled();
  });
});
