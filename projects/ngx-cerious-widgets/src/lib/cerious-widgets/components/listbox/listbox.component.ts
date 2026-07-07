import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  numberAttribute,
  signal,
  viewChildren
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CeriousScrollComponent, CeriousScrollDirective, CeriousScrollItemTemplateDirective } from '@ceriousdevtech/ngx-cerious-scroll';

/** A normalized option: display label + underlying value. */
interface CwOption {
  label: string;
  value: unknown;
}

/**
 * An inline selection list (single or `multiple`), with an optional filter
 * box — **virtualized with cerious-scroll** once it exceeds
 * `virtualThreshold` options.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-listbox [options]="cities" [(ngModel)]="city" />
 * <cw-listbox [options]="thousands" multiple filterable [(ngModel)]="picked" />
 */
@Component({
  selector: 'cw-listbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, CeriousScrollComponent, CeriousScrollItemTemplateDirective],
  templateUrl: './listbox.component.html',
  styleUrl: './listbox.component.scss',
  host: {
    'class': 'cw-listbox',
    // The host groups an optional filter input with the option list; the
    // `listbox` role lives on the list itself so the input isn't an invalid
    // child of it.
    'role': 'group',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[class.cw-listbox--disabled]': 'isDisabled()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ListboxComponent), multi: true }
  ]
})
export class ListboxComponent implements ControlValueAccessor {
  private readonly scrollDirs = viewChildren(CeriousScrollDirective);

  /** The available options — objects, or primitives for a simple list. */
  readonly options = input<readonly unknown[]>([]);
  /** Accessible name for the list (mirrors the native `aria-label`). */
  readonly ariaLabel = input<string>('', { alias: 'aria-label' });
  /** Property name to read an option's display label from (for object options). */
  readonly optionLabel = input<string>('label');
  /** Property name to read an option's value from (for object options). */
  readonly optionValue = input<string>('value');
  /** Allow selecting several values (the model becomes an array). */
  readonly multiple = input(false, { transform: booleanAttribute });
  /** Show a filter box above the list. */
  readonly filterable = input(false, { transform: booleanAttribute });
  /** List height (any CSS length) — the virtualized viewport size. */
  readonly listHeight = input<string>('240px');
  /** Virtualize the list (cerious-scroll) at or above this option count. */
  readonly virtualThreshold = input(100, { transform: numberAttribute });
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly filterTerm = signal('');
  private readonly value = signal<unknown>(undefined);
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

  readonly filteredOptions = computed<CwOption[]>(() => {
    const term = this.filterTerm().trim().toLowerCase();
    const all = this.normalizedOptions();
    return term ? all.filter(o => o.label.toLowerCase().includes(term)) : all;
  });

  /** Virtualize once the filtered list crosses the threshold. */
  readonly useVirtual = computed(() => this.filteredOptions().length >= this.virtualThreshold());

  onChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.value.set(this.multiple() ? (Array.isArray(value) ? [...value] : []) : value);
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

  isSelected(option: CwOption): boolean {
    const current = this.value();
    return this.multiple() ? Array.isArray(current) && current.includes(option.value) : current === option.value;
  }

  select(option: CwOption): void {
    if (this.isDisabled()) {
      return;
    }
    if (this.multiple()) {
      const current = Array.isArray(this.value()) ? (this.value() as unknown[]) : [];
      const next = current.includes(option.value)
        ? current.filter(v => v !== option.value)
        : [...current, option.value];
      this.value.set(next);
      this.onChange([...next]);
    } else {
      this.value.set(option.value);
      this.onChange(option.value);
    }
    this.onTouched();
  }

  onFilterInput(event: Event): void {
    this.filterTerm.set((event.target as HTMLInputElement).value);
    // Filtering can cross the virtual threshold and recreate the list; the
    // engine's initial render can precede layout.
    requestAnimationFrame(() => this.scrollDirs().forEach(dir => dir.render()));
  }
}
