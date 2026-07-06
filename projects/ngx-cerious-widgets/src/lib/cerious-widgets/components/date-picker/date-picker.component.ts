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
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { TemplateRegistryService } from '../../shared/services/template-registry.service';
import { PluginManagerService } from '../../shared/services/plugin-manager.service';
import { CW_LOCALE } from '../../shared/tokens/locale.token';
import { WIDGETS_CONFIG } from '../../shared/tokens/widgets-config.token';
import { resolveDatePickerConfig, WidgetsConfig } from '../../shared/interfaces/widgets-config.interface';
import { DatePickerApi, DatePickerPlugin } from './date-picker.api';

/** One cell of the visible 6×7 calendar grid. */
export interface CwCalendarDay {
  date: Date;
  outsideMonth: boolean;
  today: boolean;
  disabled: boolean;
}

/** Name of the template slot consumers can override day-cell rendering with. */
const DAY_TEMPLATE = 'datePicker.day';

/**
 * A calendar date picker following the full cerious-widgets contract: a typed
 * {@link DatePickerApi} for {@link DatePickerPlugin}s (configured via the
 * `datePicker` block of `WidgetsConfig`) and a `datePicker.day` template slot
 * for custom day cells.
 *
 * Implements {@link ControlValueAccessor} over a `Date | null` value (works
 * with `ngModel` / reactive forms) and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-date-picker [(ngModel)]="created" />
 * <cw-date-picker [min]="today" placeholder="Pick a delivery date" [(ngModel)]="delivery" />
 */
