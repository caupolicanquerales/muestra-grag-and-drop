import { bfsSearchNodeToInsertFunctionCommand, getMapOrder, orderChildren, orderOtherPrompts, removeNodeChild, searchNodeToDisableNode } from './bfs-search-node-utils';

describe('bfs-search-node-utils', () => {
  it('getMapOrder returns increasing indices for orderOtherPrompts', () => {
    const order = getMapOrder();
    const list = orderOtherPrompts();
    list.forEach((name, idx) => expect(order[name]).toBe(idx));
  });

  it('orderChildren sorts according to map and pushes unknowns last', () => {
    const map = { B: 0, C: 1 } as any;
    const children = [{ key: 'C' }, { key: 'A' }, { key: 'B' }];
    const sorted = orderChildren(children as any, map);
    expect(sorted.map((c: any) => c.key)).toEqual(['B', 'C', 'A']);
  });

  it('removeNodeChild removes matching key under root children', () => {
    const tree = [{ children: [{ key: 'X' }, { key: 'Y' }] } as any];
    const res = removeNodeChild(tree as any, 'X') as any;
    expect(res[0].children.length).toBe(1);
    expect(res[0].children[0].key).toBe('Y');
  });

  it('searchNodeToDisableNode sets properties on matching children', () => {
    const tree = [{ children: [{ label: 'A' }, { label: 'B' }] } as any];
    const res = searchNodeToDisableNode(tree as any, ['B']) as any;
    const target = res[0].children[1];
    expect(target.style).toEqual({ color: 'red' });
    expect(target.collapsedIcon).toBe('pi pi-ban');
    expect(target.selectable).toBeFalse();
    expect(target.children).toEqual([]);
  });

  it('searchNodeToDisableNode returns empty array when tree is falsy', () => {
    const res = searchNodeToDisableNode(null as any, ['X']);
    expect(res).toEqual([]);
  });

  it('removeNodeChild returns empty array when tree is falsy', () => {
    const res = removeNodeChild(null as any, 'K');
    expect(res).toEqual([]);
  });

  it('bfsSearchNodeToInsertFunctionCommand injects prompts on label match and sets traversal metadata', () => {
    const handler = () => {};
    const prompts = [{ label: 'P1' } as any, { label: 'P2' } as any];
    const root: any = { label: 'root', items: [{ label: 'A', items: [] }, { label: 'B' }] };
    const result = bfsSearchNodeToInsertFunctionCommand(root, handler, prompts, 'A');
    expect(result).toBe(root.items);
    // label match replaces items with prompts
    expect(root.items[0].items).toBe(prompts);
    // command set on visited nodes
    expect(root.command).toBe(handler as any);
    expect(root.items[0].command).toBe(handler as any);
    // parent and grandParent set during traversal for children
    expect(root.items[0].parent).toBe('root');
    expect(root.items[0].grandParent).toBeUndefined();
  });

  it('bfsSearchNodeToInsertFunctionCommand returns [] when root is falsy', () => {
    const res = bfsSearchNodeToInsertFunctionCommand(null as any, () => {}, [], 'X');
    expect(res).toEqual([]);
  });
});
