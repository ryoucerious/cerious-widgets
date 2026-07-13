import { Injectable, Injector } from '@angular/core';
import { PluginConfig } from '../interfaces/plugin-config.interface';
import { WidgetPlugin } from '../interfaces/widget-plugin.interface';

/** Default namespace used by the grid and by the backward-compatible APIs. */
const DEFAULT_NAMESPACE = 'grid';

/**
 * Central registry and lifecycle manager for widget plugins.
 *
 * Every cerious-widgets component routes its plugins through this service so
 * there is a single place that initializes plugins against a host component's
 * API and tears them down again. It supports two complementary styles:
 *
 * - **Instance plugins** (`initPlugins` / `destroyPlugins`): already-constructed
 *   plugin objects (from a component's `plugins` input or `WidgetsConfig`),
 *   tracked per host API so they can be destroyed together.
 * - **Lazy plugins** (`loadPlugin` / `registerPlugins`): loaders keyed by a
 *   string, grouped by component namespace, dynamically imported on demand.
 */
@Injectable({ providedIn: 'root' })
export class PluginManagerService {
  /** Lazy plugin loaders, grouped by component namespace. */
  private lazyPlugins: { [namespace: string]: { [key: string]: () => Promise<any> } } = {
    [DEFAULT_NAMESPACE]: {
      'column-menu': () => import('../../grid/plugins/column-menu.plugin').then(m => m.ColumnMenuPlugin),
      'column-visibility': () => import('../../grid/plugins/column-visibility.plugin').then(m => m.ColumnVisibilityPlugin),
      'export-to-excel': () => import('../../grid/plugins/excel-export.plugin').then(m => m.ExportToExcelPlugin),
      'global-text-filter': () => import('../../grid/plugins/global-text-filter.plugin').then(m => m.GlobalTextFilterPlugin),
      'multi-sort': () => import('../../grid/plugins/multi-sort.plugin').then(m => m.MultiSortPlugin),
      'save-state': () => import('../../grid/plugins/save-state.plugin').then(m => m.SaveGridStatePlugin),
      'server-side': () => import('../../grid/plugins/server-side.plugin').then(m => m.ServerSidePlugin)
    }
  };

  /**
   * Active plugin instances tracked per host API, so a component can tear down
   * everything it initialized in one call regardless of how it was registered.
   */
  private activePlugins = new WeakMap<object, WidgetPlugin<any>[]>();

  constructor(private injector: Injector) {}

  /**
   * Initializes the given plugin instances against a host component API and
   * tracks them for later teardown. This is the single entry point components
   * use to wire up already-constructed plugins.
   *
   * Plugins already tracked for the same API are skipped, so repeated calls are
   * idempotent.
   *
   * @param api - The host component API passed to each plugin's `onInit`.
   * @param plugins - The plugin instances to initialize.
   * @param config - Optional configuration forwarded to each plugin.
   * @returns The full list of plugins now active for the given API.
   */
  initPlugins<TApi extends object>(
    api: TApi,
    plugins: WidgetPlugin<TApi>[],
    config?: PluginConfig
  ): WidgetPlugin<TApi>[] {
    const active = this.activePlugins.get(api) ?? [];
    for (const plugin of plugins) {
      if (!plugin || active.includes(plugin)) {
        continue;
      }
      plugin.onInit(api, config);
      active.push(plugin);
    }
    this.activePlugins.set(api, active);
    return active;
  }

  /**
   * Tears down every plugin previously initialized for the given host API by
   * calling its optional `onDestroy` hook, then forgets them.
   *
   * @param api - The host component API whose plugins should be destroyed.
   */
  destroyPlugins(api: object): void {
    const active = this.activePlugins.get(api);
    if (!active) {
      return;
    }
    for (const plugin of active) {
      try {
        plugin.onDestroy?.();
      } catch (error) {
        console.error('Error destroying plugin:', error);
      }
    }
    this.activePlugins.delete(api);
  }

  /**
   * Registers lazy plugin loaders for a component namespace without loading
   * them. Later components can register their own loaders here.
   *
   * @param plugins - Map of plugin key to a loader returning the plugin class.
   * @param namespace - The component namespace to register under.
   */
  registerLazyPlugins(
    plugins: { [key: string]: () => Promise<any> },
    namespace: string = DEFAULT_NAMESPACE
  ): void {
    this.lazyPlugins[namespace] = { ...(this.lazyPlugins[namespace] ?? {}), ...plugins };
  }

  /**
   * Dynamically loads and initializes a single lazy plugin by key.
   *
   * @param pluginKey - The key identifying the plugin to load.
   * @param hostApi - The host API passed to the plugin for initialization.
   * @param config - Optional configuration object for the plugin.
   * @param namespace - The component namespace to look the key up in.
   */
  async loadPlugin(
    pluginKey: string,
    hostApi: object,
    config?: PluginConfig,
    namespace: string = DEFAULT_NAMESPACE
  ): Promise<void> {
    // Wait a tick so the host API is fully ready before initializing.
    setTimeout(async () => {
      const loader = this.lazyPlugins[namespace]?.[pluginKey];
      if (loader) {
        const PluginClass = await loader();

        // Dynamically create an injector for the plugin.
        const pluginInjector = Injector.create({
          providers: [{ provide: PluginClass, useClass: PluginClass }],
          parent: this.injector
        });

        const pluginInstance: any = pluginInjector.get(PluginClass);
        this.initPlugins(hostApi, [pluginInstance], config);
      } else {
        console.error(`Plugin with key "${pluginKey}" not found.`);
      }
    });
  }

  /**
   * Loads a lazy plugin and initializes it, instantiating it with the provided
   * arguments when the export is a class.
   *
   * @param pluginKey - The key identifying the plugin to load.
   * @param hostApi - The host API passed to the plugin's `onInit`.
   * @param args - Optional constructor arguments when the export is a class.
   * @param config - Optional configuration object for the plugin.
   * @param namespace - The component namespace to look the key up in.
   */
  async loadPluginWithArgs(
    pluginKey: string,
    hostApi: object,
    args: any[] = [],
    config?: PluginConfig,
    namespace: string = DEFAULT_NAMESPACE
  ): Promise<void> {
    // Wait a tick so the host API is fully ready before initializing.
    setTimeout(async () => {
      const loader = this.lazyPlugins[namespace]?.[pluginKey];
      if (!loader) {
        console.error(`Plugin with key "${pluginKey}" not found.`);
        return;
      }

      const pluginExport = await loader();

      // If it's a class (has a constructor), instantiate; otherwise use as-is.
      const isClass = typeof pluginExport === 'function';
      const pluginInstance = isClass ? new pluginExport(...args) : pluginExport;

      this.initPlugins(hostApi, [pluginInstance], config);
    });
  }

  /**
   * Registers a set of lazy plugin loaders for a namespace and then loads and
   * initializes each of them against the provided host API.
   *
   * @param plugins - Map of plugin key to a loader returning the plugin class.
   * @param hostApi - The host API used to initialize the plugins.
   * @param config - Optional configuration object for the plugins.
   * @param namespace - The component namespace to register/load under.
   */
  async registerPlugins(
    plugins: { [key: string]: () => Promise<any> },
    hostApi: object,
    config?: PluginConfig,
    namespace: string = DEFAULT_NAMESPACE
  ): Promise<void> {
    this.registerLazyPlugins(plugins, namespace);

    for (const key of Object.keys(plugins)) {
      await this.loadPluginWithArgs(key, hostApi, [], config, namespace);
    }
  }
}
