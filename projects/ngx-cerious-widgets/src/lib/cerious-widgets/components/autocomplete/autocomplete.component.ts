import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
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
  OnDestroy,
  signal,
  TemplateRef,
  ViewChild,
  viewChildren,
  ViewContainerRef
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CeriousScrollComponent, CeriousScrollDirective, CeriousScrollItemTemplateDirective } from '@ceriousdevtech/ngx-cerious-scroll';
import { filter } from 'rxjs/operators';

/** A normalized suggestion: display label + underlying value. */
interface CwOption {
  label: string;
  value: unknown;
}

/**
 * A typeahead input: filters `options` as you type and shows a suggestions
 * panel — **virtualized with cerious-scroll** once the matches exceed
 * `virtualThreshold`. Selecting a suggestion writes its value to the model
 * and its label into the input.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-autocomplete [options]="countries" placeholder="Search countries" [(ngModel)]="country" />
 */
@Component({
  selector: 'cw-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, CeriousScrollComponent, CeriousScrollItemTemplateDirective],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  host: {
    'class': 'cw-autocomplete',
    '[class.cw-autocomplete--disabled]': 'isDisabled()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AutoCompleteComponent), multi: true }
  ]
})
export class AutoCompleteComponent implements ControlValueAccessor, OnDestroy {
  /** Public API handed to plugins (`{ autocomplete: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('autocomplete', this.api);
  }

  private readonly overlay = inject(Overlay);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('panel', { static: true }) private panelTemplate!: TemplateRef<unknown>;
  @ViewChild('inputEl', { static: true }) private inputRef!: ElementRef<HTMLInputElement>;
  private readonly scrollDirs = viewChildren(CeriousScrollDirective);

  /** The suggestion pool — objects, or primitives for a simple list. */
  readonly options = input<readonly unknown[]>([]);
  /** Property name to read an option's display label from (for object options). */
  readonly optionLabel = input<string>('label');
  /** Property name to read an option's value from (for object options). */
  readonly optionValue = input<string>('value');
  /** Input placeholder. */
  readonly placeholder = input<string>('');
  /** Minimum characters before suggesting. */
  readonly minLength = input(1, { transform: numberAttribute });
  /** Virtualize the suggestions (cerious-scroll) at or above this count. */
  readonly virtualThreshold = input(100, { transform: numberAttribute });
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly isOpen = signal(false);
  readonly query = signal('');
  readonly highlightedIndex = signal(-1);
  private readonly value = signal<unknown>(null);
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

  readonly suggestions = computed<CwOption[]>(() => {
    const term = this.query().trim().toLowerCase();
    if (term.length < this.minLength()) {
      return [];
    }
    return this.normalizedOptions().filter(o => o.label.toLowerCase().includes(term));
  });

  /** Virtualize once the suggestions cross the threshold. */
  readonly useVirtual = computed(() => this.suggestions().length >= this.virtualThreshold());

  private overlayRef?: OverlayRef;
  onChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.value.set(value);
    const match = this.normalizedOptions().find(o => o.value === value);
    this.inputRef.nativeElement.value = match?.label ?? (value == null ? '' : String(value));
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

  onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.query.set(text);
    this.highlightedIndex.set(-1);
    if (this.suggestions().length > 0) {
      this.open();
      // The panel may have (re)created its virtualized list after layout.
      requestAnimationFrame(() => this.scrollDirs().forEach(dir => dir.render()));
    } else {
      this.close();
    }
  }

  selectOption(option: CwOption, event?: Event): void {
    event?.stopPropagation();
    this.value.set(option.value);
    this.inputRef.nativeElement.value = option.label;
    this.query.set('');
    this.onChange(option.value);
    this.onTouched();
    this.close();
    this.inputRef.nativeElement.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      return;
    }
    const count = this.suggestions().length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex.set((this.highlightedIndex() + 1) % count);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.set((this.highlightedIndex() - 1 + count) % count);
        break;
      case 'Enter': {
        const option = this.suggestions()[this.highlightedIndex()];
        if (option) {
          event.preventDefault();
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

  open(): void {
    if (this.isDisabled() || this.overlayRef) {
      return;
    }
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.host)
        .withPush(false)
        .withPositions(this.positions()),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: this.host.nativeElement.offsetWidth,
      hasBackdrop: false,
      panelClass: ['cw-overlay-panel', 'cw-autocomplete__panel']
    });
    this.overlayRef.attach(new TemplatePortal(this.panelTemplate, this.viewContainerRef));
    this.isOpen.set(true);
    this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => !this.host.nativeElement.contains(event.target as Node)))
      .subscribe(() => this.close());
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.isOpen.set(false);
  }

  ngOnDestroy(): void {
    this.close();
  }

  private positions(): ConnectedPosition[] {
    return [
      { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
      { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 }
    ];
  }
}
