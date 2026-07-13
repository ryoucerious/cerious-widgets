import { TestBed } from '@angular/core/testing';
import { PluginManagerService } from './plugin-manager.service';
import { GridApi } from '../../grid/interfaces/grid-api';
import { WidgetPlugin } from '../interfaces/widget-plugin.interface';

/** Minimal host API stand-in; the manager only needs an object identity. */
function makeApi(): GridApi {
  return {} as GridApi;
}

function makePlugin(): jasmine.SpyObj<WidgetPlugin<GridApi>> {
  return jasmine.createSpyObj<WidgetPlugin<GridApi>>('WidgetPlugin', ['onInit', 'onDestroy']);
}

describe('PluginManagerService', () => {
  let service: PluginManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PluginManagerService] });
    service = TestBed.inject(PluginManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initPlugins', () => {
    it('calls onInit on each plugin with the api and config', () => {
      const api = makeApi();
      const config = { enabled: true };
      const a = makePlugin();
      const b = makePlugin();

      service.initPlugins(api, [a, b], config);

      expect(a.onInit).toHaveBeenCalledWith(api, config);
      expect(b.onInit).toHaveBeenCalledWith(api, config);
    });

    it('is idempotent: a plugin already active for an api is not re-initialized', () => {
      const api = makeApi();
      const a = makePlugin();

      service.initPlugins(api, [a]);
      service.initPlugins(api, [a]);

      expect(a.onInit).toHaveBeenCalledTimes(1);
    });

    it('returns the full active list for the api', () => {
      const api = makeApi();
      const a = makePlugin();
      const b = makePlugin();

      service.initPlugins(api, [a]);
      const active = service.initPlugins(api, [b]);

      expect(active).toEqual([a, b]);
    });

    it('tracks plugins separately per api', () => {
      const api1 = makeApi();
      const api2 = makeApi();
      const a = makePlugin();

      service.initPlugins(api1, [a]);
      service.destroyPlugins(api2);

      // Destroying api2 must not affect api1's plugin.
      expect(a.onDestroy).not.toHaveBeenCalled();
    });

    it('skips null/undefined entries', () => {
      const api = makeApi();
      const a = makePlugin();

      expect(() => service.initPlugins(api, [undefined as any, a, null as any])).not.toThrow();
      expect(a.onInit).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroyPlugins', () => {
    it('calls onDestroy on every tracked plugin and forgets them', () => {
      const api = makeApi();
      const a = makePlugin();
      const b = makePlugin();
      service.initPlugins(api, [a, b]);

      service.destroyPlugins(api);

      expect(a.onDestroy).toHaveBeenCalledTimes(1);
      expect(b.onDestroy).toHaveBeenCalledTimes(1);

      // After teardown the api has no tracked plugins, so re-init runs onInit again.
      a.onInit.calls.reset();
      service.initPlugins(api, [a]);
      expect(a.onInit).toHaveBeenCalledTimes(1);
    });

    it('is a no-op for an api with no tracked plugins', () => {
      expect(() => service.destroyPlugins(makeApi())).not.toThrow();
    });

    it('continues destroying other plugins when one throws', () => {
      const api = makeApi();
      const bad = makePlugin();
      (bad.onDestroy as jasmine.Spy).and.throwError('boom');
      const good = makePlugin();
      service.initPlugins(api, [bad, good]);

      expect(() => service.destroyPlugins(api)).not.toThrow();
      expect(good.onDestroy).toHaveBeenCalled();
    });
  });

  describe('lazy registry', () => {
    it('logs an error when loading an unknown plugin key', async () => {
      const spy = spyOn(console, 'error');
      await service.loadPlugin('does-not-exist', makeApi());
      // loadPlugin defers initialization to a macrotask.
      await new Promise(resolve => setTimeout(resolve));
      expect(spy).toHaveBeenCalled();
    });

    it('initializes a registered lazy plugin against the api', async () => {
      const api = makeApi();
      const plugin = makePlugin();
      service.registerLazyPlugins(
        { 'custom': () => Promise.resolve(plugin) },
        'my-namespace'
      );

      await service.loadPluginWithArgs('custom', api, [], undefined, 'my-namespace');
      await new Promise(resolve => setTimeout(resolve));

      expect(plugin.onInit).toHaveBeenCalledWith(api, undefined);
    });
  });
});
