import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, ApplicationRef, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GridComponent, GridOptions, PluginOptions, TagComponent } from 'ngx-cerious-widgets';
import {
  ApiTableComponent,
  CodeBlockComponent,
  DocPageComponent,
  DocSectionComponent,
  DocTabComponent,
  ThemingNotesComponent
} from '../../ui';
import { columns, footerColumns, formatColumns, groupedColumns, makeProducts, statusSeverity, withCol } from './grid-data';

type FeatureId =
  | 'basic' | 'sorting' | 'filtering' | 'grouping' | 'selection' | 'pinning'
  | 'column-menu' | 'editing' | 'templates' | 'grouped-headers' | 'formatters'
  | 'footer' | 'resize' | 'pagination' | 'export' | 'virtual';

interface FeatureDoc {
  id: FeatureId;
  label: string;
  title: string;
  blurb: string;
  code: string;
}

interface GridConfig {
  data: unknown[];
  options: GridOptions;
  plugins: PluginOptions;
  bodyClasses: { container?: string };
}

interface PluginDoc {
  name: string;
  registered: string;
  purpose: string;
  config: string;
}

@Component({
  selector: 'app-grid-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe, DecimalPipe,
    GridComponent, TagComponent,
    DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent, CodeBlockComponent
  ],
  templateUrl: './grid.doc.html',
  styleUrl: './grid.doc.scss'
})
export class GridDocComponent implements AfterViewInit {
  private readonly appRef = inject(ApplicationRef);
  readonly statusSeverity = statusSeverity;

  private readonly gridData = makeProducts(200);
  private readonly editData = makeProducts(200);
  private readonly largeData = makeProducts(100000);

  /** Footer aggregate: sum a numeric field across the current grid data. */
  totalOf(field: 'price' | 'stock'): number {
    return this.gridData.reduce((sum, row) => sum + (row[field] as number), 0);
  }

