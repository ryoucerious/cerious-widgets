import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  numberAttribute,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * A numeric slider over a real native range input, with a primary-coloured
 * fill and an optional value bubble above the thumb (like the mock).
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-slider [(ngModel)]="volume" />
 * <cw-slider [min]="0" [max]="200" [step]="10" [showValue]="false" [(ngModel)]="limit" />
 */
@Component({
  selector: 'cw-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  host: {
    'class': 'cw-slider',
    '[class.cw-slider--disabled]': 'isDisabled()',
    '[class.cw-slider--with-value]': 'showValue()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SliderComponent), multi: true }
  ]
})
export class SliderComponent implements ControlValueAccessor {
  /** Minimum value. */
  readonly min = input(0, { transform: numberAttribute });
  /** Maximum value. */
  readonly max = input(100, { transform: numberAttribute });
  /** Step between values. */
  readonly step = input(1, { transform: numberAttribute });
  /** Show the value bubble above the thumb. */
  readonly showValue = input(true, { transform: booleanAttribute });
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly value = signal(0);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  /** Position of the thumb as a 0–100 percentage of the track. */
  readonly percent = computed(() => {
    const range = this.max() - this.min();
    if (range <= 0) {
      return 0;
    }
    const clamped = Math.min(Math.max(this.value(), this.min()), this.max());
    return ((clamped - this.min()) / range) * 100;
  });

  /**
   * The bubble tracks the thumb's centre: the thumb (16px) travels within
   * `100% - 16px`, so correct the raw percentage by the thumb radius.
   */
  readonly bubbleLeft = computed(() => {
    const p = this.percent();
    return `calc(${p}% + ${8 - p * 0.16}px)`;
  });

  onChange: (value: number) => void = () => {};
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.value.set(typeof value === 'number' && Number.isFinite(value) ? value : this.min());
  }
  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const next = Number((event.target as HTMLInputElement).value);
    this.value.set(next);
    this.onChange(next);
  }
}
