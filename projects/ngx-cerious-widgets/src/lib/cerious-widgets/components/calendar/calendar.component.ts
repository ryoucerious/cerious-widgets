import {
  ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, numberAttribute, output, signal
} from '@angular/core';

/** An event shown on the calendar. */
export interface CwCalendarEvent {
  /** The day the event falls on. */
  date: Date;
  /** Short title shown in the day cell. */
  title: string;
  /** CSS colour for the event chip (defaults to the accent token). */
  color?: string;
}

interface DayCell {
  date: Date;
  key: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isFocus: boolean;
  visible: CwCalendarEvent[];
  more: number;
  aria: string;
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * A month-view event calendar: navigate months, highlight today, select a day,
 * and render events as coloured chips (overflow collapses into "+N more"). For a
 * date *input*, use {@link DatePickerComponent} instead.
 *
 * Signal-based and OnPush (zoneless-safe), token-themed, and keyboard-accessible
 * (`role="grid"` with arrow / Home / End / PageUp / PageDown navigation).
 *
 * @example
 * <cw-calendar [events]="events" (dateSelect)="onDay($event)" (eventClick)="onEvent($event)" />
 */
@Component({
  selector: 'cw-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  host: { 'class': 'cw-calendar' }
})
export class CalendarComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Initial month to display (any day within it). Defaults to today. */
  readonly date = input<Date>(new Date());
  /** Events to render. */
  readonly events = input<readonly CwCalendarEvent[]>([]);
  /** Initially-selected day. */
  readonly selectedDate = input<Date | null>(null);
  /** First day of the week: 0 = Sunday (default), 1 = Monday. */
  readonly weekStartsOn = input(0, { transform: numberAttribute });
  /** Max event chips per day before collapsing into "+N more". */
  readonly maxEventsPerDay = input(3, { transform: numberAttribute });
  /** BCP-47 locale for month / weekday names. Defaults to the runtime locale. */
  readonly locale = input<string | undefined>(undefined);

  /** Emits the clicked day. */
  readonly dateSelect = output<Date>();
  /** Emits a clicked event. */
  readonly eventClick = output<CwCalendarEvent>();
  /** Emits the first day of the newly-shown month when navigation changes it. */
  readonly monthChange = output<Date>();

  private readonly today = new Date();
  // Override signals let navigation/selection take over from the reactive
  // defaults derived from the `date` / `selectedDate` inputs.
  private readonly viewOverride = signal<Date | null>(null);
  private readonly selectedOverride = signal<Date | null | undefined>(undefined);
  private readonly focusOverride = signal<Date | null>(null);

  protected readonly viewDate = computed(() => this.viewOverride() ?? startOfMonth(this.date()));
  protected readonly selected = computed(() =>
    this.selectedOverride() === undefined ? this.selectedDate() : this.selectedOverride()!);
  protected readonly focusDate = computed(() => this.focusOverride() ?? this.selected() ?? this.date());

  readonly monthLabel = computed(() =>
    this.viewDate().toLocaleDateString(this.locale(), { month: 'long', year: 'numeric' }));

  readonly weekdayLabels = computed(() => {
    const base = new Date(2023, 0, 1); // a Sunday
    const fmt = new Intl.DateTimeFormat(this.locale(), { weekday: 'short' });
    return Array.from({ length: 7 }, (_, i) => fmt.format(addDays(base, (i + this.weekStartsOn()) % 7)));
  });

  readonly weeks = computed<DayCell[][]>(() => {
    const view = this.viewDate();
    const first = startOfMonth(view);
    const offset = (first.getDay() - this.weekStartsOn() + 7) % 7;
    const gridStart = addDays(first, -offset);
    const max = this.maxEventsPerDay();
    const selected = this.selected();
    const focus = this.focusDate();
    const fullFmt = new Intl.DateTimeFormat(this.locale(), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    const weeks: DayCell[][] = [];
    for (let w = 0; w < 6; w++) {
      const week: DayCell[] = [];
      for (let d = 0; d < 7; d++) {
        const date = addDays(gridStart, w * 7 + d);
        const dayEvents = this.events().filter(e => sameDay(e.date, date));
        week.push({
          date,
          key: iso(date),
          day: date.getDate(),
          inMonth: date.getMonth() === view.getMonth(),
          isToday: sameDay(date, this.today),
          isSelected: !!selected && sameDay(date, selected),
          isFocus: sameDay(date, focus),
          visible: dayEvents.slice(0, max),
          more: Math.max(0, dayEvents.length - max),
          aria: fullFmt.format(date) + (dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : '')
        });
      }
      weeks.push(week);
    }
    return weeks;
  });

  selectDate(date: Date): void {
    this.selectedOverride.set(date);
    this.focusOverride.set(date);
    if (date.getMonth() !== this.viewDate().getMonth() || date.getFullYear() !== this.viewDate().getFullYear()) {
      this.setView(startOfMonth(date));
    }
    this.dateSelect.emit(date);
  }

  onEventClick(event: CwCalendarEvent, e: Event): void {
    e.stopPropagation();
    this.eventClick.emit(event);
  }

  prevMonth(): void { this.setView(new Date(this.viewDate().getFullYear(), this.viewDate().getMonth() - 1, 1)); }
  nextMonth(): void { this.setView(new Date(this.viewDate().getFullYear(), this.viewDate().getMonth() + 1, 1)); }
  goToday(): void {
    this.setView(startOfMonth(this.today));
    this.focusOverride.set(this.today);
    this.focusCell(this.today);
  }

  onKeydown(e: KeyboardEvent): void {
    const deltas: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in deltas) {
      e.preventDefault();
      this.moveFocus(addDays(this.focusDate(), deltas[e.key]));
    } else if (e.key === 'Home') {
      e.preventDefault();
      const f = this.focusDate();
      this.moveFocus(addDays(f, -((f.getDay() - this.weekStartsOn() + 7) % 7)));
    } else if (e.key === 'End') {
      e.preventDefault();
      const f = this.focusDate();
      this.moveFocus(addDays(f, 6 - ((f.getDay() - this.weekStartsOn() + 7) % 7)));
    } else if (e.key === 'PageUp') {
      e.preventDefault();
      const f = this.focusDate();
      this.moveFocus(new Date(f.getFullYear(), f.getMonth() - 1, f.getDate()));
    } else if (e.key === 'PageDown') {
      e.preventDefault();
      const f = this.focusDate();
      this.moveFocus(new Date(f.getFullYear(), f.getMonth() + 1, f.getDate()));
    }
  }

  private moveFocus(date: Date): void {
    this.focusOverride.set(date);
    if (date.getMonth() !== this.viewDate().getMonth() || date.getFullYear() !== this.viewDate().getFullYear()) {
      this.setView(startOfMonth(date));
    }
    this.focusCell(date);
  }

  private setView(first: Date): void {
    this.viewOverride.set(first);
    this.monthChange.emit(first);
  }

  private focusCell(date: Date): void {
    // Wait a tick so a month change has rendered before moving focus.
    setTimeout(() => {
      this.host.nativeElement.querySelector<HTMLElement>(`[data-date="${iso(date)}"]`)?.focus();
    });
  }
}
