import { TestBed } from '@angular/core/testing';
import { GlobalTextFilterPlugin } from './global-text-filter.plugin';

describe('GlobalTextFilterPlugin applyFilter', () => {
  let plugin: GlobalTextFilterPlugin;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [GlobalTextFilterPlugin] });
    plugin = TestBed.inject(GlobalTextFilterPlugin);
    // Minimal GridApi stub — applyFilter only needs the visible column defs.
    (plugin as any).gridApi = {
      getFlattenedColumnDefs: () => [{ field: 'name', visible: true }, { field: 'city', visible: true }]
    };
  });

  const run = (data: any[], value: string) =>
    (plugin as any).applyFilter(data, { name: { value, type: 'contains' }, city: { value, type: 'contains' } });

  it('does not crash on rows with null/undefined cells', () => {
    const data = [{ name: 'Ada', city: 'London' }, { name: null, city: undefined }, { name: 'Grace', city: 'NYC' }];
    expect(() => run(data, 'lon')).not.toThrow();
    expect(run(data, 'lon').map((r: any) => r.name)).toEqual(['Ada']);
  });

  it('matches case-insensitively across visible columns', () => {
    const data = [{ name: 'Ada', city: 'London' }, { name: 'Grace', city: 'NYC' }];
    expect(run(data, 'GRACE').map((r: any) => r.name)).toEqual(['Grace']);
  });

  it('returns all rows for an empty filter state (search box cleared)', () => {
    const data = [{ name: 'Ada', city: 'London' }, { name: 'Grace', city: 'NYC' }];
    expect((plugin as any).applyFilter(data, {}).length).toBe(2);
  });
});
