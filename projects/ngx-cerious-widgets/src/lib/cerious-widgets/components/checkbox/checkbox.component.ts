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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { providePluginHost } from '../../shared/plugin-host';
import { CwFormControlApi } from '../../shared/interfaces/widget-api.interface';

/**
 * A boolean checkbox with a styled box over a real (visually hidden) native
 * input, so focus, keyboard and form semantics stay native.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-checkbox label="Remember me" [(ngModel)]="remember" />
 */
@Component({
  selector: 'cw-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  host: {
    'class': 'cw-checkbox',
    '[class.cw-checkbox--checked]': 'checked()',
    '[class.cw-checkbox--disabled]': 'isDisabled()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  /** Text label rendered after the box (projected content also renders). */
  readonly label = input<string>('');
  /** Show the indeterminate (dash) state; a user click clears it. */
  readonly indeterminate = input(false, { transform: booleanAttribute });
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly checked = signal(false);
  private readonly cvaDisabled = signal(false);
  private readonly interacted = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());
  /** Indeterminate display state — cleared as soon as the user interacts. */
  readonly showIndeterminate = computed(() => this.indeterminate() && !this.interacted());

  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ checkbox: { plugins: [...] } }`). */
  readonly api: CwFormControlApi<boolean> = {
    getHost: () => this.host.nativeElement,
    getValue: () => this.checked(),
    setValue: (value: boolean) => { this.checked.set(!!value); this.onChange(!!value); },
    isDisabled: () => this.isDisabled()
  };

  constructor() {
    providePluginHost('checkbox', this.api);
  }

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

  onInputChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.interacted.set(true);
    this.checked.set(checked);
    this.onChange(checked);
  }
}
