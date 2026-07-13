import { TestBed } from '@angular/core/testing';
import { MultiSortPlugin } from './multi-sort.plugin';
import { SortState } from '../interfaces/sort-state';

describe('MultiSortPlugin applySorting', () => {
  let plugin: MultiSortPlugin;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [MultiSortPlugin] });
    plugin = TestBed.inject(MultiSortPlugin);
  });

  const sortBy = (field: string, direction: 'asc' | 'desc' = 'asc'): SortState[] =>
    [{ column: { field } as any, direction }];
  const sort = (data: any[], state: SortState[]): any[] => (plugin as any).applySorting(data, state);

  it('sorts numeric-strings numerically and case-insensitively', () => {
    const out = sort([{ c: 'item10' }, { c: 'Item2' }, { c: 'item1' }], sortBy('c'));
    expect(out.map(r => r.c)).toEqual(['item1', 'Item2', 'item10']);
  });

  it('sorts numbers numerically, not lexicographically', () => {
    const out = sort([{ n: 10 }, { n: 9 }, { n: 100 }], sortBy('n'));
    expect(out.map(r => r.n)).toEqual([9, 10, 100]);
  });

  it('keeps null/undefined values last in both directions', () => {
    expect(sort([{ n: 30 }, { n: null }, { n: 10 }], sortBy('n', 'asc')).map(r => r.n)).toEqual([10, 30, null]);
    expect(sort([{ n: 30 }, { n: null }, { n: 10 }], sortBy('n', 'desc')).map(r => r.n)).toEqual([30, 10, null]);
  });

  it('sorts Date values chronologically', () => {
    const out = sort(
      [{ d: new Date(2024, 0, 5) }, { d: new Date(2024, 0, 1) }, { d: new Date(2024, 0, 3) }],
      sortBy('d')
    );
    expect(out.map(r => r.d.getDate())).toEqual([1, 3, 5]);
  });

  it('breaks ties with the secondary sort key', () => {
    const data = [{ a: 1, b: 'z' }, { a: 1, b: 'a' }, { a: 0, b: 'm' }];
    const out = sort(data, [
      { column: { field: 'a' } as any, direction: 'asc' },
      { column: { field: 'b' } as any, direction: 'asc' }
    ]);
    expect(out.map(r => `${r.a}${r.b}`)).toEqual(['0m', '1a', '1z']);
  });
});
