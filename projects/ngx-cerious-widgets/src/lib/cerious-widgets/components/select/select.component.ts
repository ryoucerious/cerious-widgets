import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnDestroy,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter } from 'rxjs/operators';

/** A normalized option: display label + underlying value. */
interface CwOption {
  label: string;
  value: unknown;
}

/**
 * A single-select dropdown, built on the overlay foundation.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 * Keyboard: Up/Down move the highlight, Enter selects, Escape closes.
 *
 * @example
 * <cw-select [options]="cities" placeholder="Pick a city" [(ngModel)]="city" />
 */
@Component({
  selector: 'cw-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  host: {
    'class': 'cw-select',
    'role': 'combobox',
    'tabindex': '0',
    'aria-haspopup': 'listbox',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[class.cw-select--open]': 'isOpen()',
    '[class.cw-select--disabled]': 'isDisabled()',
    '(click)': 'toggle()',
    '(keydown)': 'onKeydown($event)',
    '(blur)': 'onTouched()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true }
  ]
})
export class SelectComponent implements ControlValueAccessor, OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('panel', { static: true }) private panelTemplate!: TemplateRef<unknown>;

  /** The available options — objects, or primitives for a simple list. */
  readonly options = input<readonly unknown[]>([]);
  /** Property name to read an option's display label from (for object options). */
  readonly optionLabel = input<string>('label');
  /** Property name to read an option's value from (for object options). */
  readonly optionValue = input<string>('value');
  /** Text shown when nothing is selected. */
  readonly placeholder = input<string>('Select');
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly isOpen = signal(false);
  readonly highlightedIndex = signal(-1);
  private readonly value = signal<unknown>(null);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  /** Options normalized to `{ label, value }`. */
  readonly normalizedOptions = computed<CwOption[]>(() =>
    this.options().map(opt => this.normalize(opt))
  );

  /** The currently selected option, if any. */
  readonly selectedOption = computed<CwOption | undefined>(() =>
    this.normalizedOptions().find(o => o.value === this.value())
  );

  private overlayRef?: OverlayRef;
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

  isSelected(option: CwOption): boolean {
    return option.value === this.value();
  }

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isDisabled() || this.isOpen()) {
      return;
    }
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.host)
      .withPush(false)
      .withPositions(this.positions());

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: this.host.nativeElement.offsetWidth,
      hasBackdrop: false,
      panelClass: ['cw-overlay-panel', 'cw-select__panel']
    });

    this.overlayRef.attach(new TemplatePortal(this.panelTemplate, this.viewContainerRef));
    this.isOpen.set(true);
    // Highlight the selected option, or the first one.
    const selectedIndex = this.normalizedOptions().findIndex(o => o.value === this.value());
    this.highlightedIndex.set(selectedIndex >= 0 ? selectedIndex : 0);

    this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => !this.host.nativeElement.contains(event.target as Node)))
      .subscribe(() => this.close());
  }

  close(): void {
    if (!this.overlayRef) {
      return;
    }
    this.overlayRef.dispose();
    this.overlayRef = undefined;
    this.isOpen.set(false);
  }

  selectOption(option: CwOption): void {
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.close();
    this.host.nativeElement.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      return;
    }
    const count = this.normalizedOptions().length;

    if (!this.isOpen()) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.open();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex.set((this.highlightedIndex() + 1) % count);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.set((this.highlightedIndex() - 1 + count) % count);
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const option = this.normalizedOptions()[this.highlightedIndex()];
        if (option) {
          this.selectOption(option);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'Tab':
        this.close();
        break;
    }
  }

  ngOnDestroy(): void {
    this.close();
  }

  private normalize(option: unknown): CwOption {
    if (option !== null && typeof option === 'object') {
      const record = option as Record<string, unknown>;
      return {
        label: String(record[this.optionLabel()] ?? ''),
        value: record[this.optionValue()]
      };
    }
    return { label: String(option), value: option };
  }

  private positions(): ConnectedPosition[] {
    return [
      { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
      { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 }
    ];
  }
}
