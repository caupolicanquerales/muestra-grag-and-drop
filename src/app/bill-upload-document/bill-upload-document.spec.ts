import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { BillUploadDocument } from './bill-upload-document';
import { HttpClientService } from '../service/http-client-service';
import { ServiceGeneral } from '../service/service-general';

class MockHttpClientService {
  saveFileForGenerationData = jasmine.createSpy('saveFileForGenerationData').and.returnValue(of({}));
}

class MockServiceGeneral {
  setActivateUploadDocumentStream = jasmine.createSpy('setActivateUploadDocumentStream');
  setIsUploadingAnimation = jasmine.createSpy('setIsUploadingAnimation');
}

describe('BillUploadDocument (standalone)', () => {
  let component: BillUploadDocument;
  let fixture: ComponentFixture<BillUploadDocument>;
  let http: MockHttpClientService;
  let svc: MockServiceGeneral;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillUploadDocument],
      providers: [
        { provide: HttpClientService, useClass: MockHttpClientService },
        { provide: ServiceGeneral, useClass: MockServiceGeneral }
      ]
    }).compileComponents();

    // Keep test logic-only, avoid rendering child UploadDocument
    TestBed.overrideComponent(BillUploadDocument, { set: { template: '' } });

    fixture = TestBed.createComponent(BillUploadDocument);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClientService) as unknown as MockHttpClientService;
    svc = TestBed.inject(ServiceGeneral) as unknown as MockServiceGeneral;
    fixture.detectChanges();
  });

  it('should create and activate upload stream on init', () => {
    expect(component).toBeTruthy();
    expect(svc.setActivateUploadDocumentStream).toHaveBeenCalledWith(true);
  });

  it('selectedFileEmitter stores selected file in signal', () => {
    const file = new File(['abc'], 'a.txt', { type: 'text/plain' });
    component.selectedFileEmitter(file);
    expect(component.selectedFileInBill()).toBe(file);
  });

  it('uploadFile: without selected file does nothing', () => {
    const spyExec = spyOn<any>(component, 'executingSaveFile');
    component.selectedFileInBill.set(null);
    component.uploadFile('ignored');
    expect(spyExec).not.toHaveBeenCalled();
  });

  it('uploadFile: with selected file forwards FormData to executingSaveFile', () => {
    const file = new File(['abc'], 'a.txt', { type: 'text/plain' });
    component.selectedFileInBill.set(file);
    const spyExec = spyOn<any>(component, 'executingSaveFile');
    component.uploadFile('ignored');
    expect(spyExec).toHaveBeenCalled();
    const fdArg = spyExec.calls.mostRecent().args[0] as FormData;
    expect(fdArg instanceof FormData).toBeTrue();
  });

  it('executingSaveFile: success disables button and sets uploading animation', () => {
    component['executingSaveFile'](new FormData());
    expect(component.allowButton()).toBeFalse();
    expect(svc.setIsUploadingAnimation).toHaveBeenCalledWith(true);
  });

  it('executingSaveFile: error logs and does not throw', () => {
    http.saveFileForGenerationData.and.returnValue(throwError(() => new Error('fail')));
    const errSpy = spyOn(console, 'error');
    expect(() => component['executingSaveFile'](new FormData())).not.toThrow();
    expect(errSpy).toHaveBeenCalled();
  });
});

