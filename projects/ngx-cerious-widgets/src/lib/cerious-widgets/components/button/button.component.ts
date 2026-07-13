import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

export type CwButtonSeverity = 'primary' | 'secondary' | 'success' | 'warn' | 'danger';
export type CwButtonVariant = 'filled' | 'outlined' | 'text';
export type CwButtonSize = 'small' | 'normal' | 'large';

/**
 * A themeable button. Applied as an attribute to a native `<button>` or `<a>`
 * so focus, keyboard, and form submission stay native.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens. In the
 * `loading` state it shows the {@link SpinnerComponent} and is disabled.
 *
 * @example
 * <button cwButton (click)="save()">Save</button>
 * <button cwButton severity="danger" variant="outlined" [loading]="busy">Delete</button>
 */
@Component({
  selector: 'button[cwButton], a[cwButton]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpinnerComponent],
  template: `
    @if (loading()) {
      <cw-spinner class="cw-button__spinner" size="1em" [strokeWidth]="2" />
    } @else if (icon()) {
      <i class="cw-button__icon" [class]="icon()"></i>
    }
    <ng-content />
  `,
  styleUrl: './button.component.scss',
  host: {
    'class': 'cw-button',
    '[attr.data-severity]': 'severity()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[class.cw-button--loading]': 'loading()',
    '[attr.disabled]': '(disabled() || loading()) ? "" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null'
  }
})
export class ButtonComponent {
  /** Intent colour. */
  readonly severity = input<CwButtonSeverity>('primary');
  /** Filled (default), outlined, or text-only style. */
  readonly variant = input<CwButtonVariant>('filled');
  /** Visual size. */
  readonly size = input<CwButtonSize>('normal');
  /** Show a spinner and disable interaction. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** Disable the button. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Optional leading icon class (hidden while loading). */
  readonly icon = input<string>('');
}
