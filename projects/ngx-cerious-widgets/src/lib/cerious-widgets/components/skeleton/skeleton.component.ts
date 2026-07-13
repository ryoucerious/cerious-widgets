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

export type CwSkeletonShape = 'rect' | 'circle';

/**
 * A shimmering placeholder shown while content loads.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 * Decorative only, so it is hidden from assistive tech.
 *
 * @example
 * <cw-skeleton width="12rem" height="1rem" />
 * <cw-skeleton shape="circle" width="2.5rem" height="2.5rem" />
 */
@Component({
  selector: 'cw-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './skeleton.component.scss',
  host: {
    'class': 'cw-skeleton',
    'aria-hidden': 'true',
    '[class.cw-skeleton--animated]': 'animation()',
    '[attr.data-shape]': 'shape()',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    '[style.borderRadius]': 'resolvedRadius()'
  }
})
export class SkeletonComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ skeleton: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('skeleton', this.api);
  }

  /** Any CSS width (e.g. '100%', '12rem'). */
  readonly width = input<string>('100%');
  /** Any CSS height (e.g. '1rem'). */
  readonly height = input<string>('1rem');
  /** Rectangle (default) or circle. */
  readonly shape = input<CwSkeletonShape>('rect');
  /** Explicit border radius; ignored for circles. */
  readonly borderRadius = input<string>('');
  /** Whether the shimmer animation plays. */
  readonly animation = input(true, { transform: booleanAttribute });

  /** Circles are fully rounded; otherwise use the override or the token radius. */
  readonly resolvedRadius = computed(() =>
    this.shape() === 'circle' ? '50%' : (this.borderRadius() || 'var(--cw-radius)')
  );
}
