import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ColumnDef, GridComponent, GridOptions, PluginOptions, TagComponent } from 'ngx-cerious-widgets';
import { baseColumns, GRID_DATA, GRID_DATA_LARGE, statusSeverity } from './grid-data';

/**
 * One component powers every Grid feature sub-page. The active feature comes
 * from the route's `data.feature`; we build the matching columns, gridOptions
 * and pluginOptions for it. No performance/stats header — just the grid.
 */
@Component({
  selector: 'app-grid-feature',
  standalone: true,
  imports: [CommonModule, GridComponent, TagComponent],
  templateUrl: './grid-feature.component.html',
  styleUrl: './grid-feature.component.scss'
})
export class GridFeaturePageComponent implements OnInit {
  title = '';
  description = '';
  data: any[] = [];
  gridOptions?: GridOptions;
  pluginOptions: PluginOptions = {};
  readonly statusSeverity = statusSeverity;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.data.subscribe(d => {
      this.title = d['title'] ?? 'Grid';
      this.description = d['description'] ?? '';
      // Tear the current grid down, then build a fresh one for the new feature
      // so each demo starts from clean state.
      this.gridOptions = undefined;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.configure(d['feature']);
        this.cdr.detectChanges();
      });
    });
  }

  private configure(feature: string): void {
    const cols = baseColumns();
    const options: GridOptions = {
      columnDefs: cols,
      columnWidth: '150px',
      height: 'auto',
      // 20 base + 16 for the grid card's vertical gutter (8px top + 8px
      // bottom) + 6 for the toolbar's bottom margin
      heightOffset: 42,
      showFooter: false,
      showMenuBar: false,
      showPager: false,
      enableVirtualScroll: true,
      noDataMessage: 'No records found.'
    };
    let pluginOptions: PluginOptions = {};
    let data = GRID_DATA;

    switch (feature) {
      case 'selection':
        options.enableMultiselect = true;
        break;

      case 'sorting':
        options.showMenuBar = true;
        pluginOptions = { MultiSort: { enableMultiSort: true } };
        break;

      case 'filtering':
        options.showMenuBar = true;
        pluginOptions = { GlobalTextFilter: { enableGlobalTextFilter: true } };
        break;

      case 'grouping':
        options.showMenuBar = true;
        options.enableGroupBy = true;
        pluginOptions = { ColumnMenu: { enableColumnMenu: true, enableGroupBy: true } };
        break;

      case 'pinning':
        options.enablePinning = true;
        this.pin(cols, 'id');
        this.pin(cols, 'name');
        pluginOptions = { ColumnMenu: { enableColumnMenu: true, enablePinning: true } };
        options.showMenuBar = true;
        break;

      case 'column-menu':
        options.showMenuBar = true;
        options.enableGroupBy = true;
        options.enablePinning = true;
        pluginOptions = { ColumnMenu: { enableColumnMenu: true, enablePinning: true, enableGroupBy: true }, ColumnVisibility: { enableColumnVisibility: true } };
        break;

      case 'editing':
        this.edit(cols, 'name');
        this.edit(cols, 'category');
        this.edit(cols, 'price');
        this.edit(cols, 'stock');
        break;

      case 'templates':
        this.setCol(cols, 'status', c => (c.cellTemplate = 'statusTemplate'));
        break;

      case 'pagination':
        options.showPager = true;
        options.pageSize = 10;
        options.enableVirtualScroll = false;
        break;

      case 'export':
        options.showMenuBar = true;
        pluginOptions = { ExportToExcel: { enableExportToExcel: true } };
        break;

      case 'virtual-scroll':
        data = GRID_DATA_LARGE;
        break;

      case 'basic':
      default:
        break;
    }

    this.data = data;
    this.pluginOptions = pluginOptions;
    this.gridOptions = options;
  }

  private setCol(cols: ColumnDef[], id: string, fn: (c: ColumnDef) => void): void {
    const col = cols.find(c => c.id === id);
    if (col) {
      fn(col);
    }
  }

  private edit(cols: ColumnDef[], id: string): void {
    this.setCol(cols, id, c => (c.editable = true));
  }

  private pin(cols: ColumnDef[], id: string): void {
    this.setCol(cols, id, c => (c.pinned = true));
  }
}
