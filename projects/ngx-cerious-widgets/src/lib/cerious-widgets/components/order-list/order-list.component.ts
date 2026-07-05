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

/** A normalized item: display label + underlying value. */
interface CwOrderItem {
  label: string;
  value: unknown;
}

/**
 * A reorderable list: select a row, then move it up / down / to the ends with
 * the side controls. The model is the ordered array of values. The list is
 * **virtualized with cerious-scroll** once it exceeds `virtualThreshold`.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-order-list [options]="tasks" [(ngModel)]="ordered" />
 */
@Component({
  selector: 'cw-order-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, CeriousScrollComponent, CeriousScrollItemTemplateDirective],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  host: {
    'class': 'cw-order-list',
    '[class.cw-order-list--disabled]': 'isDisabled()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OrderListComponent), multi: true }
  ]
})
export class OrderListComponent implements ControlValueAccessor {
  private readonly scrollDirs = viewChildren(CeriousScrollDirective);

  /** The items — objects, or primitives for a simple list. */
  readonly options = input<readonly unknown[]>([]);
  /** Property name to read an item's display label from (for object items). */
  readonly optionLabel = input<string>('label');
  /** Property name to read an item's value from (for object items). */
  readonly optionValue = input<string>('value');
  /** Optional heading above the list. */
  readonly header = input<string>('');
  /** List height (any CSS length) — the virtualized viewport size. */
  readonly listHeight = input<string>('280px');
  /** Virtualize the list (cerious-scroll) at or above this item count. */
  readonly virtualThreshold = input(100, { transform: numberAttribute });
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  /** The current order, as values. Seeded from `options` order until the user reorders. */
  private readonly orderedValues = signal<unknown[] | null>(null);
  readonly selectedValue = signal<unknown>(undefined);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  private readonly byValue = computed<Map<unknown, CwOrderItem>>(() => {
    const map = new Map<unknown, CwOrderItem>();
    for (const option of this.options()) {
      const item = this.normalize(option);
      map.set(item.value, item);
    }
    return map;
  });

  /** The ordered items to render. */
  readonly items = computed<CwOrderItem[]>(() => {
    const map = this.byValue();
    const order = this.orderedValues();
    if (order) {
      return order.map(v => map.get(v)).filter((i): i is CwOrderItem => !!i);
    }
    return this.options().map(o => this.normalize(o));
  });

  readonly useVirtual = computed(() => this.items().length >= this.virtualThreshold());
  readonly selectedIndex = computed(() => this.items().findIndex(i => i.value === this.selectedValue()));

  readonly canMoveUp = computed(() => !this.isDisabled() && this.selectedIndex() > 0);
  readonly canMoveDown = computed(() => {
    const i = this.selectedIndex();
    return !this.isDisabled() && i >= 0 && i < this.items().length - 1;
  });

  onChange: (value: unknown[]) => void = () => {};
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.orderedValues.set(Array.isArray(value) ? [...value] : null);
  }
  registerOnChange(fn: (value: unknown[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  isSelected(item: CwOrderItem): boolean {
    return item.value === this.selectedValue();
  }

  select(item: CwOrderItem): void {
    if (!this.isDisabled()) {
      this.selectedValue.set(item.value);
    }
  }

  move(delta: number): void {
    const from = this.selectedIndex();
    if (from < 0) {
      return;
    }
    const to = from + delta;
    if (to < 0 || to >= this.items().length) {
      return;
    }
    this.reorder(from, to);
  }

  moveToEnd(toEnd: boolean): void {
    const from = this.selectedIndex();
    if (from < 0) {
      return;
    }
    this.reorder(from, toEnd ? this.items().length - 1 : 0);
  }

  private reorder(from: number, to: number): void {
    const next = this.items().map(i => i.value);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    this.orderedValues.set(next);
    this.onChange([...next]);
    this.onTouched();
    requestAnimationFrame(() => this.scrollDirs().forEach(dir => dir.render()));
  }

  private normalize(option: unknown): CwOrderItem {
    if (option !== null && typeof option === 'object') {
      const record = option as Record<string, unknown>;
      return { label: String(record[this.optionLabel()] ?? ''), value: record[this.optionValue()] };
    }
    return { label: String(option), value: option };
  }
}
