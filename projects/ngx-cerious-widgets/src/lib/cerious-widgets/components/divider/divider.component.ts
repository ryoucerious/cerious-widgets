import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/** Divider orientation. */
export type CwDividerLayout = 'horizontal' | 'vertical';
/** Divider line style. */
export type CwDividerType = 'solid' | 'dashed';
/** Where the projected label sits on a horizontal divider. */
export type CwDividerAlign = 'left' | 'center' | 'right';

/**
 * A separator line between content, horizontal (default) or vertical.
 * Projected content renders as an inline label on the line.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-divider />
 * <cw-divider align="center">OR</cw-divider>
 * <cw-divider layout="vertical" />
 */
@Component({
  selector: 'cw-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="cw-divider__content"><ng-content /></span>`,
  styleUrl: './divider.component.scss',
  host: {
    'class': 'cw-divider',
    'role': 'separator',
    '[attr.aria-orientation]': 'layout()',
    '[attr.data-layout]': 'layout()',
    '[attr.data-type]': 'type()',
    '[attr.data-align]': 'align()'
  }
})
export class DividerComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ divider: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('divider', this.api);
  }

  /** Orientation: horizontal (default) or vertical. */
  readonly layout = input<CwDividerLayout>('horizontal');
  /** Line style: solid (default) or dashed. */
  readonly type = input<CwDividerType>('solid');
  /** Label position on a horizontal divider. */
  readonly align = input<CwDividerAlign>('center');
}
