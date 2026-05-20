import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConstructor } from './modal-constructor';

describe('ModalConstructor', () => {
  let component: ModalConstructor;
  let fixture: ComponentFixture<ModalConstructor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConstructor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConstructor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
