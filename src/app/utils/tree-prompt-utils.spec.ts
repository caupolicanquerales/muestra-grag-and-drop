import { buildMainNode, disablePrompts, extractArrayNamePrompt, getMainNode, setChildInTree } from './tree-prompt-utils';
import { TypePromptEnum } from '../enums/type-prompt-enum';

describe('tree-prompt-utils', () => {
  it('buildMainNode and getMainNode construct nodes with children from data', () => {
    const root = buildMainNode('Root', true);
    expect(root.label).toBe('Root');
    expect(root.expanded).toBeTrue();

    const data = [{ name: 'A', prompt: 'p1' }, { name: 'B', data: 'd2' }];
    const main = getMainNode('X', 'TYPE', data as any);
    expect(main.label).toBe('X');
    expect(main.children?.length).toBe(2);
    expect(main.children?.[0].data.type).toBe('TYPE');
    expect(main.children?.[0].data.data).toBe('p1');
    expect(main.children?.[1].data.data).toBe('d2');
  });

  it('setChildInTree replaces/updates a branch and preserves order', () => {
    const initial = [buildMainNode('Prompts') as any];
    const backup = '';
    const type = TypePromptEnum.DATA_PROMPT;
    const arr = [{ name: 'Alpha' }, { name: 'Beta' }];
    const orderMap = { Alpha: 1, Beta: 0 } as any;
    const json = setChildInTree(initial as any, backup, type, arr as any, orderMap) as any;
    const parsed = JSON.parse(json as unknown as string);
    expect(parsed[0].children.length).toBe(1);
    const child = parsed[0].children[0];
    expect(child.label).toBe(type);
    // children of the type node preserve input order (Alpha first)
    expect(child.children[0].label).toBe('Alpha');
  });

  it('disablePrompts disables specific nodes only when tree has full amount', () => {
    const tree: any = [{ children: [
      { label: TypePromptEnum.BILL_PROMPT },
      { label: TypePromptEnum.IMAGE_PROMPT },
      { label: TypePromptEnum.SYSTEM_PROMPT },
      { label: TypePromptEnum.SYNTHETIC_DATA },
      { label: TypePromptEnum.PUBLICITY_DATA },
      { label: TypePromptEnum.DATA_PROMPT },
      { label: TypePromptEnum.GLOBAL_DEFECT_PROMPT },
      { label: TypePromptEnum.BASIC_TEMPLATE },
    ] }];
    const res = disablePrompts(tree as any, 'Prompt dato', 8) as any;
    const sys = res[0].children.find((c: any) => c.label === TypePromptEnum.SYSTEM_PROMPT);
    const pub = res[0].children.find((c: any) => c.label === TypePromptEnum.PUBLICITY_DATA);
    expect(sys.selectable).toBeFalse();
    expect(pub.selectable).toBeFalse();
  });

  it("disablePrompts for 'Prompt sistema' disables data and publicity plus base prompts", () => {
    const tree: any = [{ children: [
      { label: TypePromptEnum.BILL_PROMPT },
      { label: TypePromptEnum.IMAGE_PROMPT },
      { label: TypePromptEnum.SYSTEM_PROMPT },
      { label: TypePromptEnum.SYNTHETIC_DATA },
      { label: TypePromptEnum.PUBLICITY_DATA },
      { label: TypePromptEnum.DATA_PROMPT },
      { label: TypePromptEnum.GLOBAL_DEFECT_PROMPT },
      { label: TypePromptEnum.BASIC_TEMPLATE },
    ] }];
    const res = disablePrompts(tree as any, 'Prompt sistema', 8) as any;
    const data = res[0].children.find((c: any) => c.label === TypePromptEnum.DATA_PROMPT);
    const pub = res[0].children.find((c: any) => c.label === TypePromptEnum.PUBLICITY_DATA);
    expect(data.selectable).toBeFalse();
    expect(pub.selectable).toBeFalse();
  });

  it('extractArrayNamePrompt maps to name field', () => {
    const names = extractArrayNamePrompt([{ name: 'a' } as any, { name: 'b' } as any]);
    expect(names).toEqual(['a', 'b']);
  });

  it('disablePrompts early-returns when children length does not match amount', () => {
    const tree: any = [{ children: [
      { label: TypePromptEnum.BILL_PROMPT },
      { label: TypePromptEnum.IMAGE_PROMPT },
    ] }];
    const res = disablePrompts(tree as any, 'Prompt dato', 8) as any;
    // Should be unchanged; properties like selectable remain undefined
    const sys = res[0].children.find((c: any) => c.label === TypePromptEnum.SYSTEM_PROMPT);
    expect(sys).toBeUndefined();
    expect(res[0].children[0].selectable).toBeUndefined();
  });
});
