import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApiTableComponent, CodeBlockComponent, DocPageComponent, DocSectionComponent, DocTabComponent } from '../../ui';

/**
 * Guide page (not a component) documenting the universal plugin system: every
 * cerious-widgets component is a plugin host, so consumers can extend or replace
 * behaviour without forking the library.
 */
@Component({
  selector: 'app-plugins-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPageComponent, DocTabComponent, DocSectionComponent, CodeBlockComponent, ApiTableComponent],
  template: `
    <doc-page slug="plugins"><doc-tab label="Overview">
      <doc-section
        title="Every component is extensible"
        description="Each cerious-widgets component is a plugin host. A plugin is a small class that receives the component's public API on init and can read state, drive it, decorate the DOM, or completely change its behaviour, without touching library source. Plugins are registered declaratively per component via CeriousWidgetsModule.forRoot({ … }).">
      </doc-section>

      <doc-section
        title="The plugin contract"
        description="Implement WidgetPlugin<TApi>. onInit receives the host component's typed API; afterInit runs once the view is ready; onDestroy tears down. TApi differs per component (SelectApi, CwFormControlApi, TabsApi, …), but the lifecycle is identical everywhere.">
        <doc-code [code]="contractCode" />
      </doc-section>

      <doc-section
        title="Register a plugin"
        description="Add the plugin class to the component's block in the root config. The namespace is the component's selector without the cw- prefix, camel-cased (e.g. inputNumber, toggleSwitch, dataView).">
        <doc-code [code]="registerCode" />
      </doc-section>
    </doc-tab><doc-tab label="Write a plugin">
      <doc-section
        title="A complete example"
        description="This Select plugin opens the panel on double-click and logs every change through the public API. It never reaches into component internals, only the SelectApi contract.">
        <doc-code [code]="exampleCode" />
      </doc-section>

      <doc-section
        title="Lazy plugins"
        description="Large or optional plugins can be code-split. Provide a loader keyed by name under lazyPlugins; it is dynamically imported and initialised on demand.">
        <doc-code [code]="lazyCode" />
      </doc-section>

      <doc-section
        title="Author your own host"
        description="Building a custom component? Make it plugin-extensible in one line with providePluginHost(namespace, api), the same helper every built-in component uses.">
        <doc-code [code]="hostCode" />
      </doc-section>
    </doc-tab><doc-tab label="Component APIs">
      <doc-section
        title="API tiers"
        description="Every host exposes at least getHost(). Value controls add getValue/setValue/isDisabled (CwFormControlApi). A few containers expose bespoke, richer contracts.">
        <doc-api [props]="apiTiers" [events]="[]" />
      </doc-section>
    </doc-tab></doc-page>
  `
})
export class PluginsDocComponent {
  readonly apiTiers = [
    { name: 'CwWidgetApi', type: 'getHost()', default: 'all components', description: 'The floor: every component/directive exposes its host element so a plugin can decorate or observe the DOM.' },
    { name: 'CwFormControlApi<T>', type: 'getValue / setValue / isDisabled / getHost', default: 'value controls', description: 'Checkbox, slider, input-number, password, color-picker, rating, knob, listbox, etc.' },
    { name: 'SelectApi', type: 'getValue / setValue / getOptions / open / close / isOpen / getHost', default: 'select', description: 'Richer bespoke contract for the Select.' },
    { name: 'TabsApi / StepperApi', type: 'getActiveIndex / setActiveIndex / getHost', default: 'tabs, stepper', description: 'Navigation containers.' },
    { name: 'TreeApi', type: 'getSelectedKey / setSelectedKey / getNodes / getHost', default: 'tree', description: 'Selection tree.' },
    { name: 'GridApi', type: 'setData / refresh / applySorting / events / …', default: 'grid', description: 'The most extensive API, the grid ships 7 first-party plugins.' }
  ];

  contractCode = `import { WidgetPlugin } from 'ngx-cerious-widgets';

export class MyPlugin implements WidgetPlugin<SomeApi> {
  onInit(api: SomeApi) { /* wire up */ }
  afterInit?() { /* view ready */ }
  onDestroy?() { /* clean up */ }
}`;

  registerCode = `CeriousWidgetsModule.forRoot({
  select:      { plugins: [MySelectPlugin] },
  checkbox:    { plugins: [AuditPlugin] },
  inputNumber: { plugins: [CurrencyPlugin], pluginOptions: { locale: 'de-DE' } },
  grid:        { plugins: [MultiSortPlugin, ColumnMenuPlugin] },
})`;

  exampleCode = `import { Injectable } from '@angular/core';
import { SelectApi, SelectPlugin } from 'ngx-cerious-widgets';

@Injectable()
export class DblClickOpenPlugin implements SelectPlugin {
  onInit(api: SelectApi) {
    api.getHost().addEventListener('dblclick', () => api.open());
  }
}

// forRoot({ select: { plugins: [DblClickOpenPlugin] } })`;

  lazyCode = `CeriousWidgetsModule.forRoot({
  grid: {
    lazyPlugins: {
      'export-to-excel': () =>
        import('./excel.plugin').then(m => m.ExcelPlugin),
    },
  },
})`;

  hostCode = `import { providePluginHost, CwWidgetApi } from 'ngx-cerious-widgets';

@Component({ selector: 'my-widget', /* … */ })
export class MyWidget {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };
  constructor() { providePluginHost('myWidget', this.api); }
}`;
}
