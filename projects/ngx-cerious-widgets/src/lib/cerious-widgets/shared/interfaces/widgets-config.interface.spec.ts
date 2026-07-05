import { Type } from '@angular/core';
import { GridPlugin } from '../../grid/interfaces/grid-plugin';
import { resolveGridConfig, WidgetsConfig } from './widgets-config.interface';

class PluginA implements GridPlugin { onInit(): void {} }
class PluginB implements GridPlugin { onInit(): void {} }

describe('resolveGridConfig', () => {
  it('returns an empty-ish config when nothing is provided', () => {
    const resolved = resolveGridConfig(undefined);
    expect(resolved.plugins).toBeUndefined();
    expect(resolved.lazyPlugins).toEqual({});
    expect(resolved.pluginOptions).toBeUndefined();
  });

  it('reads deprecated top-level keys', () => {
    const config: WidgetsConfig = {
      plugins: [PluginA as Type<GridPlugin>],
      pluginOptions: { ColumnMenu: { enableColumnMenu: true } }
    };
    const resolved = resolveGridConfig(config);
    expect(resolved.plugins).toEqual([PluginA as Type<GridPlugin>]);
    expect(resolved.pluginOptions).toEqual({ ColumnMenu: { enableColumnMenu: true } });
  });

  it('reads the per-component grid block', () => {
    const config: WidgetsConfig = {
      grid: { plugins: [PluginB as Type<GridPlugin>] }
    };
    expect(resolveGridConfig(config).plugins).toEqual([PluginB as Type<GridPlugin>]);
  });

  it('prefers the grid block over the deprecated top-level keys', () => {
    const config: WidgetsConfig = {
      plugins: [PluginA as Type<GridPlugin>],
      pluginOptions: { from: 'top' },
      grid: {
        plugins: [PluginB as Type<GridPlugin>],
        pluginOptions: { from: 'grid' }
      }
    };
    const resolved = resolveGridConfig(config);
    expect(resolved.plugins).toEqual([PluginB as Type<GridPlugin>]);
    expect(resolved.pluginOptions).toEqual({ from: 'grid' });
  });

  it('merges lazyPlugins from both sources', () => {
    const top = () => Promise.resolve(PluginA);
    const inner = () => Promise.resolve(PluginB);
    const config: WidgetsConfig = {
      lazyPlugins: { a: top },
      grid: { lazyPlugins: { b: inner } }
    };
    const resolved = resolveGridConfig(config);
    expect(Object.keys(resolved.lazyPlugins!)).toEqual(['a', 'b']);
  });
});
