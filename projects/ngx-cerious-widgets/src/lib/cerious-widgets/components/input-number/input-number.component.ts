import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  numberAttribute,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { providePluginHost } from '../../shared/plugin-host';
import { CwFormControlApi } from '../../shared/interfaces/widget-api.interface';
import { CW_LOCALE } from '../../shared/tokens/locale.token';

/**
 * A numeric input with stepper buttons, min/max clamping and optional
 * currency / decimal formatting.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-input-number [(ngModel)]="qty" [min]="0" [max]="99" />
 * <cw-input-number [(ngModel)]="price" mode="currency" currency="USD" />
 */
@Component({
  selector: 'cw-input-number',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
  host: {
    'class': 'cw-input-number',
    '[class.cw-input-number--disabled]': 'isDisabled()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputNumberComponent), multi: true }
  ]
})
export class InputNumberComponent implements ControlValueAccessor {
  /** Step for the +/- buttons and arrow keys. */
  readonly step = input(1, { transform: numberAttribute });
  /** Minimum value. */
  readonly min = input<number | null>(null);
  /** Maximum value. */
  readonly max = input<number | null>(null);
  /** Formatting mode. */
  readonly mode = input<'decimal' | 'currency'>('decimal');
  /** ISO currency code for `mode="currency"`. */
  readonly currency = input<string>('USD');
  /** BCP-47 locale for formatting (falls back to the app-wide `CW_LOCALE`, then the browser default). */
  readonly locale = input<string>('');
  /** Minimum fraction digits shown when not focused. */
  readonly minFractionDigits = input(0, { transform: numberAttribute });
  /** Maximum fraction digits shown when not focused. */
  readonly maxFractionDigits = input(2, { transform: numberAttribute });
  /** Show the +/- stepper buttons. */
  readonly showButtons = input(true, { transform: booleanAttribute });
  /** Input placeholder. */
  readonly placeholder = input<string>('');
  /** Accessible name for the input (when no visible label is associated). */
  readonly ariaLabel = input<string>('');
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly value = signal<number | null>(null);
  readonly focused = signal(false);
  private readonly cvaDisabled = signal(false);
  private readonly appLocale = inject(CW_LOCALE);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  /** Per-instance `locale` input, else the app-wide `CW_LOCALE`, else browser default. */
  private readonly effectiveLocale = computed(() => this.locale() || this.appLocale || undefined);

  /** While focused, show the raw number; otherwise the formatted string. */
  readonly displayValue = computed(() => {
    const value = this.value();
    if (value == null) {
      return '';
    }
    if (this.focused()) {
      return String(value);
    }
    return value.toLocaleString(this.effectiveLocale(), {
      style: this.mode() === 'currency' ? 'currency' : 'decimal',
      currency: this.currency(),
      minimumFractionDigits: this.minFractionDigits(),
      maximumFractionDigits: this.maxFractionDigits()
    });
  });

  readonly canDecrement = computed(() => {
    const min = this.min();
    return !this.isDisabled() && (min == null || (this.value() ?? 0) > min);
  });
  readonly canIncrement = computed(() => {
    const max = this.max();
    return !this.isDisabled() && (max == null || (this.value() ?? 0) < max);
  });

  onChange: (value: number | null) => void = () => {};

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ inputNumber: { plugins: [...] } }`). */
  readonly api: CwFormControlApi<number | null> = {
    getHost: () => this.host.nativeElement,
    getValue: () => this.value(),
    setValue: (value: number | null) => { this.value.set(value); this.onChange(value); },
    isDisabled: () => this.isDisabled()
  };

  constructor() {
    providePluginHost('inputNumber', this.api);
  }
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.value.set(typeof value === 'number' && Number.isFinite(value) ? value : null);
  }
  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    if (raw === '' || raw === '-') {
      this.value.set(null);
      this.onChange(null);
      return;
    }
    const parsed = Number(raw.replace(/[^0-9.\-]/g, ''));
    if (Number.isFinite(parsed)) {
      this.value.set(parsed);
      this.onChange(parsed);
    }
  }

  onFocus(): void {
    this.focused.set(true);
  }

  onBlur(): void {
    this.focused.set(false);
    // Clamp to range on blur.
    const clamped = this.clamp(this.value());
    if (clamped !== this.value()) {
      this.value.set(clamped);
      this.onChange(clamped);
    }
    this.onTouched();
  }

  increment(delta: number): void {
    if (this.isDisabled()) {
      return;
    }
    const next = this.clamp((this.value() ?? 0) + delta);
    this.value.set(next);
    this.onChange(next);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.increment(this.step());
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.increment(-this.step());
    }
  }

  private clamp(value: number | null): number | null {
    if (value == null) {
      return null;
    }
    const min = this.min();
    const max = this.max();
    let next = value;
    if (min != null) {
      next = Math.max(next, min);
    }
    if (max != null) {
      next = Math.min(next, max);
    }
    return next;
  }
}
