import { getSystemPromptWithPublicity, getSystemPromptWithoutPublicity } from './system-prompt-utils';

describe('system-prompt-utils', () => {
  it('getSystemPromptWithoutPublicity builds correct structure and concatenation', () => {
    const res = getSystemPromptWithoutPublicity('<div/>', '{"a":1}', 'rules');
    expect(res.contents[0].role).toBe('system');
    expect(res.contents[0].parts[0].text).toBe('rules');
    expect(res.contents[1].role).toBe('user');
    expect(res.contents[1].parts[0].text).toBe('HTML:<div/> JSON:{"a":1}');
  });

  it('getSystemPromptWithPublicity includes publicity data', () => {
    const res = getSystemPromptWithPublicity('<x/>', '{"b":2}', '{"ad":true}', 'sys');
    expect(res.contents[1].parts[0].text).toBe('HTML:<x/> JSON:{"b":2} PUBLICITY DATA:{"ad":true}');
  });

  it('supports undefined inputs and preserves literal "undefined"', () => {
    const res = getSystemPromptWithPublicity(undefined, undefined, undefined, undefined);
    expect(res.contents[0].parts[0].text).toBeUndefined();
    expect(res.contents[1].parts[0].text).toContain('HTML:undefined');
  });
});
