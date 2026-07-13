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
 * A radio button over a real (visually hidden) native input. Bind every radio
 * in a group to the same model and give each its own `value`; the one whose
 * value equals the model renders selected.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-radio-button name="size" value="sm" label="Small" [(ngModel)]="size" />
 * <cw-radio-button name="size" value="lg" label="Large" [(ngModel)]="size" />
 */
@Component({
  selector: 'cw-radio-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
  host: {
    'class': 'cw-radio-button',
    '[class.cw-radio-button--checked]': 'checked()',
    '[class.cw-radio-button--disabled]': 'isDisabled()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioButtonComponent), multi: true }
  ]
})
export class RadioButtonComponent implements ControlValueAccessor {
  /** This radio's own value; selected when the bound model equals it. */
  readonly value = input<unknown>(undefined);
  /** Native group name — radios sharing a name form a keyboard group. */
  readonly name = input<string>('');
  /** Text label rendered after the control (projected content also renders). */
  readonly label = input<string>('');
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  private readonly model = signal<unknown>(undefined);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());
  readonly checked = computed(() => this.model() !== undefined && this.model() === this.value());

  onChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ radioButton: { plugins: [...] } }`). */
  readonly api: CwFormControlApi = {
    getHost: () => this.host.nativeElement,
    getValue: () => this.model(),
    setValue: (value: unknown) => { this.model.set(value); this.onChange(value); },
    isDisabled: () => this.isDisabled()
  };

  constructor() {
    providePluginHost('radioButton', this.api);
  }

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.model.set(value);
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

  onInputChange(): void {
    this.model.set(this.value());
    this.onChange(this.value());
  }
}
