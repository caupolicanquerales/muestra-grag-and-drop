import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UploadDocumentChat } from './upload-document-chat';

function makeFile(name: string, size = 1, type = 'text/plain'): File {
  const blob = new Blob([new Array(size).fill('a').join('')], { type });
  return new File([blob], name, { type });
}

function makeFileList(files: File[]): FileList {
  const list: any = { length: files.length };
  files.forEach((f, i) => (list[i] = f));
  return list as FileList;
}

describe('UploadDocumentChat (standalone)', () => {
  let component: UploadDocumentChat;
  let fixture: ComponentFixture<UploadDocumentChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDocumentChat]
    }).compileComponents();

    // Keep tests logic-only; avoid template rendering
    TestBed.overrideComponent(UploadDocumentChat, { set: { template: '' } });

    fixture = TestBed.createComponent(UploadDocumentChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize formats from input', () => {
    component.formatFiles = '.txt,.pdf';
    component.ngOnInit();
    // behavior verified via extension acceptance below
    expect(component).toBeTruthy();
  });

  it('drag over/leave toggles isDraggingOver', () => {
    component.onDragOver({ preventDefault: () => {}, stopPropagation: () => {} } as any);
    expect(component.isDraggingOver).toBeTrue();
    component.onDragLeave({ preventDefault: () => {} } as any);
    expect(component.isDraggingOver).toBeFalse();
  });

  it('onDrop accepts allowed extensions and emits incrementally', () => {
    component.formatFiles = '.txt,.pdf';
    component.ngOnInit();
    const f1 = makeFile('a.txt');
    const f2 = makeFile('b.pdf', 10, 'application/pdf');
    const list = makeFileList([f1, f2]);
    const emitSpy = spyOn(component.selectedFilesEmitter, 'emit');

    component.onDrop({ preventDefault: () => {}, dataTransfer: { files: list } } as any);

    expect(component.selectedFiles.length).toBe(2);
    // emitted at least once with the full list by the second push
    const lastArgs = emitSpy.calls.mostRecent().args[0] as Array<File>;
    expect(lastArgs.length).toBe(2);
  });

  it('onDrop ignores disallowed extensions and oversize files', () => {
    component.formatFiles = '.txt';
    component.ngOnInit();
    (component as any).MAX_SIZE = 1; // make most files oversize for test
    const ok = makeFile('a.txt', 1);
    const badExt = makeFile('b.exe');
    const big = makeFile('c.txt', 10);
    const list = makeFileList([badExt, big, ok]);
    const emitSpy = spyOn(component.selectedFilesEmitter, 'emit');

    component.onDrop({ preventDefault: () => {}, dataTransfer: { files: list } } as any);

    expect(component.selectedFiles.length).toBe(1);
    expect(component.selectedFiles[0].name).toBe('a.txt');
    const lastArgs = emitSpy.calls.mostRecent().args[0] as Array<File>;
    expect(lastArgs.length).toBe(1);
  });

  it('deleteFiles input clears selection and emits empty array', fakeAsync(() => {
    component.selectedFiles = [makeFile('a.txt')];
    const emitSpy = spyOn(component.selectedFilesEmitter, 'emit');
    (component as any).deleteFiles = true; // trigger setter
    tick();
    expect(component.selectedFiles.length).toBe(0);
    expect(emitSpy).toHaveBeenCalledWith([]);
  }));

  it('getFileIcon returns expected class for .txt', () => {
    const icon = component.getFileIcon(makeFile('a.txt'));
    expect(icon).toBe('pi pi-file');
  });

  it('getFileIcon without argument returns default icon mapping', () => {
    // When no file provided, extension is '', which maps to default icon
    const icon = component.getFileIcon();
    expect(icon).toBe('pi pi-file');
  });

  it('trackByFn returns file name', () => {
    const f = makeFile('a.txt');
    expect(component.trackByFn(0 as any, f)).toBe('a.txt');
  });
});
