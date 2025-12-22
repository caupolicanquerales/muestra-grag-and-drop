import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTemplateBill } from './process-template-bill';

describe('ProcessTemplateBill', () => {
  let component: ProcessTemplateBill;
  let fixture: ComponentFixture<ProcessTemplateBill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessTemplateBill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessTemplateBill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
