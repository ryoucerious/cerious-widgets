import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  Directive,
  inject,
  input,
  TemplateRef,
  viewChild
} from '@angular/core';
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
    <cerious-scroll [items]="items()">
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
  readonly itemTemplate = contentChild(VirtualScrollerItemDirective);
  /** The underlying scroll directive, exposed for imperative control. */
  readonly scroller = viewChild(CeriousScrollDirective);

  /** The full collection to virtualize. */
  readonly items = input<readonly unknown[]>([]);
  /** Viewport height (any CSS length). */
  readonly scrollHeight = input<string>('400px');

  /** Jump the viewport to an item index. */
  scrollToIndex(index: number): void {
    this.scroller()?.jumpToElement(index);
  }
}
