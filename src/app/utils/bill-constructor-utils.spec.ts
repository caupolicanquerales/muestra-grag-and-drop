import { TypePromptEnum } from '../enums/type-prompt-enum';
import { getEditors, orderSystem, orderSystemWithPublicity, titlesHelp, textHelp, systemPromptHelp } from './bill-constructor-utils';

describe('bill-constructor-utils', () => {
  it('getEditors returns four editors with ids 0..3', () => {
    const editors = getEditors();
    expect(editors.length).toBe(4);
    expect(editors.map(e => e.id)).toEqual(['0', '1', '2', '3']);
    editors.forEach(e => {
      expect(e.tree).toEqual([]);
      expect(e.styledPrompt).toBe('');
      expect(e.typePrompt).toBe('');
    });
  });

  it('orderSystem includes BASIC_TEMPLATE, SYNTHETIC_DATA, SYSTEM_PROMPT in order', () => {
    const arr = orderSystem();
    expect(arr).toEqual([TypePromptEnum.BASIC_TEMPLATE, TypePromptEnum.SYNTHETIC_DATA, TypePromptEnum.SYSTEM_PROMPT]);
  });

  it('orderSystemWithPublicity includes PUBLICITY_DATA before SYSTEM_PROMPT', () => {
    const arr = orderSystemWithPublicity();
    expect(arr).toEqual([TypePromptEnum.BASIC_TEMPLATE, TypePromptEnum.SYNTHETIC_DATA, TypePromptEnum.PUBLICITY_DATA, TypePromptEnum.SYSTEM_PROMPT]);
  });

  it('titlesHelp/textHelp/systemPromptHelp expose expected keys', () => {
    const titles = titlesHelp();
    const texts = textHelp();
    const sys = systemPromptHelp();
    expect(Object.keys(titles).length).toBe(4);
    expect(Object.keys(titles)).toEqual(jasmine.arrayContaining(['01', '11', '21', '31']));
    expect(Object.keys(texts).length).toBe(4);
    expect(Object.keys(texts)).toEqual(jasmine.arrayContaining(['01', '11', '21', '31']));
    expect(sys.title).toBeTruthy();
    expect(sys.text).toBeTruthy();
  });
});
