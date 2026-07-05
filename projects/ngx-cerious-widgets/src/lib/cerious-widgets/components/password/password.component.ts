import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Strength buckets for the meter. */
type CwPasswordStrength = 'weak' | 'medium' | 'strong';

/**
 * A password input with a show/hide toggle and an optional strength meter.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-password [(ngModel)]="password" />
 * <cw-password [(ngModel)]="password" [feedback]="false" />
 */
@Component({
  selector: 'cw-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
  host: {
    'class': 'cw-password',
    '[class.cw-password--disabled]': 'isDisabled()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PasswordComponent), multi: true }
  ]
})
export class PasswordComponent implements ControlValueAccessor {
  /** Input placeholder. */
  readonly placeholder = input<string>('');
  /** Show the strength meter. */
  readonly feedback = input(true, { transform: booleanAttribute });
  /** Show the visibility toggle. */
  readonly toggleMask = input(true, { transform: booleanAttribute });
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly value = signal('');
  readonly revealed = signal(false);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  /** 0–4 strength score. */
  readonly score = computed(() => {
    const v = this.value();
    if (!v) {
      return 0;
    }
    let score = 0;
    if (v.length >= 8) score++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    return score;
  });

  readonly strength = computed<CwPasswordStrength | null>(() => {
    if (!this.value()) {
      return null;
    }
    const score = this.score();
    return score <= 1 ? 'weak' : score <= 3 ? 'medium' : 'strong';
  });

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.value.set(value == null ? '' : String(value));
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
  }

  toggleReveal(): void {
    this.revealed.update(v => !v);
  }
}
