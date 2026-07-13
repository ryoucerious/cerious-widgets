import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

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
  template: `<div class="cw-scroll-panel__viewport" tabindex="0" role="region" [attr.aria-label]="ariaLabel()" [style.height]="height() || null" [style.max-height]="maxHeight() || null"><ng-content /></div>`,
  styleUrl: './scroll-panel.component.scss',
  host: { 'class': 'cw-scroll-panel' }
})
export class ScrollPanelComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ scrollPanel: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('scrollPanel', this.api);
  }

  /** Fixed viewport height (any CSS length). */
  readonly height = input<string>('');
  /** Maximum viewport height (any CSS length). */
  readonly maxHeight = input<string>('');
  /**
   * Accessible name for the scrollable viewport. The viewport is keyboard
   * focusable (so it can be scrolled with the arrow keys) and exposed as a
   * `region`, which requires a name — this defaults to a generic one but should
   * be set to something meaningful when the surrounding context doesn't make the
   * region's purpose obvious.
   */
  readonly ariaLabel = input<string>('Scrollable content');
}
