import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CwSeverity } from '../severity';

export type CwBadgeSize = 'small' | 'normal' | 'large';

/**
 * A small count or status indicator.
 *
 * Pure presentational, signal-based and OnPush, so it is inherently
 * zoneless-safe. Styled entirely with `--cw-*` design tokens.
 *
 * @example
 * <cw-badge [value]="8" severity="danger" />
 * <cw-badge dot severity="success" />
 */
@Component({
  selector: 'cw-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (!dot()) { {{ value() }} }`,
  styleUrl: './badge.component.scss',
  host: {
    'class': 'cw-badge',
    '[class.cw-badge--dot]': 'dot()',
    '[attr.data-severity]': 'severity()',
    '[attr.data-size]': 'size()'
  }
})
export class BadgeComponent {
  /** The text/number to display. Ignored when `dot` is set. */
  readonly value = input<string | number>('');
  /** Intent colour. */
  readonly severity = input<CwSeverity>('neutral');
  /** Visual size. */
  readonly size = input<CwBadgeSize>('normal');
  /** Render a small status dot instead of a value. */
  readonly dot = input(false, { transform: booleanAttribute });
}
