import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A scrollable container with slim, theme-styled scrollbars around its
 * projected content. Give it a bounded height via `height` (or CSS).
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-scroll-panel height="16rem">…long content…</cw-scroll-panel>
 */
@Component({
  selector: 'cw-scroll-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="cw-scroll-panel__viewport" [style.height]="height() || null" [style.max-height]="maxHeight() || null"><ng-content /></div>`,
  styleUrl: './scroll-panel.component.scss',
  host: { 'class': 'cw-scroll-panel' }
})
export class ScrollPanelComponent {
  /** Fixed viewport height (any CSS length). */
  readonly height = input<string>('');
  /** Maximum viewport height (any CSS length). */
  readonly maxHeight = input<string>('');
}
