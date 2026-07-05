import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CwSeverity } from '../severity';

/**
 * A labelled tag/pill used to categorise or highlight content.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 * Projected content renders after the value, e.g. a trailing remove button.
 *
 * @example
 * <cw-tag value="Active" severity="success" />
 * <cw-tag value="New" rounded />
 */
@Component({
  selector: 'cw-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (icon()) { <i class="cw-tag__icon" [class]="icon()"></i> }<span class="cw-tag__label">{{ value() }}</span><ng-content />`,
  styleUrl: './tag.component.scss',
  host: {
    'class': 'cw-tag',
    '[class.cw-tag--rounded]': 'rounded()',
    '[attr.data-severity]': 'severity()'
  }
})
export class TagComponent {
  /** The tag label. */
  readonly value = input<string>('');
  /** Intent colour. */
  readonly severity = input<CwSeverity>('neutral');
  /** Use a fully rounded (pill) shape instead of the default radius. */
  readonly rounded = input(false, { transform: booleanAttribute });
  /** Optional leading icon class (e.g. a font-icon class). */
  readonly icon = input<string>('');
}
