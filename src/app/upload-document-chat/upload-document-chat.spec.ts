import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentChat } from './upload-document-chat';

describe('UploadDocumentChat', () => {
  let component: UploadDocumentChat;
  let fixture: ComponentFixture<UploadDocumentChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDocumentChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDocumentChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
