import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  Directive,
  ElementRef,
  inject,
  input,
  TemplateRef,
  viewChild
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';
import { CeriousScrollComponent, CeriousScrollDirective, CeriousScrollItemTemplateDirective } from '@ceriousdevtech/ngx-cerious-scroll';

/**
 * Marks the row template for {@link VirtualScrollerComponent}:
 * `<ng-template cwVirtualScrollerItem let-item let-index="index">…</ng-template>`.
 */
@Directive({ selector: '[cwVirtualScrollerItem]', standalone: true })
export class VirtualScrollerItemDirective {
  readonly template = inject(TemplateRef<unknown>);
}

/**
 * A standalone virtual list: renders only the visible rows of a large
 * collection through the `@ceriousdevtech/ngx-cerious-scroll` engine, using a
 * projected row template.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-virtual-scroller [items]="rows" scrollHeight="400px">
 *   <ng-template cwVirtualScrollerItem let-item let-i="index">{{ i }}: {{ item }}</ng-template>
 * </cw-virtual-scroller>
 */
@Component({
  selector: 'cw-virtual-scroller',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, CeriousScrollComponent, CeriousScrollItemTemplateDirective],
  template: `
    <cerious-scroll [items]="getItem() ? null : items()" [totalElements]="totalElements()" [getItem]="getItem()">
      <ng-template ceriousScrollItem let-item let-index="index">
        <div class="cw-virtual-scroller__row">
          @if (itemTemplate(); as tpl) {
            <ng-container [ngTemplateOutlet]="tpl.template" [ngTemplateOutletContext]="{ $implicit: item, index }" />
          }
        </div>
      </ng-template>
    </cerious-scroll>
  `,
  styleUrl: './virtual-scroller.component.scss',
  host: { 'class': 'cw-virtual-scroller', '[style.height]': 'scrollHeight()' }
})
export class VirtualScrollerComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ virtualScroller: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('virtualScroller', this.api);
  }

  readonly itemTemplate = contentChild(VirtualScrollerItemDirective);
  /** The underlying scroll directive, exposed for imperative control. */
  readonly scroller = viewChild(CeriousScrollDirective);

  /** The full collection to virtualize. */
  readonly items = input<readonly unknown[]>([]);
  /**
   * Total row count when you don't want to materialize the whole collection.
   * Pair with {@link getItem} to virtualize huge (e.g. 1,000,000-row) datasets
   * without allocating a giant array. Ignored when `items` is provided.
   */
  readonly totalElements = input<number | null>(null);
  /**
   * Lazy item accessor: `(index) => item`. Used instead of `items` for very
   * large datasets — the engine only ever asks for the indices it renders.
   */
  readonly getItem = input<((index: number) => unknown) | null>(null);
  /** Viewport height (any CSS length). */
  readonly scrollHeight = input<string>('400px');

  /** Jump the viewport to an item index. */
  scrollToIndex(index: number): void {
    this.scroller()?.jumpToElement(index);
  }
}
