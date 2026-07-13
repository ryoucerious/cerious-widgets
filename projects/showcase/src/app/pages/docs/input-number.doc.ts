import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberComponent, SelectButtonComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-input-number-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputNumberComponent, SelectButtonComponent, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="input-number">
      <doc-tab label="Features">
        <doc-section title="Basic" description="A numeric input with +/- steppers and arrow-key support." [code]="basicCode">
          <cw-input-number [(ngModel)]="qty" ariaLabel="Quantity" />
          <p class="hint">Value: {{ qty }}</p>
        </doc-section>

        <doc-section title="Min, max & step" description="Clamped to a range on blur; step sizes the buttons and arrow keys." [code]="rangeCode">
          <cw-input-number [(ngModel)]="rating" [min]="0" [max]="10" [step]="0.5" ariaLabel="Rating" />
        </doc-section>

        <doc-section title="Currency" description="Formatted while unfocused, editable as a raw number when focused." [code]="currencyCode">
          <cw-input-number [(ngModel)]="price" mode="currency" currency="USD" ariaLabel="Price" />
        </doc-section>

        <doc-section title="Locale-aware formatting"
          description="Set a per-instance locale, or provide CW_LOCALE app-wide. Switch the locale to see grouping and decimal separators adapt."
          [code]="localeCode">
          <div class="locale-row">
            <cw-select-button [(ngModel)]="locale" [options]="localeOptions" optionLabel="label" optionValue="value" />
            <cw-input-number [(ngModel)]="amount" mode="currency" [currency]="currencyFor()" [locale]="locale" ariaLabel="Amount" />
          </div>
          <p class="hint">{{ locale }} · same value 1234567.89 → formatted above</p>
        </doc-section>

        <doc-section title="Without buttons" description="Hide the steppers for a plain formatted numeric field." [code]="noButtonsCode">
          <cw-input-number [(ngModel)]="plain" [showButtons]="false" placeholder="0" ariaLabel="Amount" />
        </doc-section>
      </doc-tab>

      <doc-tab label="API">
        <doc-api [props]="props" [events]="events" />
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
export class InputNumberDocComponent {
  qty = 3;
  rating = 7.5;
  price = 49.99;
  plain: number | null = null;
  amount = 1234567.89;

  locale = 'en-US';
  readonly localeOptions = [
    { label: 'en-US', value: 'en-US' },
    { label: 'de-DE', value: 'de-DE' },
    { label: 'fr-FR', value: 'fr-FR' },
    { label: 'ja-JP', value: 'ja-JP' }
  ];

  currencyFor(): string {
    return ({ 'en-US': 'USD', 'de-DE': 'EUR', 'fr-FR': 'EUR', 'ja-JP': 'JPY' } as Record<string, string>)[this.locale] ?? 'USD';
  }

  basicCode = `<cw-input-number [(ngModel)]="qty" />`;
  rangeCode = `<cw-input-number [(ngModel)]="rating" [min]="0" [max]="10" [step]="0.5" />`;
  currencyCode = `<cw-input-number [(ngModel)]="price" mode="currency" currency="USD" />`;
  localeCode = `<!-- Per-instance locale -->
<cw-input-number [(ngModel)]="amount" mode="currency" currency="EUR" locale="de-DE" />

<!-- …or set it once for the whole app -->
bootstrapApplication(App, {
  providers: [provideCeriousLocale('de-DE')]
});`;
  noButtonsCode = `<cw-input-number [(ngModel)]="value" [showButtons]="false" />`;

  props = [
    { name: 'mode', type: `'decimal' | 'currency'`, default: `'decimal'`, description: 'Formatting style.' },
    { name: 'currency', type: 'string', default: `'USD'`, description: 'ISO currency code for currency mode.' },
    { name: 'locale', type: 'string', default: `''`, description: 'BCP-47 locale; falls back to CW_LOCALE, then the browser default.' },
    { name: 'min / max', type: 'number | null', default: 'null', description: 'Clamp range (applied on blur).' },
    { name: 'step', type: 'number', default: '1', description: 'Increment for buttons and arrow keys.' },
    { name: 'minFractionDigits / maxFractionDigits', type: 'number', default: '0 / 2', description: 'Fraction digits shown when unfocused.' },
    { name: 'showButtons', type: 'boolean', default: 'true', description: 'Show the +/- steppers.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control.' }
  ];
  events = [
    { name: 'ngModelChange', type: 'number | null', description: 'Emitted as the value changes (ControlValueAccessor).' }
  ];
  tokens = [
    { token: '--cw-input-*', description: 'Inherits the shared input surface, border and focus tokens.' },
    { token: '--cw-primary', description: 'Focus ring accent.' },
    { token: '--cw-radius', description: 'Corner radius.' }
  ];
}
