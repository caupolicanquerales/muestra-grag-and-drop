import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillMenu } from './bill-menu';

describe('BillMenu', () => {
  let component: BillMenu;
  let fixture: ComponentFixture<BillMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
