import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFooter } from './bill-footer';

describe('BillFooter (standalone)', () => {
  let component: BillFooter;
  let fixture: ComponentFixture<BillFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillFooter]
    }).compileComponents();
  });

  afterEach(() => {
    // Ensure any mocked clock is cleaned up
    if ((jasmine as any).clock().installed) {
      jasmine.clock().uninstall();
    }
  });

  it('should create', () => {
    fixture = TestBed.createComponent(BillFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders the current year from system date', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2025-06-01T00:00:00Z'));

    fixture = TestBed.createComponent(BillFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('2025');

    jasmine.clock().uninstall();
  });

  it('gracefully handles unexpected year values (error handling scenario)', () => {
    fixture = TestBed.createComponent(BillFooter);
    component = fixture.componentInstance;
    // Force an unexpected value
    component.currentYear = Number.NaN as any;
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    // Should not throw; template renders the coerced value ("NaN")
    expect(el.textContent).toContain('NaN');
  });
});
 
