import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  numberAttribute,
  OnDestroy,
  Optional,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  viewChildren
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CeriousScrollComponent, CeriousScrollDirective, CeriousScrollItemTemplateDirective } from '@ceriousdevtech/ngx-cerious-scroll';
import { filter } from 'rxjs/operators';
import { TemplateRegistryService } from '../../shared/services/template-registry.service';
import { PluginManagerService } from '../../shared/services/plugin-manager.service';
import { WIDGETS_CONFIG } from '../../shared/tokens/widgets-config.token';
import { resolveMultiSelectConfig, WidgetsConfig } from '../../shared/interfaces/widgets-config.interface';
import { MultiSelectApi, MultiSelectPlugin } from './multi-select.api';

/** A normalized option: display label + underlying value. */
interface CwOption {
  label: string;
  value: unknown;
}

/** Name of the template slot consumers can override option rendering with. */
const OPTION_TEMPLATE = 'multiSelect.option';

/**
 * A multi-select dropdown following the full cerious-widgets contract: a typed
 * {@link MultiSelectApi} for {@link MultiSelectPlugin}s (configured via the
 * `multiSelect` block of `WidgetsConfig`), a `multiSelect.option` template
 * slot, and a panel list **virtualized with cerious-scroll** once it exceeds
 * `virtualThreshold` options.
 *
 * Implements {@link ControlValueAccessor} over an array value (works with
 * `ngModel` / reactive forms) and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-multi-select [options]="cities" placeholder="Select cities" [(ngModel)]="selected" />
 */
