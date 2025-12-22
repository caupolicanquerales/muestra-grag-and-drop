import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTemplate } from './dialog-template';

describe('DialogTemplate', () => {
  let component: DialogTemplate;
  let fixture: ComponentFixture<DialogTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