  readonly features: FeatureDoc[] = [
    { id: 'basic', label: 'Basic', title: 'A data grid in one binding', blurb: 'Point the grid at a data array and a set of column definitions. Each column opts into capabilities (sortable, filterable, groupable, pinnable, resizable, draggable) independently, and the body virtualizes so hundreds of thousands of rows stay smooth.', code: `<cw-grid [data]="data" [gridOptions]="options" />

options: GridOptions = {
  columnDefs: [
    { id: 'id', field: 'id', label: 'ID', type: ColumnType.Number },
    { id: 'name', field: 'name', label: 'Name', type: ColumnType.String, sortable: true, filterable: true }
    // …
  ],
  enableVirtualScroll: true
};` },
    { id: 'sorting', label: 'Sorting', title: 'Single & multi-column sorting', blurb: 'Click a header to sort a sortable column. Hold ⌘ (Ctrl on Windows/Linux) and click further headers to build a multi-column sort. The MultiSort plugin adds the multi-column behaviour; the menu bar surfaces sort indicators.', code: `<cw-grid [data]="data"
  [gridOptions]="{ showMenuBar: true }"
  [pluginOptions]="{ MultiSort: { enableMultiSort: true } }" />
// multi-sort modifier: ⌘ on macOS, Ctrl on Windows/Linux` },
    { id: 'filtering', label: 'Filtering', title: 'Global text filter', blurb: 'The GlobalTextFilter plugin adds a search box to the menu bar that filters rows across every filterable column as you type.', code: `<cw-grid [data]="data"
  [gridOptions]="{ showMenuBar: true }"
  [pluginOptions]="{ GlobalTextFilter: { enableGlobalTextFilter: true } }" />` },
    { id: 'grouping', label: 'Grouping', title: 'Group rows by column', blurb: 'Drag a groupable column into the group bar (or use its column menu) to group rows. Group headers are collapsible and show a per-group count. Grouping is driven by the ColumnMenu plugin with grouping enabled.', code: `<cw-grid [data]="data"
  [gridOptions]="{ showMenuBar: true, enableGroupBy: true }"
  [pluginOptions]="{ ColumnMenu: { enableColumnMenu: true, enableGroupBy: true } }" />` },
    { id: 'selection', label: 'Selection', title: 'Row selection', blurb: 'Set enableMultiselect to add a checkbox column and make rows selectable. Selection state is available through the grid API for building bulk actions.', code: `<cw-grid [data]="data" [gridOptions]="{ enableMultiselect: true }" />` },
    { id: 'pinning', label: 'Pinning', title: 'Pin columns', blurb: 'Pin columns to the left so they stay visible while the remaining columns scroll horizontally. Mark columns pinned up-front, or let users pin/unpin from the column menu.', code: `// pin up-front…
cols = withCol(columns(), 'id', c => c.pinned = true);
// …or via the column menu
<cw-grid [data]="data"
  [gridOptions]="{ enablePinning: true, showMenuBar: true }"
  [pluginOptions]="{ ColumnMenu: { enableColumnMenu: true, enablePinning: true } }" />` },
    { id: 'column-menu', label: 'Column menu', title: 'Per-column menu & visibility', blurb: 'Each header gets a hamburger menu offering sort, pin, group and more. Pair it with the ColumnVisibility plugin for a show/hide-columns panel.', code: `<cw-grid [data]="data"
  [gridOptions]="{ showMenuBar: true, enablePinning: true, enableGroupBy: true }"
  [pluginOptions]="{
    ColumnMenu: { enableColumnMenu: true, enablePinning: true, enableGroupBy: true },
    ColumnVisibility: { enableColumnVisibility: true }
  }" />` },
    { id: 'editing', label: 'Editing', title: 'Inline cell editing', blurb: 'Mark columns editable and double-click a cell to edit it in place. Edits flow back into your data array; hook the grid API for validation or persistence.', code: `cols = withCol(columns(), 'price', c => c.editable = true);
<cw-grid [data]="data" [gridOptions]="{ columnDefs: cols }" />` },
    { id: 'templates', label: 'Cell templates', title: 'Custom cell rendering', blurb: 'Point a column at a named <ng-template> (declared inside <cw-grid>) to render its cells however you like, here the status column becomes a coloured Tag. Templates receive the cell value and row.', code: `{ id: 'status', field: 'status', cellTemplate: 'statusTemplate' }

<cw-grid [data]="data" [gridOptions]="options">
  <ng-template #statusTemplate let-value="value">
    <cw-tag [value]="value" [severity]="statusSeverity(value)" />
  </ng-template>
</cw-grid>` },
    { id: 'grouped-headers', label: 'Grouped headers', title: 'Grouped (multi-row) headers', blurb: 'Give a column def `children` and it becomes a header group spanning them, the header renders as multiple rows, with the parent label above its child columns. Nest as deep as you like.', code: `columnDefs = [
  { id: 'id', field: 'id', label: 'ID' },
  { id: 'product', label: 'Product', children: [
    { id: 'name', field: 'name', label: 'Name' },
    { id: 'category', field: 'category', label: 'Category' }
  ] },
  { id: 'inventory', label: 'Inventory', children: [
    { id: 'price', field: 'price', label: 'Price', format: 'currency' },
    { id: 'stock', field: 'stock', label: 'In stock' }
  ] }
];` },
    { id: 'formatters', label: 'Formatters', title: 'Built-in value formatters', blurb: 'Set a column `format` to render values without a custom template: currency, a 0-1 percentage, a star rating, or localized date / datetime / time.', code: `columnDefs = [
  { id: 'price',  field: 'price',  label: 'Price',      format: 'currency' },
  { id: 'rating', field: 'rating', label: 'Rating',     format: 'stars' },
  { id: 'progress', field: 'progress', label: 'Fulfilment', format: 'percentage' },
  { id: 'date',   field: 'date',   label: 'Created',    format: 'date' }
];` },
    { id: 'footer', label: 'Footer', title: 'Footer / aggregate row', blurb: 'Turn on showFooter and point columns at a footerCellTemplate to render a summary row, e.g. column totals. The template receives the column; compute the aggregate from your own data.', code: `columnDefs = [
  { id: 'name',  field: 'name',  label: 'Name',  footerCellTemplate: 'footerLabel' },
  { id: 'price', field: 'price', label: 'Price', footerCellTemplate: 'footerPrice' },
  { id: 'stock', field: 'stock', label: 'Stock', footerCellTemplate: 'footerStock' }
];

<cw-grid [data]="data" [gridOptions]="{ showFooter: true, columnDefs }">
  <ng-template #footerLabel><strong>Totals</strong></ng-template>
  <ng-template #footerPrice>{{ totalOf('price') | currency }}</ng-template>
  <ng-template #footerStock>{{ totalOf('stock') }}</ng-template>
</cw-grid>` },
    { id: 'resize', label: 'Resize & reorder', title: 'Resize & reorder columns', blurb: 'Columns marked `resizable` can be dragged wider or narrower by their right edge; columns marked `draggable` can be dragged by their header to reorder. Both are per-column, and combine with every other feature.', code: `{ id: 'name', field: 'name', label: 'Name', resizable: true, draggable: true }
// drag a header to reorder · drag its right border to resize` },
    { id: 'pagination', label: 'Pagination', title: 'Paged grid', blurb: 'Prefer pages over infinite scroll? Turn on the pager and set a page size. The pager is built on the standalone Paginator, and every part, the rows-per-page select, the summary, the first/last and prev/next buttons, the page numbers, is configurable via gridOptions.pager. The page buttons align to the right. (Pagination and virtual scroll are mutually exclusive.)', code: `<cw-grid [data]="data" [gridOptions]="{
  showPager: true,
  pageSize: 12,
  enableVirtualScroll: false,
  pager: {
    showPageSize: true,          // rows-per-page select
    showSummary: true,           // "Showing x to y of n"
    showFirstLast: true,         // « »
    showPrevNext: true,          // ‹ ›
    showPageNumbers: true,       // 1 2 3 …
    pageSizeOptions: [12, 24, 50]
  }
}" />` },
    { id: 'export', label: 'Excel export', title: 'Export to Excel', blurb: 'With the ExportToExcel plugin registered, an export action appears in the menu bar and downloads the current (sorted/filtered) rows as an .xlsx file.', code: `<cw-grid [data]="data" [gridOptions]="{ showMenuBar: true }"
  [pluginOptions]="{ ExportToExcel: { enableExportToExcel: true } }" />

// main.ts
CeriousWidgetsModule.forRoot({ plugins: [ExportToExcelPlugin] })` },
    { id: 'virtual', label: 'Virtual scroll', title: '100,000 rows, virtualized', blurb: 'The body renders through ngx-cerious-scroll, so only the ~20 visible rows exist in the DOM at any time, scrolling a hundred thousand rows stays smooth. Bound the viewport height via bodyClasses (or a full-height container).', code: `<cw-grid [data]="bigData"
  [gridOptions]="{ enableVirtualScroll: true }"
  [bodyClasses]="{ container: 'my-grid-body' }" />

/* .my-grid-body { height: calc(100vh - 20rem); } */` }
  ];