@Component({
  selector: 'cw-multi-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, CeriousScrollComponent, CeriousScrollItemTemplateDirective],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  host: {
    'class': 'cw-multi-select',
    'role': 'combobox',
    'tabindex': '0',
    'aria-haspopup': 'listbox',
    'aria-multiselectable': 'true',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[class.cw-multi-select--open]': 'isOpen()',
    '[class.cw-multi-select--disabled]': 'isDisabled()',
    '(click)': 'toggle()',
    '(keydown)': 'onTriggerKeydown($event)',
    '(blur)': 'onTouched()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MultiSelectComponent), multi: true }
  ]
})
export class MultiSelectComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  private readonly templateRegistry = inject(TemplateRegistryService);
  private readonly pluginManager = inject(PluginManagerService);
  private readonly config = inject<WidgetsConfig>(WIDGETS_CONFIG, { optional: true }) ?? undefined;

  @ViewChild('panel', { static: true }) private panelTemplate!: TemplateRef<unknown>;
  /** The virtualized list's scroll directive (present while the panel is open and virtual). */
  private readonly scrollDirs = viewChildren(CeriousScrollDirective);

  /** The available options — objects, or primitives for a simple list. */
  readonly options = input<readonly unknown[]>([]);
  /** Property name to read an option's display label from (for object options). */
  readonly optionLabel = input<string>('label');
  /** Property name to read an option's value from (for object options). */
  readonly optionValue = input<string>('value');
  /** Text shown when nothing is selected. */
  readonly placeholder = input<string>('Select');
  /** Show the filter box in the panel. */
  readonly filterable = input(true, { transform: booleanAttribute });
  /** How many selected chips to show before collapsing to "+n". */
  readonly maxChips = input(3, { transform: numberAttribute });
  /** Virtualize the list (cerious-scroll) at or above this option count. */
  readonly virtualThreshold = input(100, { transform: numberAttribute });
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly isOpen = signal(false);
  readonly filterTerm = signal('');
  private readonly value = signal<unknown[]>([]);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  readonly normalizedOptions = computed<CwOption[]>(() => this.options().map(o => this.normalize(o)));

  readonly filteredOptions = computed<CwOption[]>(() => {
    const term = this.filterTerm().trim().toLowerCase();
    const all = this.normalizedOptions();
    return term ? all.filter(o => o.label.toLowerCase().includes(term)) : all;
  });

  /** Virtualize once the filtered list crosses the threshold. */
  readonly useVirtual = computed(() => this.filteredOptions().length >= this.virtualThreshold());

  readonly selectedOptions = computed<CwOption[]>(() =>
    this.normalizedOptions().filter(o => this.value().includes(o.value))
  );
  readonly visibleChips = computed(() => this.selectedOptions().slice(0, this.maxChips()));
  readonly overflowCount = computed(() => Math.max(0, this.selectedOptions().length - this.maxChips()));

  private overlayRef?: OverlayRef;
  private pluginInstances: MultiSelectPlugin[] = [];

  /** The stable API object handed to plugins. */
  readonly api: MultiSelectApi = {
    getValue: () => [...this.value()],
    setValue: (value: unknown[]) => {
      this.value.set([...value]);
      this.onChange([...value]);
    },
    open: () => this.open(),
    close: () => this.close(),
    isOpen: () => this.isOpen(),
    getOptions: () => this.options(),
    setFilter: (term: string) => this.filterTerm.set(term)
  };

  onChange: (value: unknown[]) => void = () => {};
  onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    const resolved = resolveMultiSelectConfig(this.config);
    this.pluginInstances = (resolved.plugins ?? []).map(type => this.injector.get(type));
    this.pluginManager.initPlugins(this.api, this.pluginInstances, resolved.pluginOptions);
    this.pluginInstances.forEach(p => p.afterInit?.());
  }

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.value.set(Array.isArray(value) ? [...value] : []);
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

  /** Consumer-overridable option template (config block or `cwTemplate`). */
  optionTemplate(): TemplateRef<unknown> | undefined {
    return (
      this.templateRegistry.getTemplate(OPTION_TEMPLATE) ??
      resolveMultiSelectConfig(this.config).templates?.[OPTION_TEMPLATE]
    );
  }

  isSelected(option: CwOption): boolean {
    return this.value().includes(option.value);
  }

  toggleOption(option: CwOption, event?: Event): void {
    event?.stopPropagation();
    const current = this.value();
    const next = current.includes(option.value)
      ? current.filter(v => v !== option.value)
      : [...current, option.value];
    this.value.set(next);
    this.onChange([...next]);
    this.onTouched();
  }

  removeChip(option: CwOption, event: Event): void {
    event.stopPropagation();
    this.toggleOption(option);
  }

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isDisabled() || this.isOpen()) {
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
      panelClass: ['cw-overlay-panel', 'cw-multi-select__panel']
    });
    this.overlayRef.attach(new TemplatePortal(this.panelTemplate, this.viewContainerRef));
    this.isOpen.set(true);
    this.filterTerm.set('');
    this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => !this.host.nativeElement.contains(event.target as Node)))
      .subscribe(() => this.close());
    this.pluginInstances.forEach(p => p.onOpen?.());
    this.nudgeVirtualRender();
  }

  /**
   * The cerious-scroll engine's initial render can fire before the overlay
   * panel has finished layout (0-height viewport → no rows). Nudge one render
   * on the next frame whenever the virtual list may have (re)appeared.
   */
  private nudgeVirtualRender(): void {
    requestAnimationFrame(() => this.scrollDirs().forEach(dir => dir.render()));
  }

  close(): void {
    if (!this.overlayRef) {
      return;
    }
    this.overlayRef.dispose();
    this.overlayRef = undefined;
    this.isOpen.set(false);
    this.pluginInstances.forEach(p => p.onClose?.());
  }

  onFilterInput(event: Event): void {
    this.filterTerm.set((event.target as HTMLInputElement).value);
    // Filtering can cross the virtual threshold and recreate the list.
    this.nudgeVirtualRender();
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      return;
    }
    if (!this.isOpen() && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.open();
    } else if (this.isOpen() && event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  /** Arrow keys move focus between option rows inside the panel. */
  onPanelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      this.host.nativeElement.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }
    event.preventDefault();
    const panel = this.overlayRef?.overlayElement;
    if (!panel) {
      return;
    }
    const rows = Array.from(panel.querySelectorAll<HTMLButtonElement>('.cw-multi-select__option'));
    const current = rows.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === 'ArrowDown' ? Math.min(current + 1, rows.length - 1) : Math.max(current - 1, 0);
    rows[next]?.focus();
  }

  ngOnDestroy(): void {
    this.close();
    this.pluginManager.destroyPlugins(this.api);
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
