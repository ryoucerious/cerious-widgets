import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, Inject, Input, signal, ViewEncapsulation } from '@angular/core';
import { ZonelessCompatibleComponent } from '../../../components/base/zoneless-compatible.component';
import { InputTextDirective } from '../../../components/input-text/input-text.directive';

import { ColumnFormat, ColumnType } from '../../enums';
import { ColumnDef } from '../../interfaces/column-def';
import { IGridRowColumnComponent } from '../../interfaces/component-interfaces/grid-row-column.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';

import { GridRow } from '../../models/grid-row';

import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { SectionClassConfig } from '../../interfaces';

// Display modes for the cell template. Precomputed once per column change so
// the template can run a single ngSwitch instead of four sibling *ngIf blocks
// — a meaningful win when a row recycle CDs N cells at once.
enum CellMode {
  Plain = 0,
  Template = 1,
  Editable = 2,
  Format = 3,
}

// Currency formatters are expensive to construct; cache by locale+currency.
const CURRENCY_FORMATTERS = new Map<string, Intl.NumberFormat>();
function getCurrencyFormatter(locale = 'en-US', currency = 'USD'): Intl.NumberFormat {
  const key = `${locale}|${currency}`;
  let f = CURRENCY_FORMATTERS.get(key);
  if (!f) {
    f = new Intl.NumberFormat(locale, { style: 'currency', currency });
    CURRENCY_FORMATTERS.set(key, f);
  }
  return f;
}

@Component({
  selector: 'cw-grid-row-column',
  standalone: true,
  templateUrl: './grid-row-column.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, InputTextDirective]
})
export class GridRowColumnComponent extends ZonelessCompatibleComponent implements IGridRowColumnComponent {

  readonly columnSignal = signal<ColumnDef | undefined>(undefined);
  readonly gridRowSignal = signal<GridRow | undefined>(undefined);

  @Input()
  set column(value: ColumnDef) { this.columnSignal.set(value); }
  get column() { return this.columnSignal()!; }

  @Input()
  set gridRow(value: GridRow) { this.gridRowSignal.set(value); }
  get gridRow() { return this.gridRowSignal()!; }

  readonly refreshTickSignal = signal(0);
  @Input()
  set refreshTick(value: number) { this.refreshTickSignal.set(value); }
  get refreshTick() { return this.refreshTickSignal(); }

  @Input() classes: SectionClassConfig = {};

  ColumnType = ColumnType;
  ColumnFormat = ColumnFormat;
  CellMode = CellMode;

  // Derived signals — recomputed only when their inputs change. During fast
  // scroll only `gridRow` flips per recycle, so width/alignment/mode are
  // served from cache and only `value` re-evaluates per cell.
  readonly width = computed(() => {
    // `getColumnWidth` reads `col.width`, a plain (non-signal) property that is
    // mutated in place during a live column-resize drag — so we depend on
    // `refreshTickSignal` (bumped per pointermove by the grid body) to force a
    // recompute. During scroll the tick is stable, so this stays memoized.
    this.refreshTickSignal();
    const col = this.columnSignal();
    return col ? this.gridColumnService.getColumnWidth(col, this.gridService.gridOptions) : undefined;
  });

  readonly alignment = computed(() => {
    const col = this.columnSignal();
    if (!col) return 'left';
    if (col.type === ColumnType.Number || col.format === 'currency' || col.format === 'percentage') {
      return col.alignment || 'right';
    }
    return col.alignment || 'left';
  });

  readonly cellMode = computed<CellMode>(() => {
    const col = this.columnSignal();
    if (!col) return CellMode.Plain;
    if (col.cellTemplate && this.gridService.templates[col.cellTemplate]) return CellMode.Template;
    if (col.editable) return CellMode.Editable;
    if (col.format) return CellMode.Format;
    return CellMode.Plain;
  });

  readonly cellTemplateRef = computed(() => {
    const col = this.columnSignal();
    return col?.cellTemplate ? this.gridService.templates[col.cellTemplate] : null;
  });

  readonly value = computed(() => {
    const col = this.columnSignal();
    const row = this.gridRowSignal();
    return col?.field && row ? row.row[col.field] : null;
  });

  readonly formattedValue = computed(() => {
    const col = this.columnSignal();
    const v = this.value();
    if (!col) return v;
    switch (col.format) {
      case ColumnFormat.Currency:
        return getCurrencyFormatter().format(v);
      case ColumnFormat.Percentage:
        return `${v}%`;
      case ColumnFormat.Stars:
        return Math.round(v);
      case ColumnFormat.Date:
        return new Date(v).toLocaleDateString();
      case ColumnFormat.DateTime:
        return new Date(v).toLocaleString();
      case ColumnFormat.Time:
        return new Date(v).toLocaleTimeString();
      default:
        return v;
    }
  });

  get templates() {
    return this.gridService.templates;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) {
    super();
  }

  dropdownTrackBy(index: number, item: any): any {
    return item.id || index;
  }

  // Retained for backwards-compatibility with the IGridRowColumnComponent
  // interface and any external template consumers; internally we read the
  // computed signals.
  getAlignment(): string { return this.alignment(); }
  getWidth(): string { return this.width() as string; }
  getFormattedValue(): any { return this.formattedValue(); }
  getValue(): any { return this.value(); }

  getStars(value: number): number[] {
    return Array(Math.round(value)).fill(0);
  }

  onValueChange(event: any): void {
    if (this.column.field) {
      this.gridRow.row[this.column.field] = this.column.type === ColumnType.Boolean
        ? event.target.checked
        : event.target.value;
      this.gridService.afterCellEdit.next(null);
    }
  }
}
