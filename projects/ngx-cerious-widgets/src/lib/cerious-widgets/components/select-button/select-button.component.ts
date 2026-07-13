import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** A normalized option: display label + underlying value. */
interface CwOption {
  label: string;
  value: unknown;
}

/**
 * A segmented button group for a single choice — like the showcase's
 * Light/Frost/Dark theme switcher.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-select-button [options]="['Low', 'Medium', 'High']" [(ngModel)]="priority" />
 */
@Component({
  selector: 'cw-select-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (option of normalizedOptions(); track $index) {
      <button
        type="button"
        class="cw-select-button__option"
        [class.cw-select-button__option--selected]="option.value === value()"
        [attr.aria-pressed]="option.value === value()"
        [disabled]="isDisabled()"
        (click)="select(option)"
      >{{ option.label }}</button>
    }
  `,
  styleUrl: './select-button.component.scss',
  host: {
    'class': 'cw-select-button',
    'role': 'group',
    '[class.cw-select-button--disabled]': 'isDisabled()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectButtonComponent), multi: true }
  ]
})
export class SelectButtonComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ selectButton: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('selectButton', this.api);
  }

  /** The choices — objects, or primitives for a simple list. */
  readonly options = input<readonly unknown[]>([]);
  /** Property name to read an option's display label from (for object options). */
  readonly optionLabel = input<string>('label');
  /** Property name to read an option's value from (for object options). */
  readonly optionValue = input<string>('value');
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly value = signal<unknown>(undefined);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  readonly normalizedOptions = computed<CwOption[]>(() =>
    this.options().map(option => {
      if (option !== null && typeof option === 'object') {
        const record = option as Record<string, unknown>;
        return { label: String(record[this.optionLabel()] ?? ''), value: record[this.optionValue()] };
      }
      return { label: String(option), value: option };
    })
  );

  onChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.value.set(value);
  }
  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  select(option: CwOption): void {
    if (option.value === this.value()) {
      return;
    }
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
  }
}
