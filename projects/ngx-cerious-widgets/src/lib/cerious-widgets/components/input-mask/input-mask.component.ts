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

/** Mask placeholders: `9` = digit, `a` = letter, `*` = alphanumeric. */
const TOKENS: Record<string, RegExp> = {
  '9': /\d/,
  'a': /[a-zA-Z]/,
  '*': /[a-zA-Z0-9]/
};

/**
 * A text input that formats as you type against a mask, e.g.
 * `(999) 999-9999` or `99/99/9999`. Placeholders are `9` (digit), `a`
 * (letter), `*` (alphanumeric); any other character is a literal.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-input-mask mask="(999) 999-9999" [(ngModel)]="phone" />
 */
@Component({
  selector: 'cw-input-mask',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      type="text"
      class="cw-input-mask__input"
      [value]="display()"
      [placeholder]="slotPlaceholder()"
      [disabled]="isDisabled()"
      (input)="onInput($event)"
      (blur)="onTouched()"
    />
  `,
  styleUrl: './input-mask.component.scss',
  host: {
    'class': 'cw-input-mask',
    '[class.cw-input-mask--disabled]': 'isDisabled()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputMaskComponent), multi: true }
  ]
})
export class InputMaskComponent implements ControlValueAccessor {
  /** The mask pattern. */
  readonly mask = input<string>('');
  /** Character shown for unfilled slots. */
  readonly slotChar = input<string>('_');
  /** Emit the raw (unmasked) value instead of the formatted string. */
  readonly unmask = input(false, { transform: booleanAttribute });
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  /** The formatted value shown in the field. */
  readonly display = signal('');
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  /** Placeholder rendering the mask with slot chars, e.g. `(___) ___-____`. */
  readonly slotPlaceholder = computed(() =>
    this.mask().replace(/[9a*]/g, this.slotChar())
  );

  onChange: (value: string) => void = () => {};

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ inputMask: { plugins: [...] } }`). */
  readonly api: CwFormControlApi<string> = {
    getHost: () => this.host.nativeElement,
    getValue: () => this.display(),
    setValue: (value: string) => {
      this.display.set(this.applyMask(value == null ? '' : String(value)));
      this.onChange(this.display());
    },
    isDisabled: () => this.isDisabled()
  };

  constructor() {
    providePluginHost('inputMask', this.api);
  }
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    const raw = value == null ? '' : String(value);
    this.display.set(this.applyMask(raw));
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
    const input = event.target as HTMLInputElement;
    const formatted = this.applyMask(input.value);
    this.display.set(formatted);
    input.value = formatted;
    this.onChange(this.unmask() ? this.extractRaw(formatted) : formatted);
  }

  /** Format arbitrary input against the mask, consuming only matching chars. */
  private applyMask(input: string): string {
    const mask = this.mask();
    if (!mask) {
      return input;
    }
    const raw = this.extractRaw(input);
    let out = '';
    let ri = 0;
    for (const m of mask) {
      const token = TOKENS[m];
      if (token) {
        // Advance past raw chars that don't fit this token, then consume one.
        while (ri < raw.length && !token.test(raw[ri])) {
          ri++;
        }
        if (ri >= raw.length) {
          break;
        }
        out += raw[ri++];
      } else {
        out += m;
      }
    }
    return out;
  }

  /** Strip literals, keeping only the token-fillable characters in order. */
  private extractRaw(value: string): string {
    const mask = this.mask();
    // Gather the set of literal characters so we can drop them.
    const literals = new Set([...mask].filter(c => !TOKENS[c]));
    return [...value].filter(c => !literals.has(c)).join('');
  }
}
