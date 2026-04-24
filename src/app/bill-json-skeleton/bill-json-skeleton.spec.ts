import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillJsonSkeleton } from './bill-json-skeleton';

describe('BillJsonSkeleton', () => {
  let component: BillJsonSkeleton;
  let fixture: ComponentFixture<BillJsonSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillJsonSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillJsonSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
