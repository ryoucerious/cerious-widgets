import { booleanAttribute, ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CwSeverity } from '../severity';

/**
 * An inline message bar for feedback: a soft severity-tinted surface with a
 * matching icon and text. Optionally closable (✕ emits `closed` and hides
 * the alert).
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-alert severity="success">Saved successfully.</cw-alert>
 * <cw-alert severity="danger" closable (closed)="onClosed()">Something went wrong.</cw-alert>
 */
@Component({
  selector: 'cw-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  host: {
    'class': 'cw-alert',
    'role': 'alert',
    '[attr.data-severity]': 'severity()',
    '[class.cw-alert--hidden]': 'hidden()'
  }
})
export class AlertComponent {
  /** Intent colour and icon. */
  readonly severity = input<CwSeverity>('info');
  /** Show a ✕ button that dismisses the alert. */
  readonly closable = input(false, { transform: booleanAttribute });

  /** Emitted when the ✕ button dismisses the alert. */
  readonly closed = output<void>();

  readonly hidden = signal(false);

  close(): void {
    this.hidden.set(true);
    this.closed.emit();
  }
}
