import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

export type CwProgressMode = 'determinate' | 'indeterminate';

/**
 * A horizontal progress indicator.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens. In
 * `determinate` mode the fill tracks `value` (0–100); `indeterminate` shows an
 * animated sweep. Exposes `role="progressbar"` with the appropriate ARIA.
 *
 * @example
 * <cw-progress-bar [value]="65" showValue />
 * <cw-progress-bar mode="indeterminate" />
 */
@Component({
  selector: 'cw-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cw-progress-bar__track">
      <div class="cw-progress-bar__fill" [style.width.%]="mode() === 'determinate' ? clampedValue() : null"></div>
    </div>
    @if (showValue() && mode() === 'determinate') {
      <span class="cw-progress-bar__label">{{ clampedValue() }}%</span>
    }
  `,
  styleUrl: './progress-bar.component.scss',
  host: {
    'class': 'cw-progress-bar',
    '[attr.data-mode]': 'mode()',
    'role': 'progressbar',
    '[attr.aria-valuemin]': 'mode() === "determinate" ? 0 : null',
    '[attr.aria-valuemax]': 'mode() === "determinate" ? 100 : null',
    '[attr.aria-valuenow]': 'mode() === "determinate" ? clampedValue() : null'
  }
})
export class ProgressBarComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ progressBar: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('progressBar', this.api);
  }

  /** Completion percentage (0–100), used in determinate mode. */
  readonly value = input<number>(0);
  /** Determinate (tracks `value`) or indeterminate (animated). */
  readonly mode = input<CwProgressMode>('determinate');
  /** Show the numeric percentage beside the bar. */
  readonly showValue = input(false, { transform: booleanAttribute });

  /** `value` clamped to the 0–100 range. */
  readonly clampedValue = computed(() => Math.max(0, Math.min(100, this.value())));
}
