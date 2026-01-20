import { triggerDownloadTheFile, getMapTypeFormatDownloadFile } from './download-file-utils';

describe('download-file-utils', () => {
  beforeEach(() => {
    spyOn(document.body, 'appendChild').and.stub();
    spyOn(document.body, 'removeChild').and.stub();
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
    spyOn(window.URL, 'revokeObjectURL').and.stub();
  });

  it('creates link, clicks it, and revokes object URL', () => {
    const clickSpy = spyOn(HTMLAnchorElement.prototype, 'click').and.callFake(() => {});
    triggerDownloadTheFile('content', 'text/plain', '.txt');
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:url');
  });

  it('getMapTypeFormatDownloadFile returns expected MIME types', () => {
    const map = getMapTypeFormatDownloadFile();
    expect(map.get('.md')).toBe('text/markdown');
    expect(map.get('.json')).toBe('application/json');
    expect(map.get('.txt')).toBe('text/plain');
  });
});
