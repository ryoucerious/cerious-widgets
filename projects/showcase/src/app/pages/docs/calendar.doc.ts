import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarComponent, CwCalendarEvent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-calendar-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarComponent, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="calendar">
      <doc-tab label="Features">
        <doc-section title="Month view with events" description="Navigate months, click a day to select it, or click an event. Keyboard: arrows to move, Home/End for week edges, PageUp/PageDown for months." [code]="code">
          <div style="width: 100%;">
            <cw-calendar [events]="events" (dateSelect)="picked.set($event)" (eventClick)="lastEvent.set($event.title)" />
            <p class="hint">Selected: {{ picked() ? picked()!.toDateString() : ', ' }}@if (lastEvent()) { · Last event: {{ lastEvent() }} }</p>
          </div>
        </doc-section>

        <doc-section title="Monday-first week" description="Set weekStartsOn to 1 to start weeks on Monday; month & weekday names follow the locale." [code]="mondayCode">
          <div style="width: 100%;">
            <cw-calendar [events]="events" [weekStartsOn]="1" />
          </div>
        </doc-section>
      </doc-tab>

      <doc-tab label="API"><doc-api [props]="props" [events]="apiEvents" /></doc-tab>
      <doc-tab label="Theming"><doc-theming [tokens]="tokens" /></doc-tab>
    </doc-page>
  `
})
export class CalendarDocComponent {
  readonly picked = signal<Date | null>(null);
  readonly lastEvent = signal<string>('');

  private readonly base = new Date();
  private day(offset: number): Date {
    return new Date(this.base.getFullYear(), this.base.getMonth(), offset);
  }
  readonly events: CwCalendarEvent[] = [
    { date: this.day(3), title: 'Team sync', color: '#6c63ff' },
    { date: this.day(3), title: 'Design review', color: '#22c55e' },
    { date: this.day(3), title: '1:1 with Sam', color: '#f59e0b' },
    { date: this.day(3), title: 'Roadmap', color: '#ec4899' },
    { date: this.day(12), title: 'Launch', color: '#22c55e' },
    { date: this.day(18), title: 'Ship v2.0', color: '#6c63ff' },
    { date: this.day(18), title: 'Retro', color: '#14b8a6' },
    { date: this.day(25), title: 'Board meeting', color: '#ef4444' }
  ];

  code = `<cw-calendar [events]="events"
  (dateSelect)="onDay($event)"
  (eventClick)="onEvent($event)" />`;
  mondayCode = `<cw-calendar [events]="events" [weekStartsOn]="1" />`;

  props = [
    { name: 'date', type: 'Date', default: 'today', description: 'Initial month to display (any day within it).' },
    { name: 'events', type: 'CwCalendarEvent[]', default: '[]', description: 'Events to render ({ date, title, color? }).' },
    { name: 'selectedDate', type: 'Date | null', default: 'null', description: 'Initially-selected day.' },
    { name: 'weekStartsOn', type: 'number', default: '0', description: 'First day of the week (0 = Sunday, 1 = Monday).' },
    { name: 'maxEventsPerDay', type: 'number', default: '3', description: 'Chips per day before collapsing into “+N more”.' },
    { name: 'locale', type: 'string', default: 'runtime', description: 'BCP-47 locale for month / weekday names.' }
  ];
  apiEvents = [
    { name: 'dateSelect', type: 'Date', description: 'Emitted when a day is clicked.' },
    { name: 'eventClick', type: 'CwCalendarEvent', description: 'Emitted when an event chip is clicked.' },
    { name: 'monthChange', type: 'Date', description: 'Emitted (first of month) when navigation changes the month.' }
  ];
  tokens = [
    { token: '--cw-surface / --cw-divider', description: 'Calendar background & cell borders.' },
    { token: '--cw-primary', description: 'Selected day & today accent.' },
    { token: '--cw-primary-soft', description: 'Today highlight background.' },
    { token: '--cw-surface-hover', description: 'Day hover background.' },
    { token: '--cw-text-muted', description: 'Weekday headers & out-of-month days.' }
  ];
}
