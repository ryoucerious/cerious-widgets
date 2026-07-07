import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  inject,
  input,
  output,
  signal,
  TemplateRef
} from '@angular/core';

/** A column definition for {@link TableComponent}. */
export interface CwTableColumn {
  /** Data property to read for the cell (and the sort key). */
  field: string;
  /** Header label. */
  header: string;
  /** Cell text alignment. */
  align?: 'left' | 'center' | 'right';
  /** Allow click-to-sort on this column. */
  sortable?: boolean;
  /** Fixed column width (any CSS length). */
  width?: string;
}

export interface CwTableSort {
  field: string;
  order: 1 | -1;
}

/**
 * Marks a custom cell template for a column, keyed by field:
 * `<ng-template cwColumn="status" let-row let-value="value">…</ng-template>`.
 * The template context is `{ $implicit: row, value, column }`.
 */
@Directive({ selector: '[cwColumn]', standalone: true })
export class TableColumnDirective {
  /** The `field` of the column this template renders. */
  readonly field = input.required<string>({ alias: 'cwColumn' });
  readonly template = inject(TemplateRef<unknown>);
}

/**
 * A lightweight, semantic data table for straightforward tabular data — a
 * simpler alternative to the virtualized {@link GridComponent}. Give it
 * `columns` + `value`; opt into striping, row hover, sizing and click-to-sort.
 * Render any cell yourself with an `[cwColumn]` template.
 *
 * Signal-based and OnPush, styled with `--cw-*` tokens.
 *
 * @example
 * <cw-table [columns]="cols" [value]="rows" striped hoverable>
 *   <ng-template cwColumn="status" let-value="value">
 *     <cw-tag [value]="value" />
 *   </ng-template>
 * </cw-table>
 */
@Component({
  selector: 'cw-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  host: { 'class': 'cw-table-host' }
})
export class TableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Column definitions. */
  readonly columns = input<readonly CwTableColumn[]>([]);
  /** Row data. */
  readonly value = input<readonly T[]>([]);
  /** Zebra-striped rows. */
  readonly striped = input(false, { transform: booleanAttribute });
  /** Highlight rows on hover. */
  readonly hoverable = input(false, { transform: booleanAttribute });
  /** Compact / comfortable / spacious cell padding. */
  readonly size = input<'small' | 'normal' | 'large'>('normal');
  /** Show a border around the table + between rows. */
  readonly bordered = input(false, { transform: booleanAttribute });
  /** Text shown when there are no rows. */
  readonly emptyMessage = input<string>('No records found.');

  /** Emitted when the sort column/order changes (click-to-sort). */
  readonly sortChange = output<CwTableSort | null>();
  /** Emitted when a row is clicked. */
  readonly rowClick = output<T>();

  private readonly columnTemplates = contentChildren(TableColumnDirective);
  private readonly sortState = signal<CwTableSort | null>(null);

  readonly sort = this.sortState.asReadonly();

  /** Rows in display order (sorted client-side when a sort is active). */
  readonly rows = computed<readonly T[]>(() => {
    const sort = this.sortState();
    const data = this.value();
    if (!sort) {
      return data;
    }
    const { field, order } = sort;
    return [...data].sort((a, b) => {
      const av = a[field] as unknown, bv = b[field] as unknown;
      if (av == null) return 1;
      if (bv == null) return -1;
      return av < bv ? -order : av > bv ? order : 0;
    });
  });

  templateFor(field: string): TemplateRef<unknown> | undefined {
    return this.columnTemplates().find(t => t.field() === field)?.template;
  }

  toggleSort(column: CwTableColumn): void {
    if (!column.sortable) {
      return;
    }
    const current = this.sortState();
    let next: CwTableSort | null;
    if (!current || current.field !== column.field) {
      next = { field: column.field, order: 1 };
    } else if (current.order === 1) {
      next = { field: column.field, order: -1 };
    } else {
      next = null; // third click clears the sort
    }
    this.sortState.set(next);
    this.sortChange.emit(next);
  }

  sortIndicator(column: CwTableColumn): '' | 'asc' | 'desc' {
    const s = this.sortState();
    return s && s.field === column.field ? (s.order === 1 ? 'asc' : 'desc') : '';
  }
}
