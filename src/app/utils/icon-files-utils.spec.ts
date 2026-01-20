import { getMapForIconFiles } from './icon-files-utils';

describe('icon-files-utils', () => {
  it('maps common extensions to PrimeIcons classes', () => {
    const map = getMapForIconFiles();
    expect(map.get('.pdf')).toBe('pi pi-file-pdf');
    expect(map.get('.docx')).toBe('pi pi-file-word');
    expect(map.get('.xlsx')).toBe('pi pi-file-excel');
    expect(map.get('.jpg')).toBe('pi pi-image');
    expect(map.get('.txt')).toBe('pi pi-file');
    expect(map.get('')).toBe('pi pi-file');
  });
});
