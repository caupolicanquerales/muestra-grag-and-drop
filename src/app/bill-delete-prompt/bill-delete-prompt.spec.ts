import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillDeletePrompt } from './bill-delete-prompt';

describe('BillDeletePrompt', () => {
  let component: BillDeletePrompt;
  let fixture: ComponentFixture<BillDeletePrompt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillDeletePrompt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillDeletePrompt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
