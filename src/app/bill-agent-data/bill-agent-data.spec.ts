import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillAgentData } from './bill-agent-data';

describe('BillAgentData', () => {
  let component: BillAgentData;
  let fixture: ComponentFixture<BillAgentData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillAgentData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillAgentData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
