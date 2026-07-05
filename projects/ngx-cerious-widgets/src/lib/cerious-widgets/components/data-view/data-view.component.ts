import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  inject,
  input,
  numberAttribute,
  signal,
  TemplateRef
} from '@angular/core';
import { CeriousScrollComponent, CeriousScrollItemTemplateDirective } from '@ceriousdevtech/ngx-cerious-scroll';
import { PaginatorComponent, CwPageEvent } from '../paginator/paginator.component';

/**
 * Marks the item template for {@link DataViewComponent}:
 * `<ng-template cwDataViewItem let-item let-layout="layout">…</ng-template>`.
 */
@Directive({ selector: '[cwDataViewItem]', standalone: true })
export class DataViewItemDirective {
  readonly template = inject(TemplateRef<unknown>);
}

/** DataView layout. */
export type CwDataViewLayout = 'list' | 'grid';

/**
 * Renders a collection of items in a list or grid layout using a projected
 * item template. Paginate with `rows`, or leave it unset and a large **list**
 * is **virtualized with cerious-scroll**.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-data-view [value]="products" layout="grid" [rows]="12">
 *   <ng-template cwDataViewItem let-item>{{ item.name }}</ng-template>
 * </cw-data-view>
 */
@Component({
  selector: 'cw-data-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, CeriousScrollComponent, CeriousScrollItemTemplateDirective, PaginatorComponent],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.scss',
  host: {
    'class': 'cw-data-view',
    '[attr.data-layout]': 'layout()'
  }
})
export class DataViewComponent {
  readonly itemTemplate = contentChild(DataViewItemDirective);

  /** The full collection. */
  readonly value = input<readonly unknown[]>([]);
  /** List (default) or grid layout. */
  readonly layout = input<CwDataViewLayout>('list');
  /** Rows per page; 0 disables pagination. */
  readonly rows = input(0, { transform: numberAttribute });
  /** Minimum column width for the grid (any CSS length). */
  readonly gridMinColumn = input<string>('14rem');
  /** List height when virtualized (any CSS length). */
  readonly listHeight = input<string>('420px');
  /** Virtualize a non-paginated list at or above this item count. */
  readonly virtualThreshold = input(100, { transform: numberAttribute });
  /** Text shown when there are no items. */
  readonly emptyMessage = input<string>('No records found.');

  private readonly page = signal(0);
  private readonly pageSize = signal(0);

  readonly effectivePageSize = computed(() => this.pageSize() || this.rows());
  readonly paginated = computed(() => this.effectivePageSize() > 0);

  /** Items visible on the current page (or all, when not paginated). */
  readonly pageItems = computed<unknown[]>(() => {
    const all = this.value();
    if (!this.paginated()) {
      return [...all];
    }
    const size = this.effectivePageSize();
    const start = this.page() * size;
    return all.slice(start, start + size);
  });

  /** Virtualize only a large, non-paginated list. */
  readonly useVirtual = computed(() =>
    this.layout() === 'list' && !this.paginated() && this.value().length >= this.virtualThreshold()
  );

  onPageChange(event: CwPageEvent): void {
    this.page.set(event.page);
    this.pageSize.set(event.pageSize);
  }
}
