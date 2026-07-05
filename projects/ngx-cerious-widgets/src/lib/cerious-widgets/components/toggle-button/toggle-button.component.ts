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

/**
 * A two-state button: shows `onLabel` / `offLabel` and toggles a boolean.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-toggle-button onLabel="Following" offLabel="Follow" [(ngModel)]="following" />
 */
@Component({
  selector: 'cw-toggle-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="cw-toggle-button__btn"
      [class.cw-toggle-button__btn--on]="checked()"
      [attr.aria-pressed]="checked()"
      [disabled]="isDisabled()"
      (click)="toggle()"
      (blur)="onTouched()"
    >{{ checked() ? onLabel() : offLabel() }}</button>
  `,
  styleUrl: './toggle-button.component.scss',
  host: { 'class': 'cw-toggle-button' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ToggleButtonComponent), multi: true }
  ]
})
export class ToggleButtonComponent implements ControlValueAccessor {
  /** Label while on. */
  readonly onLabel = input<string>('On');
  /** Label while off. */
  readonly offLabel = input<string>('Off');
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly checked = signal(false);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  toggle(): void {
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
  }
}
