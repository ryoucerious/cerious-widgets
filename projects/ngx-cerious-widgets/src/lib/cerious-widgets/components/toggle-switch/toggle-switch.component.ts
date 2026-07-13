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
 * An on/off switch over a real (visually hidden) native checkbox, so focus,
 * keyboard and form semantics stay native.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-toggle-switch label="Notifications" [(ngModel)]="notify" />
 */
@Component({
  selector: 'cw-toggle-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.scss',
  host: {
    'class': 'cw-toggle-switch',
    '[class.cw-toggle-switch--checked]': 'checked()',
    '[class.cw-toggle-switch--disabled]': 'isDisabled()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ToggleSwitchComponent), multi: true }
  ]
})
export class ToggleSwitchComponent implements ControlValueAccessor {
  /** Text label rendered after the switch (projected content also renders). */
  readonly label = input<string>('');
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly checked = signal(false);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ toggleSwitch: { plugins: [...] } }`). */
  readonly api: CwFormControlApi<boolean> = {
    getHost: () => this.host.nativeElement,
    getValue: () => this.checked(),
    setValue: (value: boolean) => { this.checked.set(!!value); this.onChange(!!value); },
    isDisabled: () => this.isDisabled()
  };

  constructor() {
    providePluginHost('toggleSwitch', this.api);
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
    this.checked.set(checked);
    this.onChange(checked);
  }
}
