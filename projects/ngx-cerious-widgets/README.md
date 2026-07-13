![Cerious Widgets](cerious-widgets-sm.png)

# Cerious Widgets

**(Pronounced: Serious)**

**A seriously complete, enterprise-grade Angular component library** — ~85 standalone, signal-based, zoneless-safe components unified by a three-theme design-token system, accessible to WCAG 2.1 AA, and extensible end-to-end with a universal plugin architecture.

No heavy dependencies. MIT licensed. Built for real-world, data-intensive apps.

## 🔗 Links

- 🌐 **Live demo & docs:** https://ryoucerious.github.io/cerious-widgets/
- 📦 **npm:** https://www.npmjs.com/package/ngx-cerious-widgets

---

## ✨ Highlights

- **~85 components** across Data, Form, Display, Navigation, Overlay & Utilities — from inputs, selects and a virtualized data grid to menus, dialogs, charts and a calendar.
- **Three themes, zero rebuild** — Cerious Light, Frost (glassmorphism) and Dark, all driven by `--cw-*` CSS custom properties. Switch at runtime with a single `data-cw-theme` attribute.
- **Accessible by default** — keyboard navigation, ARIA and focus management throughout; the whole library passes **axe-core WCAG 2.1 AA with 0 violations** across every component page in all three themes.
- **Zoneless & signal-based** — every component is `standalone`, OnPush and built on Angular signals, safe under `provideExperimentalZonelessChangeDetection()`.
- **Universal plugin system** — *every* component is a plugin host. Extend, observe or completely replace behaviour without forking. See [Plugins](#-plugins).
- **A world-class data grid** — virtual scrolling, server-side mode, multi-sort, grouping, pinning, drag-and-drop columns, column menu, Excel export, save/restore views.

---

## 📦 Installation

```bash
npm install ngx-cerious-widgets
```

Add the stylesheet to `angular.json`:

```json
"styles": [
  "node_modules/ngx-cerious-widgets/styles/grid-styles-generated.scss"
]
```

The components are **standalone** — import just what you use:

```ts
import { SelectComponent, DialogComponent } from 'ngx-cerious-widgets';

@Component({
  standalone: true,
  imports: [SelectComponent, DialogComponent],
  // ...
})
export class MyComponent {}
```

Prefer a module? `CeriousWidgetsModule.forRoot({ /* config */ })` still works and is where you register plugins (see below).

---

## 🚀 Quick start

```html
<!-- A themed select -->
<cw-select [options]="cities" [(ngModel)]="city" optionLabel="name" optionValue="code" placeholder="Pick a city" />

<!-- The data grid -->
<cw-grid [data]="rows" [gridOptions]="gridOptions" (rowClick)="onRowClick($event)" />
```

Browse every component — with live examples, an API table and theming notes for each — in the [documentation site](https://ryoucerious.github.io/cerious-widgets/).

---

## 🎨 Theming

All visuals are driven by `--cw-*` design tokens, so theming is a matter of setting CSS variables — no recompiling. Ship the three built-in themes or define your own.

```html
<!-- Switch the whole app at runtime -->
<html data-cw-theme="frost">  <!-- 'light' | 'frost' | 'dark' -->
```

```css
:root {
  --cw-primary: #2563eb;
  --cw-surface: #ffffff;
  --cw-radius: 8px;
  /* …override any token */
}
```

---

## 🧩 Plugins

Plugins let you **change or extend a component's functionality without touching library source**. Every component is a plugin host: your plugin receives the component's typed public API on init and can read state, drive it, decorate the DOM, or replace behaviour outright.

```ts
import { SelectApi, SelectPlugin } from 'ngx-cerious-widgets';

export class DblClickOpenPlugin implements SelectPlugin {
  onInit(api: SelectApi) {
    api.getHost().addEventListener('dblclick', () => api.open());
  }
  onDestroy() { /* clean up */ }
}
```

Register plugins declaratively per component (the key is the component's selector without `cw-`, camel-cased):

```ts
CeriousWidgetsModule.forRoot({
  select:   { plugins: [DblClickOpenPlugin] },
  checkbox: { plugins: [AuditPlugin] },
  grid:     { plugins: [MultiSortPlugin, ColumnMenuPlugin] },
})
```

**API tiers:** every host exposes at least `getHost()` (`CwWidgetApi`); value controls add `getValue`/`setValue`/`isDisabled` (`CwFormControlApi`); selection containers and the grid expose richer bespoke contracts (`SelectApi`, `TabsApi`, `TreeApi`, `GridApi`, …). Building your own component? Make it extensible in one line with `providePluginHost(namespace, api)`.

Full guide: **[/components/plugins](https://ryoucerious.github.io/cerious-widgets/components/plugins)**.

---

## ▦ The data grid

The grid is a full-blown, enterprise data grid — not just a table:

- **Performance** — virtual scrolling (render 1M+ rows), pagination, server-side mode (paging / filtering / virtual scroll).
- **Layout** — column resizing & pinning, drag-and-drop reordering, grouped headers, group-by with a drag-to-group UI, nested rows (any Angular template).
- **Data** — multi-column sorting (Ctrl/Meta-click), text/number/select/date filtering.
- **Customization** — cell/header/row templates; directive-based plugin templates.
- **Extensibility** — pluggable architecture, save & restore views, one-line Excel export.

```html
<cw-grid
  [data]="data"
  [gridOptions]="gridOptions"
  [pluginOptions]="{ MultiSort: { enableMultiSort: true }, ColumnMenu: { enableColumnMenu: true } }"
  (rowClick)="onRowClick($event)">
</cw-grid>
```

---

## ♿ Accessibility

Keyboard support, ARIA roles/attributes and focus management are built into every component. The library is verified with an axe-core harness across all component pages in Light, Frost and Dark — **0 WCAG 2.1 AA violations**. Color tokens meet AA contrast, including the filled/severity surfaces.

---

## 🤝 Contributing

Ideas, plugins and PRs are welcome. Head to the [issues page](https://github.com/rYOUcerious/cerious-widgets/issues) to suggest features or report bugs.

---

## 📝 License

MIT — free for personal and commercial projects.

---

## 🧠 Built with purpose

Cerious Widgets was built by a developer who's spent nearly two decades in enterprise front-end development. If you've ever been frustrated by restrictive licensing or boxed in by rigid components — **this is for you**.

https://ryoucerious.github.io/cerious-widgets/
