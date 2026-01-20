import { createNewObjTab, sortedTabs } from './tab-operations-utils';

describe('tab-operations-utils', () => {
  it('createNewObjTab pushes when empty and replaces by type otherwise', () => {
    const tabs: any[] = [];
    const t1 = { type: 'A', v: 1 };
    const res1 = createNewObjTab(tabs, t1, 'A');
    expect(res1.length).toBe(1);
    expect(res1[0]).toEqual(t1);

    const t2 = { type: 'A', v: 2 };
    const out = createNewObjTab(res1, t2, 'A');
    // existing type A present; function returns original without change per logic
    expect(out).toBe(res1);

    const t3 = { type: 'B', v: 3 };
    const out2 = createNewObjTab(res1, t3, 'B');
    expect(out2.length).toBe(2);
    expect(out2.find((x: any) => x.type === 'B')).toEqual(t3);
  });

  it('sortedTabs orders by given map when tabs match expected count', () => {
    const tabs = [{ type: 'C' }, { type: 'A' }, { type: 'B' }];
    const order = { A: 0, B: 1, C: 2 };
    const res = sortedTabs(tabs as any, order, 3);
    expect(res.map(t => t.type)).toEqual(['A', 'B', 'C']);
  });

  it('sortedTabs returns unchanged when count mismatches', () => {
    const tabs = [{ type: 'C' }, { type: 'A' }, { type: 'B' }];
    const order = { A: 0, B: 1, C: 2 };
    const res = sortedTabs([...tabs] as any, order, 99);
    expect(res.map(t => t.type)).toEqual(['C', 'A', 'B']);
  });

  it('sortedTabs places unknown types last according to map rules', () => {
    const tabs = [{ type: 'X' }, { type: 'A' }];
    const order = { A: 0 };
    const res = sortedTabs(tabs as any, order, 2);
    expect(res.map(t => t.type)).toEqual(['A', 'X']);
  });
});
