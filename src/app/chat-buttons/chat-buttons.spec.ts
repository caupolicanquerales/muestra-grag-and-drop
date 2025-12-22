import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatButtons } from './chat-buttons';

describe('ChatButtons', () => {
  let component: ChatButtons;
  let fixture: ComponentFixture<ChatButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatButtons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
