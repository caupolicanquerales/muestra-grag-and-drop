import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { UploadDocument } from './upload-document';
import { ServiceGeneral } from '../service/service-general';

class MockServiceGeneral {
  isUploadingAnimation$ = new Subject<boolean>();
  setIsUploadingAnimation = jasmine.createSpy('setIsUploadingAnimation');
}

function makeFile(name: string, size = 1, type = 'text/plain'): File {
  const blob = new Blob([new Array(size).fill('a').join('')], { type });
  return new File([blob], name, { type });
}

function makeFileList(files: File[]): FileList {
  const list: any = { length: files.length };
  files.forEach((f, i) => (list[i] = f));
  return list as FileList;
}

describe('UploadDocument (standalone)', () => {
  let component: UploadDocument;
  let fixture: ComponentFixture<UploadDocument>;
  let svc: MockServiceGeneral;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDocument],
      providers: [{ provide: ServiceGeneral, useClass: MockServiceGeneral }]
    }).compileComponents();

    // Keep tests logic-only by avoiding PrimeNG rendering
    TestBed.overrideComponent(UploadDocument, { set: { template: '' } });

    fixture = TestBed.createComponent(UploadDocument);
    component = fixture.componentInstance;
    svc = TestBed.inject(ServiceGeneral) as unknown as MockServiceGeneral;
    fixture.detectChanges();
  });

  it('should create and subscribe to uploading animation stream', () => {
    expect(component).toBeTruthy();
    component.selectedFile.set(makeFile('a.txt'));
    svc.isUploadingAnimation$.next(true);
    expect(component['allowUploadFile']()).toBeTrue();
    expect(component.selectedFile()).toBeNull();
  });

  it('uploadFile emits submit event', () => {
    const emitSpy = spyOn(component.submitUploadFileEmitter, 'emit');
    component.uploadFile();
    expect(emitSpy).toHaveBeenCalledWith('upload-file-event');
  });

  it('onFileSelected single file path validates and emits', () => {
    component.formatFiles = '.txt';
    component.ngOnInit();
    const f = makeFile('a.txt', 10);
    const list = makeFileList([f]);
    const evt = { target: { files: list } } as unknown as Event;
    const emitSpy = spyOn(component.selectedFileEmitter, 'emit');
    component.onFileSelected(evt);
    expect(svc.setIsUploadingAnimation).toHaveBeenCalledWith(false);
    expect(component.selectedFile()).toBeTruthy();
    expect(emitSpy).toHaveBeenCalledWith(f);
  });

  it('onDrop multiple files path validates and emits FileList', () => {
    component.formatFiles = '.txt,.pdf';
    component.multipleFiles = true;
    component.ngOnInit();
    const f1 = makeFile('a.txt', 10);
    const f2 = makeFile('b.pdf', 20, 'application/pdf');
    const list = makeFileList([f1, f2]);
    const emitSpy = spyOn(component.selectedMultipleFileEmitter, 'emit');
    component.onDrop({ preventDefault: () => {}, stopPropagation: () => {}, dataTransfer: { files: list } } as any);
    expect(component.selectedFiles.length).toBe(2);
    expect(emitSpy).toHaveBeenCalledWith(list);
  });

  it('onDrop with multiple files where last has invalid extension: does not emit and sets error', () => {
    component.formatFiles = '.txt,.pdf';
    component.multipleFiles = true;
    component.ngOnInit();
    const valid = makeFile('ok.txt', 10);
    const invalid = makeFile('bad.exe', 10, 'application/octet-stream');
    const list = makeFileList([valid, invalid]);
    const emitSpy = spyOn(component.selectedMultipleFileEmitter, 'emit');
    component.onDrop({ preventDefault: () => {}, stopPropagation: () => {}, dataTransfer: { files: list } } as any);
    expect(component.selectedFiles.length).toBe(1);
    expect(component.isError()).toBeTrue();
    expect(component.message()).toBe('Formato no permitido.');
    expect((component as any).allFilesOK).toBeFalse();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('invalid extension sets error and message', () => {
    component.formatFiles = '.pdf';
    component.ngOnInit();
    const f = makeFile('a.txt', 10);
    const list = makeFileList([f]);
    component.onFileSelected({ target: { files: list } } as any);
    expect(component.isError()).toBeTrue();
    expect(component.message()).toBe('Formato no permitido.');
    expect(component.selectedFile()).toBeNull();
  });

  it('oversize file triggers error and clears selection', () => {
    (component as any).MAX_SIZE = 1;
    component.formatFiles = '.txt';
    component.ngOnInit();
    const f = makeFile('big.txt', 10);
    const list = makeFileList([f]);
    component.onFileSelected({ target: { files: list } } as any);
    expect(component.isError()).toBeTrue();
    expect(component.message()).toBe('File size exceeds 5MB limit.');
    expect(component.selectedFile()).toBeNull();
  });

  it('conditionToDisableButton reflects selection and allowButton', () => {
    component.allowButton.set(false);
    component.multipleFiles = false;
    expect(component.conditionToDisableButton()).toBeTrue();

    component.selectedFile.set(makeFile('a.txt'));
    expect(component.conditionToDisableButton()).toBeFalse();

    component.multipleFiles = true;
    component.selectedFiles = [makeFile('a.txt')];
    (component as any).allFilesOK = false;
    expect(component.conditionToDisableButton()).toBeTrue();
    (component as any).allFilesOK = true;
    expect(component.conditionToDisableButton()).toBeFalse();
  });

  it('getFileIcon without argument uses selected file extension', () => {
    component.selectedFile.set(makeFile('a.txt'));
    const icon = component.getFileIcon();
    expect(icon).toBe('pi pi-file');
  });

  it('onDragOver/Leave toggle isDraggingOver and prevent defaults', () => {
    const evt: any = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy() };
    component.onDragOver(evt as any);
    expect(evt.preventDefault).toHaveBeenCalled();
    expect(evt.stopPropagation).toHaveBeenCalled();
    expect(component.isDraggingOver).toBeTrue();
    component.onDragLeave(evt as any);
    expect(component.isDraggingOver).toBeFalse();
  });

  it('clearSelection resets input value when fileInput exists', () => {
    component.fileInput = { nativeElement: { value: 'x' } } as any;
    component.clearSelection();
    expect(component.fileInput.nativeElement.value).toBe('');
  });

  it('conditionSizeSelectedFile and conditionSelectedFile reflect state', () => {
    // No file selected
    expect(component.conditionSizeSelectedFile()).toBeNull();
    expect(component.conditionSelectedFile()).toBeTrue();

    // Single file selected
    const f = makeFile('a.txt', 123);
    component.selectedFile.set(f);
    component.multipleFiles = false;
    expect(component.conditionSizeSelectedFile()).toBe(123);
    expect(component.conditionSelectedFile()).toBeFalse();

    // Multiple files mode
    component.multipleFiles = true;
    component.selectedFiles = [] as any;
    expect(component.conditionSelectedFile()).toBeTrue();
    component.selectedFiles = [f] as any;
    expect(component.conditionSelectedFile()).toBeFalse();
  });

  it('getFileIcon with explicit file argument resolves by extension', () => {
    const icon = component.getFileIcon(makeFile('b.pdf', 10, 'application/pdf'));
    expect(icon).toBe('pi pi-file-pdf');
  });
});
