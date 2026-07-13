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
import { providePluginHost } from '../../shared/plugin-host';
import { CwFormControlApi } from '../../shared/interfaces/widget-api.interface';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * A star rating control. Click a star to rate; click the current rating again
 * to clear it (when `cancelable`). Hover previews the would-be rating.
 * Keyboard: Left/Right adjust, Home/End jump, Delete/Backspace clear.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-rating [(ngModel)]="score" />
 * <cw-rating [stars]="10" readonly [ngModel]="7" />
 */
@Component({
  selector: 'cw-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  host: {
    'class': 'cw-rating',
    'role': 'radiogroup',
    '[class.cw-rating--disabled]': 'isDisabled()',
    '[class.cw-rating--readonly]': 'readonly()',
    '(mouseleave)': 'hovered.set(0)',
    '(keydown)': 'onKeydown($event)'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RatingComponent), multi: true }
  ]
})
export class RatingComponent implements ControlValueAccessor {
  /** Number of stars. */
  readonly stars = input(5, { transform: numberAttribute });
  /** Display-only: no pointer or keyboard interaction. */
  readonly readonly = input(false, { transform: booleanAttribute });
  /** Allow clicking the current rating again to clear it back to 0. */
  readonly cancelable = input(true, { transform: booleanAttribute });
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly value = signal(0);
  readonly hovered = signal(0);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());
  readonly isInteractive = computed(() => !this.isDisabled() && !this.readonly());
  readonly starIndexes = computed(() => Array.from({ length: this.stars() }, (_, i) => i + 1));
  /** The rating to paint: the hover preview when active, else the value. */
  readonly displayValue = computed(() => (this.isInteractive() && this.hovered() > 0 ? this.hovered() : this.value()));

  onChange: (value: number) => void = () => {};
  onTouched: () => void = () => {};

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ rating: { plugins: [...] } }`). */
  readonly api: CwFormControlApi<number> = {
    getHost: () => this.host.nativeElement,
    getValue: () => this.value(),
    setValue: (value: number) => { this.value.set(value); this.onChange(value); },
    isDisabled: () => this.isDisabled()
  };

  constructor() {
    providePluginHost('rating', this.api);
  }

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.value.set(typeof value === 'number' && Number.isFinite(value) ? value : 0);
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

  rate(star: number): void {
    if (!this.isInteractive()) {
      return;
    }
    const next = this.cancelable() && this.value() === star ? 0 : star;
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }

  onStarEnter(star: number): void {
    if (this.isInteractive()) {
      this.hovered.set(star);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isInteractive()) {
      return;
    }
    const set = (next: number) => {
      event.preventDefault();
      this.value.set(next);
      this.onChange(next);
    };
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        set(Math.min(this.value() + 1, this.stars()));
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        set(Math.max(this.value() - 1, 0));
        break;
      case 'Home':
        set(1);
        break;
      case 'End':
        set(this.stars());
        break;
      case 'Delete':
      case 'Backspace':
        set(0);
        break;
    }
  }
}
