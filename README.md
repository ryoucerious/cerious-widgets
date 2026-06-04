![Cerious Widgets](cerious-widgets-sm.png)

# Cerious Widgets - Cerious Grid

**(Pronounced: Serious)**

**A seriously powerful Angular grid — for developers who demand control, flexibility, and performance.**  
Part of the [Cerious Widgets](https://github.com/rYOUcerious/cerious-widgets) collection.

## 🔗 Links

- 🌐 **Live Demo:** https://ryoucerious.github.io/cerious-widgets/
- 📖 **API Documentation:** https://ryoucerious.github.io/cerious-widgets/docs/api/
- 📦 **npm:** https://www.npmjs.com/package/ngx-cerious-widgets

---

## 🚀 Why Cerious Grid?

Cerious Grid isn't just a table — it's a full-blown, enterprise-grade Angular grid built for speed, extensibility, and total customization.

With a modern plugin system, rich templating support, and no heavy dependencies, it's everything you need to build real-world data-intensive apps.

---

## ✨ Features

  ## ⚡️ Core UX & Performance
  - 🔁 **Virtual Scrolling** — Render thousands of rows without performance hits  
  - 🔄 **Pagination**  
  - 🌐 **Server-Side Mode** — Pagination, Filtering, Virtual Scroll  

  ## 🧭 Layout & Interaction
  - ↕️ **Column Resizing and Pinning**  
  - 🔗 **Drag-and-Drop Columns**  
  - 🧱 **Grouped Column Headers**  
  - 📊 **Group By** — with drag-to-group UI  
  - 🧬 **Nested Rows** — Use any Angular template for children (tables, charts, etc.)

  ## 🔍 Data Interaction
  - 🧠 **Multi-Column Sorting** — Ctrl/Meta click to multi-sort  
  - 🧹 **Column Filtering** — Text, number, select, date  

  ## 🧾 Customization
  - 🧾 **Custom Templates** — Cells, headers, rows — fully yours  
  - 💡 **Directive-Based Plugin Templates**  

  ## 🧩 Extensibility & Persistence
  - 🧩 **Pluggable Architecture** — Add or override behavior without touching core  
  - 💾 **Save & Restore Views** — Favorites, state, layout  

  ## 📤 Output & Licensing
  - 📦 **Excel Export** — One-liner export with [`write-excel-file`](https://www.npmjs.com/package/write-excel-file)  
  - 🔓 **MIT Licensed and Fully Open Source**

---

## 📦 Installation

```bash
npm install ngx-cerious-widgets
```

Import via module or import directly into into your component.
```bash
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CeriousWidgetsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Add the styles to `angular.json`
```bash
"node_modules/ngx-cerious-widgets/styles/grid-styles-generated.scss",
```

---


## 🧪 Quick Start

```html
<cw-grid
  [data]="data"
  [gridOptions]="gridOptions"
  (rowClick)="onRowClick($event)">
</cw-grid>
```

---

## 🧩 Plugin Example

```ts
export class MyPlugin implements GridPlugin {
  onInit(api: GridApi) {
    api.onCellClick.subscribe(cell => {
      console.log('Cell clicked:', cell);
    });
  }
}
```

You can also consume templates using Angular `@Directive()`s to inject content dynamically.

---

## 📸 Live Demos

StackBlitz playground: https://stackblitz.com/edit/stackblitz-starters-5jca2yeb?file=angular.json

---

## 🤝 Contributing

We welcome your ideas, plugins, and PRs.  
Head to the [issues page](https://github.com/your-org/cerious-grid/issues) to suggest features or report bugs.

---

## 📝 License

MIT — free for personal and commercial projects.

---

## 🧠 Built With Purpose

Cerious Grid was built by a developer who’s spent nearly two decades in enterprise front-end development.  
If you’ve ever been frustrated by AG Grid’s licensing or boxed in by rigid tables — **this is for you**.

https://ryoucerious.github.io/cerious-widgets/
