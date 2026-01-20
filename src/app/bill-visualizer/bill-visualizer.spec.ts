import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';

import { BillVisualizer } from './bill-visualizer';
import { ServiceGeneral } from '../service/service-general';
import { HttpClientService } from '../service/http-client-service';

class MockServiceGeneral {
  imageIds$ = new Subject<any[]>();
  setImageGenerated = jasmine.createSpy('setImageGenerated');
}

class MockHttpClientService {
  getImageInRedis = jasmine.createSpy('getImageInRedis').and.returnValue(of({ id: 'img-1', image: 'BASE64DATA' }));
}

describe('BillVisualizer (standalone)', () => {
  let component: BillVisualizer;
  let fixture: ComponentFixture<BillVisualizer>;
  let svc: MockServiceGeneral;
  let http: MockHttpClientService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillVisualizer],
      providers: [
        { provide: ServiceGeneral, useClass: MockServiceGeneral },
        { provide: HttpClientService, useClass: MockHttpClientService }
      ]
    }).compileComponents();

    // Avoid rendering PrimeNG and child components
    TestBed.overrideComponent(BillVisualizer, { set: { template: '' } });

    fixture = TestBed.createComponent(BillVisualizer);
    component = fixture.componentInstance;
    svc = TestBed.inject(ServiceGeneral) as unknown as MockServiceGeneral;
    http = TestBed.inject(HttpClientService) as unknown as MockHttpClientService;
    fixture.detectChanges();
  });

  it('should create and init subscriptions', () => {
    expect(component).toBeTruthy();
    expect(svc.setImageGenerated).toHaveBeenCalledWith('');

    // Empty emission does not enable pagination
    svc.imageIds$.next([]);
    expect(component.pagination()).toBeFalse();

    // Non-empty emission updates ids and enables pagination
    const ids = [{ image: 'a.png' }, { image: 'b.png' }];
    svc.imageIds$.next(ids);
    expect(component.imageIds).toEqual(ids as any);
    expect(component.pagination()).toBeTrue();
  });

  it('selectImage loads image and updates signals', () => {
    component.selectImage({ image: 'redis-id-1' });
    expect(http.getImageInRedis).toHaveBeenCalledWith({ id: 'redis-id-1' });
    expect(component.showImage()).toBeTrue();
    expect(component.imageName()).toBe('img-1');
    expect(component.base64String()).toBe('BASE64DATA');
  });

  it('downloadImage requests image and triggers link click', () => {
    const clickSpy = jasmine.createSpy('click');
    const fakeLink = { href: '', download: '', click: clickSpy } as any as HTMLAnchorElement;
    const appendSpy = spyOn(document.body, 'appendChild').and.stub();
    const removeSpy = spyOn(document.body, 'removeChild').and.stub();
    spyOn(document, 'createElement').and.returnValue(fakeLink);

    component.downloadImage({ image: 'redis-id-2' });
    expect(http.getImageInRedis).toHaveBeenCalledWith({ id: 'redis-id-2' });
    expect(fakeLink.href).toContain('data:image/png;base64,BASE64DATA');
    expect(fakeLink.download).toBe('img-1');
    expect(appendSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('ngOnDestroy completes without errors', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});

