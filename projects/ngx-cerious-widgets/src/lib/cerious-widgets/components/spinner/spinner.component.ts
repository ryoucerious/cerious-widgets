import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * An indeterminate loading spinner.
 *
 * Pure CSS animation in the accent token colour; signal-based and OnPush
 * (zoneless-safe). Exposes `role="status"` with an accessible label.
 *
 * @example
 * <cw-spinner />
 * <cw-spinner size="3rem" [strokeWidth]="5" label="Loading rows" />
 */
@Component({
  selector: 'cw-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="cw-spinner__ring" [style.width]="size()" [style.height]="size()" [style.borderWidth.px]="strokeWidth()"></span>`,
  styleUrl: './spinner.component.scss',
  host: {
    'class': 'cw-spinner',
    'role': 'status',
    '[attr.aria-label]': 'label()',
    '[attr.aria-busy]': 'true'
  }
})
export class SpinnerComponent {
  /** Diameter as any CSS length (e.g. '2rem', '32px'). */
  readonly size = input<string>('2rem');
  /** Ring thickness in pixels. */
  readonly strokeWidth = input<number>(4);
  /** Accessible label announced by screen readers. */
  readonly label = input<string>('Loading');
}