@Component({
  selector: 'cw-date-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  host: {
    'class': 'cw-date-picker',
    'role': 'combobox',
    'tabindex': '0',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[class.cw-date-picker--open]': 'isOpen()',
    '[class.cw-date-picker--disabled]': 'isDisabled()',
    '(click)': 'toggle()',
    '(keydown)': 'onTriggerKeydown($event)',
    '(blur)': 'onTouched()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true }
  ]
})
export class DatePickerComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  private readonly templateRegistry = inject(TemplateRegistryService);
  private readonly pluginManager = inject(PluginManagerService);
  private readonly config = inject<WidgetsConfig>(WIDGETS_CONFIG, { optional: true }) ?? undefined;
  private readonly appLocale = inject(CW_LOCALE);

  @ViewChild('panel', { static: true }) private panelTemplate!: TemplateRef<unknown>;

  /** Text shown while empty. */
  readonly placeholder = input<string>('Select date');
  /** BCP-47 locale for month/weekday names and display format (browser default when empty). */
  readonly locale = input<string>('');
  /** First day of week: 0 = Sunday (default), 1 = Monday. */
  readonly firstDayOfWeek = input(0, { transform: numberAttribute });
  /** Earliest selectable date. */
  readonly min = input<Date | null>(null);
  /** Latest selectable date. */
  readonly max = input<Date | null>(null);
  /** Show the Clear button in the panel footer. */
  readonly clearable = input(true, { transform: booleanAttribute });
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly isOpen = signal(false);
  private readonly value = signal<Date | null>(null);
  private readonly cvaDisabled = signal(false);
  /** First day of the month currently shown in the panel. */
  readonly viewDate = signal<Date>(startOfMonth(new Date()));

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  /** Per-instance `locale` input, else the app-wide `CW_LOCALE`, else browser default. */
  private readonly effectiveLocale = computed(() => this.locale() || this.appLocale || undefined);

  readonly displayValue = computed(() => {
    const date = this.value();
    return date ? date.toLocaleDateString(this.effectiveLocale(), { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  });

  readonly monthTitle = computed(() =>
    this.viewDate().toLocaleDateString(this.effectiveLocale(), { month: 'long', year: 'numeric' })
  );

  /** Localized weekday headers, honouring `firstDayOfWeek`. */
  readonly weekdays = computed(() => {
    const format = new Intl.DateTimeFormat(this.effectiveLocale(), { weekday: 'short' });
    // 2024-09-01 was a Sunday.
    return Array.from({ length: 7 }, (_, i) =>
      format.format(new Date(2024, 8, 1 + ((i + this.firstDayOfWeek()) % 7)))
    );
  });

  /** The visible 6×7 grid of days. */
  readonly days = computed<CwCalendarDay[]>(() => {
    const view = this.viewDate();
    const firstDow = this.firstDayOfWeek();
    const gridStart = new Date(view);
    gridStart.setDate(1 - ((view.getDay() - firstDow + 7) % 7));
    const today = new Date();
    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);
      return {
        date,
        outsideMonth: date.getMonth() !== view.getMonth(),
        today: sameDay(date, today),
        disabled: this.isOutOfRange(date)
      };
    });
  });

  private overlayRef?: OverlayRef;
  private pluginInstances: DatePickerPlugin[] = [];

  /** The stable API object handed to plugins. */
  readonly api: DatePickerApi = {
    getValue: () => this.value(),
    setValue: (value: Date | null) => {
      this.value.set(value);
      this.onChange(value);
    },
    open: () => this.open(),
    close: () => this.close(),
    isOpen: () => this.isOpen(),
    navigateTo: (month: number, year: number) => this.navigateTo(month, year)
  };

  onChange: (value: Date | null) => void = () => {};
  onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    const resolved = resolveDatePickerConfig(this.config);
    this.pluginInstances = (resolved.plugins ?? []).map(type => this.injector.get(type));
    this.pluginManager.initPlugins(this.api, this.pluginInstances, resolved.pluginOptions);
    this.pluginInstances.forEach(p => p.afterInit?.());
  }

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    const date = value instanceof Date && !isNaN(value.getTime()) ? value : null;
    this.value.set(date);
    if (date) {
      this.viewDate.set(startOfMonth(date));
    }
  }
  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  /** Consumer-overridable day-cell template (config block or `cwTemplate`). */
  dayTemplate(): TemplateRef<unknown> | undefined {
    return (
      this.templateRegistry.getTemplate(DAY_TEMPLATE) ??
      resolveDatePickerConfig(this.config).templates?.[DAY_TEMPLATE]
    );
  }

  isSelected(day: CwCalendarDay): boolean {
    const selected = this.value();
    return !!selected && sameDay(day.date, selected);
  }

  selectDay(day: CwCalendarDay, event?: Event): void {
    event?.stopPropagation();
    if (day.disabled) {
      return;
    }
    this.value.set(day.date);
    this.onChange(day.date);
    this.onTouched();
    this.close();
    this.host.nativeElement.focus();
  }

  clear(event?: Event): void {
    event?.stopPropagation();
    this.value.set(null);
    this.onChange(null);
    this.close();
  }

  navigateMonth(offset: number, event?: Event): void {
    event?.stopPropagation();
    const view = this.viewDate();
    this.navigateTo(view.getMonth() + offset, view.getFullYear());
  }

  navigateTo(month: number, year: number): void {
    this.viewDate.set(startOfMonth(new Date(year, month, 1)));
    const view = this.viewDate();
    this.pluginInstances.forEach(p => p.onMonthChange?.(view.getMonth(), view.getFullYear()));
  }

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isDisabled() || this.isOpen()) {
      return;
    }
    this.viewDate.set(startOfMonth(this.value() ?? new Date()));
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.host)
        .withPush(false)
        .withPositions(this.positions()),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: ['cw-overlay-panel', 'cw-date-picker__panel']
    });
    this.overlayRef.attach(new TemplatePortal(this.panelTemplate, this.viewContainerRef));
    this.isOpen.set(true);
    this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => !this.host.nativeElement.contains(event.target as Node)))
      .subscribe(() => this.close());
    this.pluginInstances.forEach(p => p.onOpen?.());
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

  ngOnDestroy(): void {
    this.close();
    this.pluginManager.destroyPlugins(this.api);
  }

  private isOutOfRange(date: Date): boolean {
    const min = this.min();
    const max = this.max();
    return (!!min && endOfDay(date) < min) || (!!max && startOfDay(date) > max);
  }

  private positions(): ConnectedPosition[] {
    return [
      { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
      { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 }
    ];
  }
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}
function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
