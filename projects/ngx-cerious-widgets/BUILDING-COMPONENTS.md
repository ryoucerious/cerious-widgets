# Building a cerious-widgets component

The library has **two component tiers**. Pick the tier first — it decides how
much of the core machinery (plugins, template registry, config, zoneless base)
a component takes on.

## Tier 1 — Presentational & form primitives

Badge, Tag, Chip, Checkbox, Slider, Tabs, Alert, … Anything whose behaviour is
self-contained and not meant to be extended by plugins.

The contract:

- **standalone**, `ChangeDetectionStrategy.OnPush`, signal inputs (`input()`,
  `output()`, `computed`), `booleanAttribute`/`numberAttribute` transforms.
  Signal + OnPush is already zoneless-safe — primitives do **not** extend
  `ZonelessCompatibleComponent` (that base is for imperative work: timers,
  subscriptions, manual CD).
- Form controls implement `ControlValueAccessor` over a **real, visually-hidden
  native input** so keyboard, focus and forms stay native.
- Styling uses `--cw-*` tokens only (see §6); severity comes from the shared
  `CwSeverity` type.
- Floating pieces (tooltip, popover-like) build on the CDK overlay foundation
  in `components/overlay/`.
- A spec per component; export via `components/index.ts`; a showcase page,
  nav entry and route in `cerious-app`.

## Tier 2 — Composite widgets (the Grid contract)

Grid, MultiSelect, DatePicker, Menu, Dialog, … Anything with an extension
surface: pluggable behaviour, consumer-overridable rendering, or non-trivial
configuration. These follow the full contract below (§1–§6).

**Virtual scrolling:** any composite that renders a potentially large list
(select/multiselect panels, listbox, tree, ordered lists) MUST virtualize it
with `@ceriousdevtech/ngx-cerious-scroll`:

```html
<cerious-scroll [items]="options">
  <ng-template ceriousScrollItem let-item let-index="index">…</ng-template>
</cerious-scroll>
```

## 1. The component shell

Make the component **standalone** and extend `ZonelessCompatibleComponent` so it
works whether or not the host app runs Zone.js:

```ts
@Component({ selector: 'cw-select', standalone: true, /* ... */ })
export class SelectComponent extends ZonelessCompatibleComponent {
  constructor() { super(); }
}
```

The base class provides `markForCheck()`, `detectChanges()`, `runOutsideAngular()`,
`runInZone()`, `scheduleTask()`, and `safeAsync()`. Prefer these over calling the
`ChangeDetectorRef` directly — they no-op or adapt correctly in zoneless mode.

## 2. A typed API surface

Plugins must never reach into component internals. Expose a small interface — the
component's public API — and pass it to plugins. The Grid's is `GridApi`; a new
component defines its own (e.g. `SelectApi`).

## 3. The plugin contract

Plugins implement `WidgetPlugin<TApi>` (lifecycle: `onInit(api, config)`,
optional `afterInit`, `onDestroy`). Extend it with component-specific hooks:

```ts
export interface SelectPlugin extends WidgetPlugin<SelectApi> {
  onOpen?(): void;
}
```

Wire plugins through `PluginManagerService` — do not call `onInit`/`onDestroy`
yourself:

```ts
ngAfterViewInit() { this.pluginManager.initPlugins(this.api, allPlugins); }
ngOnDestroy()     { this.pluginManager.destroyPlugins(this.api); }
```

`initPlugins` tracks instances per API and is idempotent; `destroyPlugins` tears
them all down. For lazy/string-keyed plugins, register loaders under your
component's namespace: `registerLazyPlugins(loaders, 'select')`.

## 4. Configuration

Add a per-component block to `WidgetsConfig` and read it with a resolver that
merges any deprecated top-level aliases (see `resolveGridConfig` as the model):

```ts
export interface WidgetsConfig {
  grid?: ComponentConfig<GridPlugin>;
  select?: ComponentConfig<SelectPlugin>; // new components add their block
}
```

## 5. Template slots

Let consumers override rendering by registering named templates with the
`[cwTemplate]` directive and reading them from `TemplateRegistryService`:

```html
<ng-template cwTemplate="select.option" let-item> {{ item.label }} </ng-template>
```

```ts
const tpl = this.templateRegistry.getTemplate('select.option');
```

## 6. Theming

Style with the design-token CSS custom properties (`--cw-*`) rather than
hard-coded colors, so the component themes for free and supports dark mode. Never
bake palette values into component SCSS.
```
