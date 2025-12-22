import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSkeleton } from './bill-skeleton';

describe('BillSkeleton', () => {
  let component: BillSkeleton;
  let fixture: ComponentFixture<BillSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
