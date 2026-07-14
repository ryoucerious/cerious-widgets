import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent, SelectButtonComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-date-picker-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DatePickerComponent, SelectButtonComponent, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="date-picker">
      <doc-tab label="Features">
        <doc-section title="Basic" description="Click to open a calendar; select a day to set the value." [code]="basicCode">
          <cw-date-picker [(ngModel)]="created" aria-label="Created date" />
          <p class="hint">Value: {{ created ? created.toDateString() : ', ' }}</p>
        </doc-section>

        <doc-section title="Min & max range" description="Days outside the range are disabled." [code]="rangeCode">
          <cw-date-picker [(ngModel)]="delivery" [min]="today" [max]="maxDate" placeholder="Pick a delivery date" aria-label="Delivery date" />
        </doc-section>

        <doc-section title="Locale & first day of week"
          description="Month names, weekday headers and the display format all follow the locale. Set firstDayOfWeek to 1 for Monday-first calendars."
          [code]="localeCode">
          <div class="locale-row">
            <cw-select-button [(ngModel)]="locale" [options]="localeOptions" optionLabel="label" optionValue="value" />
            <cw-date-picker [(ngModel)]="localized" [locale]="locale" [firstDayOfWeek]="firstDay()" aria-label="Localized date" />
          </div>
          <p class="hint">{{ locale }} · week starts {{ firstDay() === 1 ? 'Monday' : 'Sunday' }}</p>
        </doc-section>
      </doc-tab>

      <doc-tab label="API">
        <doc-api [props]="props" [events]="events" [methods]="methods" />
      </doc-tab>

      <doc-tab label="Theming">
        <doc-theming [tokens]="tokens" />
      </doc-tab>
    </doc-page>
  `,
  styles: [`
    .hint { margin-top: 0.6rem; color: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 0.9rem; }
    .locale-row { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
  `]
})
export class DatePickerDocComponent {
  created: Date | null = null;
  delivery: Date | null = null;
  localized: Date | null = new Date();
  readonly today = new Date();
  readonly maxDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  locale = 'en-US';
  readonly localeOptions = [
    { label: 'en-US', value: 'en-US' },
    { label: 'de-DE', value: 'de-DE' },
    { label: 'fr-FR', value: 'fr-FR' },
    { label: 'ja-JP', value: 'ja-JP' }
  ];

  firstDay(): number {
    return this.locale === 'en-US' ? 0 : 1;
  }

  basicCode = `<cw-date-picker [(ngModel)]="created" />`;
  rangeCode = `<cw-date-picker [(ngModel)]="delivery" [min]="today" [max]="maxDate" />`;
  localeCode = `<!-- Per-instance locale + Monday-first weeks -->
<cw-date-picker [(ngModel)]="date" locale="de-DE" [firstDayOfWeek]="1" />

<!-- …or set the locale once for the whole app -->
bootstrapApplication(App, {
  providers: [provideCeriousLocale('de-DE')]
});`;

  props = [
    { name: 'locale', type: 'string', default: `''`, description: 'BCP-47 locale; falls back to CW_LOCALE, then the browser default.' },
    { name: 'firstDayOfWeek', type: 'number', default: '0', description: '0 = Sunday, 1 = Monday.' },
    { name: 'min / max', type: 'Date | null', default: 'null', description: 'Selectable range; out-of-range days are disabled.' },
    { name: 'placeholder', type: 'string', default: `'Select date'`, description: 'Empty-state text.' },
    { name: 'clearable', type: 'boolean', default: 'true', description: 'Show the Clear button in the footer.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control.' }
  ];
  events = [
    { name: 'ngModelChange', type: 'Date | null', description: 'Emitted when a day is selected or cleared.' }
  ];
  methods = [
    { name: 'api.navigateTo(month, year)', type: 'void', description: 'Programmatically show a month (via DatePickerApi / plugins).' },
    { name: 'api.open() / api.close()', type: 'void', description: 'Open or close the calendar panel.' }
  ];
  tokens = [
    { token: '--cw-surface', description: 'Calendar panel & input background.' },
    { token: '--cw-primary', description: 'Selected day + focus accent.' },
    { token: '--cw-surface-hover', description: 'Day hover state.' },
    { token: '--cw-border', description: 'Panel & input border.' }
  ];
}
