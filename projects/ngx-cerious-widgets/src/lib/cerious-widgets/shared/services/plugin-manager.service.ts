import { Injectable, Injector } from '@angular/core';
import { GridApi } from '../../grid/interfaces/grid-api';

@Injectable({ providedIn: 'root' })
export class PluginManagerService {
  private lazyPlugins: { [key: string]: () => Promise<any> } = {
    'column-menu': () => import('../../grid/plugins/column-menu.plugin').then(m => m.ColumnMenuPlugin),
    'column-visibility': () => import('../../grid/plugins/column-visibility.plugin').then(m => m.ColumnVisibilityPlugin),
    'export-to-excel': () => import('../../grid/plugins/excel-export.plugin').then(m => m.ExportToExcelPlugin),
    'global-text-filter': () => import('../../grid/plugins/global-text-filter.plugin').then(m => m.GlobalTextFilterPlugin),
    'multi-sort': () => import('../../grid/plugins/multi-sort.plugin').then(m => m.MultiSortPlugin),
    'save-state': () => import('../../grid/plugins/save-state.plugin').then(m => m.SaveGridStatePlugin),
    'server-side': () => import('../../grid/plugins/server-side.plugin').then(m => m.ServerSidePlugin)
  };

  constructor(private injector: Injector) {}

  /**
   * Dynamically loads and initializes a plugin for the grid.
   *
   * @param pluginKey - The unique key identifying the plugin to load.
   * @param gridApi - The Grid API instance to be passed to the plugin for initialization.
   * @returns A promise that resolves when the plugin is successfully loaded and initialized.
   *
   * @remarks
   * - The method uses a lazy-loading mechanism to load plugins dynamically.
   * - If the plugin is found in the `lazyPlugins` map, it is loaded and an instance is created
   *   using a dynamically created injector.
   * - The plugin instance's `onInit` method is called with the provided `gridApi`.
   * - If the plugin key is not found, an error is logged to the console.
   *
   * @throws Will log an error to the console if the plugin with the specified key is not found.
   */
  async loadPlugin(pluginKey: string, gridApi: GridApi): Promise<void> {
    // Wait for the grid API to be ready
    setTimeout(async () => {
      if (this.lazyPlugins[pluginKey]) {
        const PluginClass = await this.lazyPlugins[pluginKey]();

        // Dynamically create an injector for the plugin
        const pluginInjector = Injector.create({
          providers: [{ provide: PluginClass, useClass: PluginClass }],
          parent: this.injector, // Use the parent injector
        });

        const pluginInstance = pluginInjector.get(PluginClass);
        pluginInstance.onInit(gridApi); // Initialize the plugin with the grid API
      } else {
        console.error(`Plugin with key "${pluginKey}" not found.`);
      }
    });
  }

  /**
   * Loads a plugin dynamically and initializes it with the provided arguments.
   *
   * @param pluginKey - The key identifying the plugin to load. This key is used to
   *                    retrieve the plugin from the `lazyPlugins` map.
   * @param gridApi - The Grid API instance that will be passed to the plugin's `onInit` method.
   * @param args - Optional arguments to pass to the plugin's constructor if it is a class.
   *               Defaults to an empty array.
   * 
   * @returns A promise that resolves once the plugin is loaded and initialized.
   * 
   * @remarks
   * - If the plugin export is a class, it will be instantiated with the provided arguments.
   * - If the plugin export is already an instance, it will be used as-is.
   * - If the plugin has an `onInit` method, it will be called with the `gridApi` as an argument.
   * - The method uses a `setTimeout` to ensure the grid API is ready before initializing the plugin.
   */
  async loadPluginWithArgs(pluginKey: string, gridApi: GridApi, args: any[] = []): Promise<void> {
    // Wait for the grid API to be ready
    setTimeout(async () => {
      const pluginExport = await this.lazyPlugins[pluginKey]();
  
      // If it's a class (has a prototype and constructor), instantiate
      const isClass = typeof pluginExport === 'function';
  
      const pluginInstance = isClass
        ? new pluginExport(...args)
        : pluginExport; // Already an instance
  
      pluginInstance.onInit?.(gridApi);
    });
  }

  /**
   * Registers and initializes plugins for the application.
   *
   * This method accepts a collection of plugins and a `GridApi` instance, 
   * then merges the provided plugins with the existing ones. Each plugin 
   * is subsequently loaded and initialized with the provided `GridApi`.
   *
   * @param plugins - An object where the keys are plugin names and the values 
   *                   are either functions returning a promise resolving to the 
   *                   plugin or the plugin itself.
   * @param gridApi - The `GridApi` instance used to initialize the plugins.
   * @returns A promise that resolves when all plugins have been registered and initialized.
   */
  async registerPlugins(plugins: { [key: string]: () => Promise<any> | any }, gridApi: GridApi): Promise<void> {
    this.lazyPlugins = { ...this.lazyPlugins, ...plugins };

    for (const key in plugins) {
      if (plugins.hasOwnProperty(key)) {
        await this.loadPluginWithArgs(key, gridApi);
      }
    }
  }
}
