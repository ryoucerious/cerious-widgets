import { NgTemplateOutlet } from '@angular/common';
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
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CeriousScrollComponent, CeriousScrollDirective, CeriousScrollItemTemplateDirective } from '@ceriousdevtech/ngx-cerious-scroll';

/** A normalized item: display label + underlying value. */
interface CwPickItem {
  label: string;
  value: unknown;
}

/**
 * A dual-list transfer control: move items between a source and a target
 * list. The model is the ordered array of **target** values. Both lists are
 * **virtualized with cerious-scroll** once they exceed `virtualThreshold`.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-pick-list [options]="allRoles" [(ngModel)]="assignedRoles" />
 */
@Component({
  selector: 'cw-pick-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, CeriousScrollComponent, CeriousScrollItemTemplateDirective],
  templateUrl: './pick-list.component.html',
  styleUrl: './pick-list.component.scss',
  host: {
    'class': 'cw-pick-list',
    '[class.cw-pick-list--disabled]': 'isDisabled()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PickListComponent), multi: true }
  ]
})
export class PickListComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ pickList: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('pickList', this.api);
  }

  private readonly scrollDirs = viewChildren(CeriousScrollDirective);

  /** The full pool of items — objects, or primitives for a simple list. */
  readonly options = input<readonly unknown[]>([]);
  /** Property name to read an item's display label from (for object items). */
  readonly optionLabel = input<string>('label');
  /** Property name to read an item's value from (for object items). */
  readonly optionValue = input<string>('value');
  /** Heading over the source (available) list. */
  readonly sourceHeader = input<string>('Available');
  /** Heading over the target (selected) list. */
  readonly targetHeader = input<string>('Selected');
  /** List height (any CSS length) — the virtualized viewport size. */
  readonly listHeight = input<string>('260px');
  /** Virtualize each list (cerious-scroll) at or above this item count. */
  readonly virtualThreshold = input(100, { transform: numberAttribute });
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  /** Target values, in order. */
  private readonly targetValues = signal<unknown[]>([]);
  /** Currently highlighted values (across either list). */
  private readonly selected = signal<Set<unknown>>(new Set());
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  private readonly byValue = computed<Map<unknown, CwPickItem>>(() => {
    const map = new Map<unknown, CwPickItem>();
    for (const option of this.options()) {
      const item = this.normalize(option);
      map.set(item.value, item);
    }
    return map;
  });

  readonly targetItems = computed<CwPickItem[]>(() => {
    const map = this.byValue();
    return this.targetValues().map(v => map.get(v)).filter((i): i is CwPickItem => !!i);
  });

  readonly sourceItems = computed<CwPickItem[]>(() => {
    const inTarget = new Set(this.targetValues());
    return this.options().map(o => this.normalize(o)).filter(i => !inTarget.has(i.value));
  });

  readonly sourceVirtual = computed(() => this.sourceItems().length >= this.virtualThreshold());
  readonly targetVirtual = computed(() => this.targetItems().length >= this.virtualThreshold());

  readonly hasSourceSelection = computed(() => this.sourceItems().some(i => this.selected().has(i.value)));
  readonly hasTargetSelection = computed(() => this.targetItems().some(i => this.selected().has(i.value)));

  onChange: (value: unknown[]) => void = () => {};
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.targetValues.set(Array.isArray(value) ? [...value] : []);
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

  isHighlighted(item: CwPickItem): boolean {
    return this.selected().has(item.value);
  }

  toggleHighlight(item: CwPickItem): void {
    if (this.isDisabled()) {
      return;
    }
    const next = new Set(this.selected());
    next.has(item.value) ? next.delete(item.value) : next.add(item.value);
    this.selected.set(next);
  }

  /** Move highlighted source items to the target. */
  moveToTarget(all = false): void {
    const moving = (all ? this.sourceItems() : this.sourceItems().filter(i => this.selected().has(i.value)))
      .map(i => i.value);
    if (!moving.length) {
      return;
    }
    this.commit([...this.targetValues(), ...moving]);
  }

  /** Move highlighted target items back to the source. */
  moveToSource(all = false): void {
    const removing = new Set(
      (all ? this.targetItems() : this.targetItems().filter(i => this.selected().has(i.value))).map(i => i.value)
    );
    if (!removing.size) {
      return;
    }
    this.commit(this.targetValues().filter(v => !removing.has(v)));
  }

  private commit(next: unknown[]): void {
    this.targetValues.set(next);
    this.onChange([...next]);
    this.onTouched();
    this.clearMoved(next);
    requestAnimationFrame(() => this.scrollDirs().forEach(dir => dir.render()));
  }

  /** Drop highlights for values that changed side (keeps UX tidy). */
  private clearMoved(_next: unknown[]): void {
    this.selected.set(new Set());
  }

  private normalize(option: unknown): CwPickItem {
    if (option !== null && typeof option === 'object') {
      const record = option as Record<string, unknown>;
      return { label: String(record[this.optionLabel()] ?? ''), value: record[this.optionValue()] };
    }
    return { label: String(option), value: option };
  }
}
