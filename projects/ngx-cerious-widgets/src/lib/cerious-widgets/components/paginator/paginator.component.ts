import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
  output,
  signal
} from '@angular/core';

/** Emitted on every page / page-size change. */
export interface CwPageEvent {
  /** Zero-based page index. */
  page: number;
  /** Rows per page. */
  pageSize: number;
}

/**
 * A standalone paginator: first/prev, a numbered window with ellipsis,
 * next/last, an optional page-size select and a results summary — the same
 * chrome the grid pager uses, for any list.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-paginator [totalRecords]="200" [pageSize]="10" (pageChange)="load($event)" />
 */
@Component({
  selector: 'cw-paginator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  host: { 'class': 'cw-paginator' }
})
export class PaginatorComponent {
  /** Total number of rows being paged. */
  readonly totalRecords = input(0, { transform: numberAttribute });
  /** Initial rows per page. */
  readonly pageSize = input(10, { transform: numberAttribute });
  /** Page-size choices; empty hides the select. */
  readonly pageSizeOptions = input<readonly number[]>([10, 25, 50]);
  /** Initial zero-based page. */
  readonly page = input(0, { transform: numberAttribute });
  /** How many numbered buttons to show at once. */
  readonly windowSize = input(5, { transform: numberAttribute });

  // --- Per-part visibility (each region is independently toggleable) ---
  /** Show the rows-per-page select. */
  readonly showPageSize = input(true, { transform: booleanAttribute });
  /** Show the "Showing x to y of n" summary. */
  readonly showSummary = input(true, { transform: booleanAttribute });
  /** Show the first / last («, ») buttons. */
  readonly showFirstLast = input(true, { transform: booleanAttribute });
  /** Show the previous / next (‹, ›) buttons. */
  readonly showPrevNext = input(true, { transform: booleanAttribute });
  /** Show the numbered page buttons (and ellipses). */
  readonly showPageNumbers = input(true, { transform: booleanAttribute });

  /** Emitted on every page or page-size change. */
  readonly pageChange = output<CwPageEvent>();

  private readonly userPage = signal<number | undefined>(undefined);
  private readonly userPageSize = signal<number | undefined>(undefined);

  readonly currentPageSize = computed(() => this.userPageSize() ?? this.pageSize());
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.totalRecords() / Math.max(1, this.currentPageSize()))));
  readonly currentPage = computed(() => Math.min(this.userPage() ?? this.page(), this.pageCount() - 1));

  /** The numbered window: page indexes, with -1 marking an ellipsis. */
  readonly pageWindow = computed<number[]>(() => {
    const count = this.pageCount();
    const size = Math.max(3, this.windowSize());
    if (count <= size + 2) {
      return Array.from({ length: count }, (_, i) => i);
    }
    const current = this.currentPage();
    const half = Math.floor(size / 2);
    let start = Math.max(0, Math.min(current - half, count - size));
    const window = Array.from({ length: size }, (_, i) => start + i);
    const out: number[] = [];
    if (window[0] > 0) {
      out.push(0);
      if (window[0] > 1) {
        out.push(-1);
      }
    }
    out.push(...window);
    if (window[window.length - 1] < count - 1) {
      if (window[window.length - 1] < count - 2) {
        out.push(-1);
      }
      out.push(count - 1);
    }
    return out;
  });

  readonly rangeStart = computed(() => (this.totalRecords() === 0 ? 0 : this.currentPage() * this.currentPageSize() + 1));
  readonly rangeEnd = computed(() => Math.min((this.currentPage() + 1) * this.currentPageSize(), this.totalRecords()));

  goTo(page: number): void {
    const clamped = Math.min(Math.max(page, 0), this.pageCount() - 1);
    if (clamped === this.currentPage()) {
      return;
    }
    this.userPage.set(clamped);
    this.pageChange.emit({ page: clamped, pageSize: this.currentPageSize() });
  }

  onPageSizeChange(event: Event): void {
    const pageSize = Number((event.target as HTMLSelectElement).value);
    this.userPageSize.set(pageSize);
    this.userPage.set(0);
    this.pageChange.emit({ page: 0, pageSize });
  }
}
