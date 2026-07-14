# ngx-cerious-widgets Getting Started

A flexible, extensible Angular data grid with advanced features and plugin support.

---

## Installation

Install the package (replace with your actual package name if different):

```bash
npm install ngx-cerious-widgets
```

---

## Import the Module

In your Angular app module:

```typescript
import { CeriousWidgetsModule } from 'ngx-cerious-widgets';

@NgModule({
  imports: [
    // ...other imports
    CeriousWidgetsModule
  ]
})
export class AppModule { }
```

---

## Add Styles

**No stylesheet import is required.** The library injects its structural
styles (design tokens, CDK-overlay theming, virtual-scrollbar and form-control
styling, and the grid chrome) automatically at bootstrap.

- **Module apps** get it from `CeriousWidgetsModule.forRoot(...)`.
- **Standalone apps** call `provideCeriousTheme()` once in `app.config.ts`:

  ```typescript
  import { provideCeriousTheme } from 'ngx-cerious-widgets';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideCeriousTheme(),                     // default theme
      // or pick a preset / brand colors:
      // provideCeriousTheme({ preset: 'dark', primary: '#6c63ff' })
    ]
  };
  ```

`provideCeriousTheme()` also lets you set your own primary/secondary colors,
radius and font, or choose from the curated presets, see the Theming guide.

> Prefer a plain global stylesheet? You can still add
> `ngx-cerious-widgets/styles/grid-styles-generated.scss` to your `angular.json`
> `styles` array or `@import` it, the injected sheet is identical and the
> browser simply dedupes it.

---

## Basic Usage

Add the grid component to your template:

```html
<cw-grid
  [data]="rowData"
  [gridOptions]="gridOptions"
  [pluginOptions]="pluginOptions"
</cw-grid>
```

---

## Define Columns

Create your column definitions in your component:

```typescript
import { ColumnDef } from 'ngx-cerious-widgets';

columnDefs: ColumnDef[] = [
  { field: 'id', headerName: 'ID', width: 80, pinned: true },
  { field: 'name', headerName: 'Name', sortable: true, filter: true },
  { field: 'category', headerName: 'Category', filter: true },
  { field: 'price', headerName: 'Price', sortable: true, type: 'number' },
  // ...more columns
];
```

---

## Provide Data

Supply your data as an array of objects:

```typescript
rowData = [
  { id: 1, name: 'Product 1', category: 'Books', price: 19.99 },
  { id: 2, name: 'Product 2', category: 'Electronics', price: 299.99 },
  // ...more rows
];
```

---

## Grid Options

Configure grid behavior:

```typescript
gridOptions = {
  height: 'auto', // or a fixed value like '400px'
  container: 'myGridContainer', // optional: DOM element or ID
  pageSize: 50,
  // ...other options
};
```

---

## Plugin Options

Enable or configure plugins:

```typescript
pluginOptions = {
  MultiSort: { enableMultiSort: true },
  GlobalTextFilter: { enableGlobalTextFilter: true },
  ColumnVisibility: { enableColumnVisibility: true },
  GridState: { enableSaveState: true, label: 'View' }
};
```

---

## Advanced Features

- **Sorting:** Click column headers to sort. Multi-sort is supported if enabled.
- **Filtering:** Enable per-column or global text filtering.
- **Column Visibility:** Show/hide columns via the column visibility plugin.
- **State Save/Restore:** Save and restore grid layouts, column order, and sort state.
- **Grouping:** Group rows by columns if enabled.
- **Paging:** Built-in paging support.
- **Drag & Drop:** Reorder columns via drag-and-drop.

---

## Example

```html
<div id="myGridContainer" style="height: 500px;">
  <cw-grid
    [data]="rowData"
    [gridOptions]="gridOptions"
    [pluginOptions]="pluginOptions"
  </cw-grid>
</div>
```

---

## Customization

- **Templates:** Register custom templates for headers, cells, or plugin buttons using the `TemplateRegistryService`.
- **Styling:** Override SCSS variables or extend the provided styles for custom themes.
- **Plugins:** Write your own plugins by implementing the `GridPlugin` interface and registering them.

---

## Tips

- For large datasets, consider server-side paging and filtering.
- Use the `SaveGridStatePlugin` to let users save and restore their preferred grid layouts.
- Refer to the source code for advanced configuration and extension points.

---

## Contributing

1. Fork the repo and create a feature branch.
2. Write tests for your feature or bugfix.
3. Submit a pull request!

---

## License

MIT

---

**For more details, see the source code and inline documentation.**}

https://ryoucerious.github.io/cerious-widgets/
