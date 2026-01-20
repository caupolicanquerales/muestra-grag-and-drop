import { removeColorContent, removeTagHtmlToText } from './operation-string-utils';

describe('operation-string-utils', () => {
  describe('removeColorContent', () => {
    it('wraps content in colored bold span and strips styles except margin', () => {
      const html = '<p style="color:blue; margin: 10px; font-size:12px">Hello</p>';
      const result = removeColorContent(html, 'rgb(0, 0, 0)');
      expect(result).toContain('<span style="color: rgb(0, 0, 0) !important; font-weight: bold;">');
      // margin preserved, other styles removed
      expect(result).toContain('style="margin: 10px;"');
      expect(result).not.toContain('color:blue');
      expect(result).not.toContain('font-size');
    });

    it('strips entire style when no margin is present', () => {
      const html = '<p style="color:blue; font-size:12px">Hello</p>';
      const result = removeColorContent(html, '#123456');
      // Wrapper applied
      expect(result).toContain('<span style="color: #123456 !important; font-weight: bold;">');
      // Inner style attribute removed (no margin to preserve)
      expect(result).not.toContain('font-size');
      expect(result).not.toContain('color:blue');
      expect(result).not.toContain('margin:');
    });
  });

  describe('removeTagHtmlToText', () => {
    it('converts common HTML tags to plain text with normalized newlines', () => {
      const html = '<h1>Title</h1><p>Line1<br/>Line2</p><ul><li>A</li><li>B</li></ul>';
      const text = removeTagHtmlToText(html);
      expect(text).toContain('Title');
      expect(text).toContain('Line1');
      expect(text).toContain('Line2');
      expect(text).toContain('A');
      expect(text).toContain('B');
      // No double blank lines or leading/trailing whitespace
      expect(/^\s|\s$/.test(text)).toBeFalse();
    });

    it('returns empty string for falsy input', () => {
      expect(removeTagHtmlToText('')).toBe('');
      expect(removeTagHtmlToText(null as any)).toBe('');
      expect(removeTagHtmlToText(undefined as any)).toBe('');
    });
  });
});
