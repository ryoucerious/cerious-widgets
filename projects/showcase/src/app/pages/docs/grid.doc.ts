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
import { columns, makeProducts, statusSeverity, withCol } from './grid-data';

type FeatureId =
  | 'basic' | 'sorting' | 'filtering' | 'grouping' | 'selection' | 'pinning'
  | 'column-menu' | 'editing' | 'templates' | 'pagination' | 'export' | 'virtual';

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
    { id: 'templates', label: 'Cell templates', title: 'Custom cell rendering', blurb: 'Point a column at a named <ng-template> (declared inside <cw-grid>) to render its cells however you like — here the status column becomes a coloured Tag. Templates receive the cell value and row.', code: `{ id: 'status', field: 'status', cellTemplate: 'statusTemplate' }

<cw-grid [data]="data" [gridOptions]="options">
  <ng-template #statusTemplate let-value="value">
    <cw-tag [value]="value" [severity]="statusSeverity(value)" />
  </ng-template>
</cw-grid>` },
    { id: 'pagination', label: 'Pagination', title: 'Paged grid', blurb: 'Prefer pages over infinite scroll? Turn on the pager and set a page size. (Pagination and virtual scroll are mutually exclusive.)', code: `<cw-grid [data]="data" [gridOptions]="{ showPager: true, pageSize: 12, enableVirtualScroll: false }" />` },
    { id: 'export', label: 'Excel export', title: 'Export to Excel', blurb: 'With the ExportToExcel plugin registered, an export action appears in the menu bar and downloads the current (sorted/filtered) rows as an .xlsx file.', code: `<cw-grid [data]="data" [gridOptions]="{ showMenuBar: true }"
  [pluginOptions]="{ ExportToExcel: { enableExportToExcel: true } }" />

// main.ts
CeriousWidgetsModule.forRoot({ plugins: [ExportToExcelPlugin] })` },
    { id: 'virtual', label: 'Virtual scroll', title: '100,000 rows, virtualized', blurb: 'The body renders through ngx-cerious-scroll, so only the ~20 visible rows exist in the DOM at any time — scrolling a hundred thousand rows stays smooth. Bound the viewport height via bodyClasses (or a full-height container).', code: `<cw-grid [data]="bigData"
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

  registerCode = `// Register the grid plugins you need — once, at bootstrap.
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
      case 'pagination':
        options.enableVirtualScroll = false;
        options.showPager = true;
        options.pageSize = 12;
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
  optionProps = [
    { name: 'columnDefs', type: 'ColumnDef[]', default: '[]', description: 'Column definitions (see the ColumnDef table).' },
    { name: 'enableVirtualScroll', type: 'boolean', default: 'false', description: 'Virtualize the body via ngx-cerious-scroll.' },
    { name: 'showMenuBar', type: 'boolean', default: 'false', description: 'Show the toolbar that hosts plugin actions (filter, export, visibility…).' },
    { name: 'showPager / pageSize', type: 'boolean / number', default: 'false / —', description: 'Enable pagination and set the page size.' },
    { name: 'enableMultiselect', type: 'boolean', default: 'false', description: 'Checkbox column + selectable rows.' },
    { name: 'enableGroupBy', type: 'boolean', default: 'false', description: 'Allow grouping (with the ColumnMenu plugin).' },
    { name: 'enablePinning', type: 'boolean', default: 'false', description: 'Allow column pinning.' },
    { name: 'showFooter', type: 'boolean', default: 'false', description: 'Show the footer/aggregate row.' },
    { name: 'noDataMessage', type: 'string', default: `'No records'`, description: 'Empty-state text.' }
  ];
  columnProps = [
    { name: 'id / field / label', type: 'string', default: '—', description: 'Unique id, data field to read, and header label.' },
    { name: 'type', type: 'ColumnType', default: 'String', description: 'String | Number | Date | Boolean — drives default formatting & editors.' },
    { name: 'sortable / filterable / groupable / pinnable / resizable / draggable', type: 'boolean', default: 'false', description: 'Per-column capabilities.' },
    { name: 'editable', type: 'boolean', default: 'false', description: 'Allow inline editing of this column.' },
    { name: 'cellTemplate', type: 'string', default: '—', description: 'Name of an <ng-template> inside <cw-grid> used to render the cell.' },
    { name: 'format', type: `'currency' | 'stars' | …`, default: '—', description: 'Built-in value formatter.' },
    { name: 'width / pinned', type: 'string / boolean', default: '—', description: 'Fixed width; whether the column starts pinned.' }
  ];
  gridProps = [
    { name: 'data', type: 'T[]', default: 'null', description: 'Row data.' },
    { name: 'gridOptions', type: 'GridOptions', default: '—', description: 'Column defs + behaviour (see GridOptions table).' },
    { name: 'pluginOptions', type: 'PluginOptions', default: '{}', description: 'Per-plugin configuration (see the Plugins tab).' },
    { name: 'bodyClasses / headerClasses / …', type: 'SectionClassConfig', default: '{}', description: 'CSS classes for grid sections (e.g. to bound the virtual viewport height).' }
  ];
  themeTokens = [
    { token: '--cw-surface / --cw-surface-sunken', description: 'Row & zebra backgrounds.' },
    { token: '--cw-border / --cw-divider', description: 'Header, row and table borders.' },
    { token: '--cw-primary', description: 'Active pager page, selection & sort accent.' },
    { token: '--cw-grid-group-fg', description: 'Group-row label colour.' },
    { token: '--cw-surface-hover', description: 'Row hover background.' }
  ];
}