  readonly plugins: PluginDoc[] = [
    { name: 'ColumnMenu', registered: 'ColumnMenuPlugin', purpose: 'Per-column hamburger menu: sort, pin, group, and hooks for the other column features.', config: `ColumnMenu: { enableColumnMenu: true, enablePinning?: true, enableGroupBy?: true }` },
    { name: 'ColumnVisibility', registered: 'ColumnVisibilityPlugin', purpose: 'Show/hide-columns panel in the menu bar.', config: `ColumnVisibility: { enableColumnVisibility: true }` },
    { name: 'GlobalTextFilter', registered: 'GlobalTextFilterPlugin', purpose: 'Menu-bar search box that filters across all filterable columns.', config: `GlobalTextFilter: { enableGlobalTextFilter: true }` },
    { name: 'MultiSort', registered: 'MultiSortPlugin', purpose: 'Shift-click multi-column sorting.', config: `MultiSort: { enableMultiSort: true }` },
    { name: 'ExportToExcel', registered: 'ExportToExcelPlugin', purpose: 'Adds an Excel (.xlsx) export action to the menu bar.', config: `ExportToExcel: { enableExportToExcel: true }` },
    { name: 'SaveGridState', registered: 'SaveGridStatePlugin', purpose: 'Persists column order/width/sort/filter state (e.g. to localStorage) and restores it.', config: `SaveGridState: { enableSaveGridState: true }` }
  ];

