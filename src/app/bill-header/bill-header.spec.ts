import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillHeader } from './bill-header';
import { ServiceGeneral } from '../service/service-general';

class MockServiceGeneral {
  setChangeComponent = jasmine.createSpy('setChangeComponent');
}

describe('BillHeader (standalone)', () => {
  let component: BillHeader;
  let fixture: ComponentFixture<BillHeader>;
  let service: MockServiceGeneral;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillHeader],
      providers: [
        { provide: ServiceGeneral, useClass: MockServiceGeneral }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BillHeader);
    component = fixture.componentInstance;
    service = TestBed.inject(ServiceGeneral) as unknown as MockServiceGeneral;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clicking logo triggers presentation and navigates to show-presentation', () => {
    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    const anchor = el.querySelector('a.logo-link') as HTMLAnchorElement;
    expect(anchor).toBeTruthy();

    anchor.click();
    expect(service.setChangeComponent).toHaveBeenCalledWith('show-presentation');
  });

  it('error handling: service throws on navigation', () => {
    (service.setChangeComponent as jasmine.Spy).and.throwError('boom');
    expect(() => component.presentation()).toThrowError('boom');
  });
});
 
