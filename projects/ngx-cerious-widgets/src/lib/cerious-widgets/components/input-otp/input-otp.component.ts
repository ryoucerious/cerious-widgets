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
  signal,
  viewChildren
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { providePluginHost } from '../../shared/plugin-host';
import { CwFormControlApi } from '../../shared/interfaces/widget-api.interface';

/**
 * A segmented one-time-code input: one box per character, with auto-advance,
 * backspace-to-previous and paste-to-fill. The model is the concatenated
 * string.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-input-otp [length]="6" [(ngModel)]="code" />
 * <cw-input-otp [length]="4" mask integerOnly [(ngModel)]="pin" />
 */
@Component({
  selector: 'cw-input-otp',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-otp.component.html',
  styleUrl: './input-otp.component.scss',
  host: {
    'class': 'cw-input-otp',
    'role': 'group',
    '[class.cw-input-otp--disabled]': 'isDisabled()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputOtpComponent), multi: true }
  ]
})
export class InputOtpComponent implements ControlValueAccessor {
  private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  /** Number of character boxes. */
  readonly length = input(6, { transform: numberAttribute });
  /** Mask characters (show dots). */
  readonly mask = input(false, { transform: booleanAttribute });
  /** Restrict to digits 0-9. */
  readonly integerOnly = input(false, { transform: booleanAttribute });
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  /** Per-box characters. */
  readonly chars = signal<string[]>([]);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());
  readonly slots = computed(() => Array.from({ length: this.length() }, (_, i) => i));

  onChange: (value: string) => void = () => {};

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ inputOtp: { plugins: [...] } }`). */
  readonly api: CwFormControlApi<string> = {
    getHost: () => this.host.nativeElement,
    getValue: () => this.chars().join(''),
    setValue: (value: string) => {
      const text = (value ?? '').slice(0, this.length()).split('');
      this.chars.set(text);
      this.onChange(text.join(''));
    },
    isDisabled: () => this.isDisabled()
  };

  constructor() {
    providePluginHost('inputOtp', this.api);
  }
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    const text = value == null ? '' : String(value);
    this.chars.set(text.slice(0, this.length()).split(''));
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

  charAt(index: number): string {
    return this.chars()[index] ?? '';
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    let ch = input.value.slice(-1);
    if (this.integerOnly() && !/[0-9]/.test(ch)) {
      ch = '';
    }
    input.value = ch;
    const next = [...this.chars()];
    next[index] = ch;
    this.commit(next);
    if (ch && index < this.length() - 1) {
      this.focusBox(index + 1);
    }
  }

  onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      const next = [...this.chars()];
      if (next[index]) {
        next[index] = '';
        this.commit(next);
      } else if (index > 0) {
        next[index - 1] = '';
        this.commit(next);
        this.focusBox(index - 1);
      }
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusBox(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.length() - 1) {
      this.focusBox(index + 1);
    }
  }

  onPaste(index: number, event: ClipboardEvent): void {
    event.preventDefault();
    let text = event.clipboardData?.getData('text') ?? '';
    if (this.integerOnly()) {
      text = text.replace(/[^0-9]/g, '');
    }
    const next = [...this.chars()];
    for (let i = 0; i < text.length && index + i < this.length(); i++) {
      next[index + i] = text[i];
    }
    this.commit(next);
    this.focusBox(Math.min(index + text.length, this.length() - 1));
  }

  private commit(chars: string[]): void {
    this.chars.set(chars);
    this.onChange(chars.join(''));
    this.onTouched();
  }

  private focusBox(index: number): void {
    this.boxes()[index]?.nativeElement.focus();
    this.boxes()[index]?.nativeElement.select();
  }
}