  registerCode = `// Register the grid plugins you need, once, at bootstrap.
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      CeriousWidgetsModule.forRoot({
        plugins: [
          ColumnMenuPlugin, ColumnVisibilityPlugin, GlobalTextFilterPlugin,
          MultiSortPlugin, ExportToExcelPlugin, SaveGridStatePlugin
        ]
      })
    )
  ]
});`;

  readonly activeFeature = signal<FeatureId>('basic');
  readonly gridVisible = signal(false);

  readonly current = computed(() => this.features.find(f => f.id === this.activeFeature())!);
  readonly config = computed<GridConfig>(() => this.buildConfig(this.activeFeature()));

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.gridVisible.set(true);
      this.nudge();
    });
  }

  selectFeature(id: FeatureId): void {
    if (id === this.activeFeature()) {
      return;
    }
    this.activeFeature.set(id);
    // Recreate the grid so it fully reconfigures for the new feature.
    this.gridVisible.set(false);
    setTimeout(() => {
      this.gridVisible.set(true);
      this.nudge();
    });
  }

  // Zoneless: the grid renders rows from nested setTimeouts whose DOM updates
  // aren't flushed until an interaction, so tick a few times as it settles.
  private nudge(): void {
    for (const delay of [120, 300, 600]) {
      setTimeout(() => this.appRef.tick(), delay);
    }
  }

  private buildConfig(id: FeatureId): GridConfig {
    const stageBody = { container: 'cw-grid-stage-body' };
    const options: GridOptions = {
      columnDefs: columns(),
      showFooter: false,
      showMenuBar: false,
      showPager: false,
      enableVirtualScroll: true,
      noDataMessage: 'No records found.'
    };
    let plugins: PluginOptions = {};
    let data: unknown[] = this.gridData;
    let bodyClasses: { container?: string } = stageBody;

    switch (id) {
      case 'sorting':
        options.showMenuBar = true;
        plugins = { MultiSort: { enableMultiSort: true } };
        break;
      case 'filtering':
        options.showMenuBar = true;
        plugins = { GlobalTextFilter: { enableGlobalTextFilter: true } };
        break;
      case 'grouping':
        options.showMenuBar = true;
        (options as GridOptions & { enableGroupBy?: boolean }).enableGroupBy = true;
        plugins = { ColumnMenu: { enableColumnMenu: true, enableGroupBy: true } };
        break;
      case 'selection':
        options.enableMultiselect = true;
        break;
      case 'pinning':
        (options as GridOptions & { enablePinning?: boolean }).enablePinning = true;
        options.showMenuBar = true;
        options.columnDefs = withCol(withCol(columns(), 'id', c => (c.pinned = true)), 'name', c => (c.pinned = true));
        plugins = { ColumnMenu: { enableColumnMenu: true, enablePinning: true } };
        break;
      case 'column-menu':
        options.showMenuBar = true;
        (options as GridOptions & { enableGroupBy?: boolean; enablePinning?: boolean }).enableGroupBy = true;
        (options as GridOptions & { enablePinning?: boolean }).enablePinning = true;
        plugins = {
          ColumnMenu: { enableColumnMenu: true, enablePinning: true, enableGroupBy: true },
          ColumnVisibility: { enableColumnVisibility: true }
        };
        break;
      case 'editing':
        options.columnDefs = ['name', 'category', 'price', 'stock'].reduce((c, id) => withCol(c, id, col => (col.editable = true)), columns());
        data = this.editData;
        break;
      case 'templates':
        options.columnDefs = withCol(columns(), 'status', c => (c.cellTemplate = 'statusTemplate'));
        break;
      case 'grouped-headers':
        options.columnDefs = groupedColumns();
        break;
      case 'formatters':
        options.columnDefs = formatColumns();
        break;
      case 'footer':
        options.showFooter = true;
        options.columnDefs = footerColumns();
        break;
      case 'resize':
        options.showMenuBar = true;
        break;
      case 'pagination':
        options.enableVirtualScroll = false;
        options.showPager = true;
        options.pageSize = 12;
        (options as GridOptions & { pager?: unknown }).pager = { pageSizeOptions: [12, 24, 50] };
        bodyClasses = {};
        break;
      case 'export':
        options.showMenuBar = true;
        plugins = { ExportToExcel: { enableExportToExcel: true } };
        break;
      case 'virtual':
        data = this.largeData;
        break;
      case 'basic':
      default:
        break;
    }

    return { data, options, plugins, bodyClasses };
  }

  // ---- API tab data ----
  gridProps = [
    { name: 'data', type: 'T[]', default: 'null', description: 'Row data array.' },
    { name: 'gridOptions', type: 'GridOptions', default: ', ', description: 'Column defs + behaviour (see the GridOptions table).' },
    { name: 'pluginOptions', type: 'PluginOptions', default: '{}', description: 'Per-plugin configuration (see the Plugins tab).' },
    { name: 'plugins', type: 'GridPlugin[]', default: '[]', description: 'Instance-level plugins (in addition to those registered via forRoot).' },
    { name: 'gridContainerClasses / menuBarClasses / headerClasses / bodyClasses / footerClasses / pagerClasses', type: 'SectionClassConfig', default: '{}', description: 'CSS classes for each grid section ({ container, row, cell }), e.g. to bound the virtual-scroll viewport height.' }
  ];
  gridEvents = [
    { name: 'dataChange', type: 'T[]', description: 'Emitted when the row data changes (e.g. after an inline edit).' },
    { name: 'rowClick / rowDoubleClick', type: 'GridRow', description: 'Row pointer interactions.' },
    { name: 'cellClick / cellDoubleClick', type: '{ row, column, value }', description: 'Cell pointer interactions.' },
    { name: 'rowKeydown / rowKeyup / rowKeypress', type: 'KeyboardEvent', description: 'Row keyboard events.' },
    { name: 'cellKeydown / cellKeyup / cellKeypress', type: 'KeyboardEvent', description: 'Cell keyboard events.' },
    { name: 'columnResize', type: 'ColumnDef', description: 'Emitted after a column is resized.' },
    { name: 'columnVisibilityChange', type: '{ id, visible }', description: 'Emitted when a column is shown/hidden.' },
    { name: 'gridResize', type: 'boolean', description: 'Emitted after the grid re-measures/resizes.' }
  ];
  gridMethods = [
    { name: 'gridApi.refresh()', type: 'void', description: 'Re-render header + body (after changing columns/data imperatively).' },
    { name: 'gridApi.resize()', type: 'Promise', description: 'Re-measure the grid to fit its container.' },
    { name: 'gridApi.getColumnDefs() / setColumnDefs(defs)', type: 'ColumnDef[] / void', description: 'Read / replace the column definitions.' },
    { name: 'gridApi.showColumn(id) / hideColumn(id)', type: 'void', description: 'Toggle a column\'s visibility.' },
    { name: 'gridApi.getSelectedRows() / selectRow(id)', type: 'T[] / void', description: 'Read the selection / select a row.' },
    { name: 'gridApi.expandRow(id) / collapseRow(id)', type: 'void', description: 'Expand / collapse a nested (detail) row.' },
    { name: 'gridApi.selectPage(n)', type: 'void', description: 'Go to page n (1-based).' }
  ];
  optionProps = [
    { name: 'columnDefs', type: 'ColumnDef[]', default: '[]', description: 'Column definitions (required, see the ColumnDef table).' },
    { name: 'enableVirtualScroll', type: 'boolean', default: 'false', description: 'Virtualize the body via ngx-cerious-scroll (huge datasets).' },
    { name: 'showMenuBar', type: 'boolean', default: 'false', description: 'Show the toolbar that hosts plugin actions (filter, export, visibility…).' },
    { name: 'showPager', type: 'boolean', default: 'false', description: 'Show the pager (built on the Paginator component).' },
    { name: 'pageSize', type: 'number', default: ', ', description: 'Rows per page when paginating.' },
    { name: 'pager', type: '{ showPageSize?, showSummary?, showFirstLast?, showPrevNext?, showPageNumbers?, pageSizeOptions? }', default: ', ', description: 'Per-part pager configuration.' },
    { name: 'showFooter', type: 'boolean', default: 'false', description: 'Show the footer/aggregate row (via footerCellTemplate).' },
    { name: 'enableMultiselect / enableSingleselect', type: 'boolean', default: 'false', description: 'Row selection with a checkbox column (multi) or single-row select.' },
    { name: 'enableGroupBy', type: 'boolean', default: 'false', description: 'Allow row grouping (with the ColumnMenu plugin).' },
    { name: 'enablePinning', type: 'boolean', default: 'false', description: 'Allow pinning columns to the left.' },
    { name: 'enableColumnVisibility', type: 'boolean', default: 'false', description: 'Enable the show/hide-columns panel (with the ColumnVisibility plugin).' },
    { name: 'height / maxHeight', type: 'string', default: `'auto'`, description: `Grid height. 'auto' fills the container (heightOffset trims it); a fixed length is used as-is.` },
    { name: 'heightOffset', type: 'number', default: '0', description: 'Px subtracted from an auto height (for surrounding chrome).' },
    { name: 'columnWidth / featureColumnWidth', type: 'string', default: ', ', description: 'Default column width; width of the checkbox/feature column.' },
    { name: 'headerTemplate / nestedRowTemplate', type: 'string', default: ', ', description: 'Named templates for a custom header and for nested (detail) rows.' },
    { name: 'noDataMessage', type: 'string', default: `'No records'`, description: 'Empty-state text.' }
  ];
  columnProps = [
    { name: 'id', type: 'string', default: ', ', description: 'Unique column id (required).' },
    { name: 'field', type: 'string', default: ', ', description: 'Data property to read for the cell value.' },
    { name: 'label', type: 'string', default: ', ', description: 'Header text (required).' },
    { name: 'type', type: 'ColumnType', default: 'String', description: 'String | Number | Date | DateTime | Time | Boolean | Dropdown, drives default formatting & the inline editor.' },
    { name: 'format', type: 'ColumnFormat', default: ', ', description: `'currency' | 'stars' | 'percentage' | 'date' | 'datetime' | 'time', built-in value formatter.` },
    { name: 'sortable / filterable / groupable / pinnable / resizable / draggable', type: 'boolean', default: 'false', description: 'Per-column capabilities.' },
    { name: 'editable', type: 'boolean', default: 'false', description: 'Allow inline editing of this column.' },
    { name: 'valueOptions', type: '{ id, value }[]', default: ', ', description: 'Options for a Dropdown-type editable column.' },
    { name: 'cellTemplate / headerCellTemplate / footerCellTemplate', type: 'string', default: ', ', description: 'Names of <ng-template>s (inside <cw-grid>) that render the cell / header / footer.' },
    { name: 'children', type: 'ColumnDef[]', default: ', ', description: 'Child columns → a grouped (multi-row) header.' },
    { name: 'width / pinned / visible / alignment', type: 'string / boolean / boolean / string', default: ', ', description: 'Fixed width; starts pinned; starts hidden; text alignment.' }
  ];
  themeTokens = [
    { token: '--cw-surface', description: 'Grid card, header and row background.' },
    { token: '--cw-surface-sunken', description: 'Zebra / alternate-row background.' },
    { token: '--cw-surface-hover', description: 'Row hover background.' },
    { token: '--cw-border', description: 'Column resize divider & general borders.' },
    { token: '--cw-divider', description: 'Header/row hairlines & the table outline.' },
    { token: '--cw-row-border', description: 'Border between body rows.' },
    { token: '--cw-primary', description: 'Active pager page, selection & sort accent.' },
    { token: '--cw-text-on-accent', description: 'Text on the active pager page / accents.' },
    { token: '--cw-grid-group-fg', description: 'Group-row label colour.' },
    { token: '--cw-radius-md', description: 'Table & card corner radius.' }
  ];
}
