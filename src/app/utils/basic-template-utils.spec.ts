import { composeHtmlCssTemplate, getBasicTemplateInterfaceFromEvent } from './basic-template-utils';

describe('basic-template-utils', () => {
  describe('getBasicTemplateInterfaceFromEvent', () => {
    it('maps id from event and defaults other fields', () => {
      const result = getBasicTemplateInterfaceFromEvent({ id: 'abc123', extra: 'x' });
      expect(result.id).toBe('abc123');
      expect(result.htmlString).toBe('');
      expect(result.cssString).toBe('');
      expect(result.name).toBe('');
    });

    it('returns id null when event undefined', () => {
      const result = getBasicTemplateInterfaceFromEvent(undefined as any);
      expect(result.id).toBeNull();
      expect(result.htmlString).toBe('');
      expect(result.cssString).toBe('');
      expect(result.name).toBe('');
    });
  });

  describe('composeHtmlCssTemplate', () => {
    it('composes style tag with css followed by html', () => {
      const html = '<div>Hello</div>';
      const css = 'div{color:red;}';
      const result = composeHtmlCssTemplate({ htmlString: html, cssString: css });
      expect(result).toBe(`<style>${css}</style>${html}`);
    });

    it('handles missing fields by defaulting to empty strings', () => {
      const result = composeHtmlCssTemplate({});
      expect(result).toBe('<style></style>');
    });

    it('handles null/undefined input safely', () => {
      expect(composeHtmlCssTemplate(null as any)).toBe('<style></style>');
      expect(composeHtmlCssTemplate(undefined as any)).toBe('<style></style>');
    });
  });
});
