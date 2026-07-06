import { AfterViewInit, ApplicationRef, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ColumnDef, ColumnType, GridComponent, GridOptions } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

interface Product {
  id: number; name: string; category: string; price: number; stock: number;
}

const CATEGORIES = ['Electronics', 'Apparel', 'Home', 'Toys'];

function makeData(n: number): Product[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    category: CATEGORIES[i % CATEGORIES.length],
    price: Math.round((5 + Math.random() * 495) * 100) / 100,
    stock: Math.floor(Math.random() * 500)
  }));
}

function columns(): ColumnDef[] {
  const caps = { sortable: true, filterable: true, resizable: true, draggable: true, groupable: true };
  return [
    { id: 'id', field: 'id', label: 'ID', type: ColumnType.Number, ...caps },
    { id: 'name', field: 'name', label: 'Name', type: ColumnType.String, ...caps },
    { id: 'category', field: 'category', label: 'Category', type: ColumnType.String, ...caps },
    { id: 'price', field: 'price', label: 'Price', type: ColumnType.Number, format: 'currency' as any, ...caps },
    { id: 'stock', field: 'stock', label: 'Stock', type: ColumnType.Number, ...caps }
  ];
}

@Component({
  selector: 'app-grid-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, GridComponent, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="grid">
      <doc-tab label="Features">
        <doc-section title="Data grid" description="Sortable, filterable, groupable, resizable and reorderable columns. Click a header to sort." [code]="basicCode">
          <div class="grid-frame">
            @if (show()) { <cw-grid [data]="data" [gridOptions]="options" style="width: 100%;" /> }
          </div>
        </doc-section>

        <doc-section title="Virtual scrolling"
          description="With enableVirtualScroll the body renders through ngx-cerious-scroll — hundreds of thousands of rows stay smooth because only the visible rows exist in the DOM. Explore the fully-featured, virtualized grid (sorting, grouping, pinning, inline editing, Excel export) in the dedicated demo.">
          <a routerLink="/components/grid" class="grid-cta">The Grid powers this whole library — see every feature in action →</a>
          <div style="margin-top: 1rem;"><span class="grid-note">Tip: the grid also supports column pinning, grouping, inline editing and Excel export via its plugin system (see the API tab).</span></div>
        </doc-section>
      </doc-tab>

      <doc-tab label="API">
        <doc-api [props]="apiProps" />
      </doc-tab>

      <doc-tab label="Theming">
        <doc-theming [tokens]="themeTokens" />
      </doc-tab>
    </doc-page>
  `,
  styles: [`
    .grid-frame { width: 100%; }
    .grid-cta { color: var(--cw-primary); font-weight: 600; text-decoration: none; }
    .grid-cta:hover { text-decoration: underline; }
    .grid-note { color: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 0.9rem; }
  `]
})
export class GridDocComponent implements AfterViewInit {
  private readonly appRef = inject(ApplicationRef);

  // Defer render one tick so the frame is laid out before the grid measures its
  // body, then nudge change detection: the grid renders its rows from nested
  // setTimeouts, whose DOM updates aren't flushed automatically under zoneless
  // change detection until an interaction — so tick() a few times as it settles.
  readonly show = signal(false);
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.show.set(true);
      for (const delay of [80, 200, 400]) {
        setTimeout(() => this.appRef.tick(), delay);
      }
    });
  }

  readonly data = makeData(12);

  // No `height: 'auto'` — that formula sizes the body against the viewport and
  // collapses inside a mid-page container. Omitting height lets the grid grow to
  // its content (all rows, since virtual scroll is off).
  readonly options: GridOptions = {
    columnDefs: columns(),
    showFooter: false,
    showMenuBar: false,
    showPager: false,
    enableVirtualScroll: false,
    noDataMessage: 'No records found.'
  };

  basicCode = `<cw-grid [data]="data" [gridOptions]="options" />

options: GridOptions = {
  columnDefs: columns,   // sortable / filterable / groupable / resizable
  enableVirtualScroll: true   // for very large datasets
};`;

  apiProps = [
    { name: 'data', type: 'T[]', default: 'null', description: 'Row data array.' },
    { name: 'gridOptions', type: 'GridOptions', default: '—', description: 'Column defs + behaviour: columnDefs, height, enableVirtualScroll, showMenuBar, showPager, showFooter, noDataMessage…' },
    { name: 'pluginOptions', type: 'PluginOptions', default: '{}', description: 'Per-plugin config: MultiSort, GlobalTextFilter, ColumnMenu, ColumnVisibility, ExportToExcel, SaveGridState.' },
    { name: 'columnDefs[].sortable', type: 'boolean', default: 'false', description: 'Enable click-to-sort on the column.' },
    { name: 'columnDefs[].filterable', type: 'boolean', default: 'false', description: 'Enable column filtering.' },
    { name: 'columnDefs[].groupable', type: 'boolean', default: 'false', description: 'Allow grouping rows by the column.' },
    { name: 'columnDefs[].pinnable', type: 'boolean', default: 'false', description: 'Allow pinning the column to an edge.' },
    { name: 'columnDefs[].resizable / draggable', type: 'boolean', default: 'false', description: 'Allow resizing / reordering the column.' }
  ];
  themeTokens = [
    { token: '--cw-surface', description: 'Row & header background.' },
    { token: '--cw-surface-sunken', description: 'Zebra / alternate row background.' },
    { token: '--cw-border', description: 'Row and header borders.' },
    { token: '--cw-divider', description: 'Table outline.' },
    { token: '--cw-primary', description: 'Active pager page & selection accent.' },
    { token: '--cw-grid-group-fg', description: 'Group-row label colour.' }
  ];
}
