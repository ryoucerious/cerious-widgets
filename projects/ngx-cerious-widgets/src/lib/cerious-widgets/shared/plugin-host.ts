import {
  afterNextRender,
  DestroyRef,
  inject,
  Injector,
  runInInjectionContext
} from '@angular/core';
import { WIDGETS_CONFIG } from './tokens/widgets-config.token';
import {
  resolveComponentConfig,
  WidgetsConfig
} from './interfaces/widgets-config.interface';
import { PluginManagerService } from './services/plugin-manager.service';
import { WidgetPlugin } from './interfaces/widget-plugin.interface';

/**
 * Wires a component up as a plugin host in one call. This is the shared
 * mechanism that makes **every** cerious-widgets component extensible with
 * plugins: it reads the component's config block from {@link WidgetsConfig} by
 * namespace, instantiates the declared plugins through DI, initialises them
 * against the component's public `api`, and tears them down on destroy.
 *
 * Call it once from the component's constructor (an injection context), after
 * the `api` object exists:
 *
 * ```ts
 * readonly api: SelectApi = { getValue: () => …, open: () => …, … };
 * constructor() {
 *   providePluginHost('select', this.api);
 * }
 * ```
 *
 * Consumers then register plugins declaratively:
 *
 * ```ts
 * CeriousWidgetsModule.forRoot({ select: { plugins: [MySelectPlugin] } })
 * ```
 *
 * @typeParam TApi - The component's public API surface handed to its plugins.
 * @param namespace - The component's plugin namespace (its selector without the
 *   `cw-` prefix, e.g. `select`). Also used to look up lazy-plugin loaders.
 * @param api - The stable API object plugins receive in `onInit`.
 */
export function providePluginHost<TApi extends object>(namespace: string, api: TApi): void {
  const manager = inject(PluginManagerService);
  const config = inject<WidgetsConfig>(WIDGETS_CONFIG, { optional: true }) ?? undefined;
  const injector = inject(Injector);
  const destroyRef = inject(DestroyRef);

  const block = resolveComponentConfig(config, namespace);

  // Initialise once the host has rendered, mirroring the ngAfterViewInit timing
  // the grid/multi-select/date-picker used — plugins commonly touch the DOM.
  afterNextRender(() => {
    const instances = (block.plugins ?? []).map(
      type => injector.get(type) as WidgetPlugin<TApi>
    );
    if (instances.length) {
      manager.initPlugins(api, instances, block.pluginOptions);
      instances.forEach(plugin => plugin.afterInit?.());
    }
    // Namespaced lazy loaders, dynamically imported and initialised on demand.
    if (block.lazyPlugins && Object.keys(block.lazyPlugins).length) {
      runInInjectionContext(injector, () => {
        manager.registerPlugins(block.lazyPlugins!, api, block.pluginOptions, namespace);
      });
    }
  });

  destroyRef.onDestroy(() => manager.destroyPlugins(api));
}
