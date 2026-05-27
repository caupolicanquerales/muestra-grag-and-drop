import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTemplate } from './editor-template';

describe('EditorTemplate', () => {
  let component: EditorTemplate;
  let fixture: ComponentFixture<EditorTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
