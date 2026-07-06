import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CwMeterItem, MeterGroupComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-meter-group-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MeterGroupComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="meter-group"><doc-tab label="Features">
      <doc-section title="Storage breakdown" [code]="code">
        <div style="width: 100%; max-width: 30rem;">
          <cw-meter-group [max]="100" [items]="storage" />
        </div>
      </doc-section>

      <doc-section title="Auto total (sum of values)" [code]="autoCode">
        <div style="width: 100%; max-width: 30rem;">
          <cw-meter-group [items]="budget" />
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class MeterGroupDocComponent {
  readonly apiProps = [
    { name: "items", type: "readonly CwMeterItem[]", default: "[]", description: "The segments." },
    { name: "max", type: "number | null", default: "null", description: "Total the segments are measured against. Defaults to the sum of values." },
    { name: "size", type: "number", default: "16", description: "Track thickness in px." },
    { name: "showLegend", type: "boolean", default: "true", description: "Show the legend below the bar." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-secondary", description: "Secondary text colour." },
    { token: "--cw-font", description: "Font family." },
    { token: "--cw-neutral-bg", description: "Themed via this token." }
  ];

  storage: CwMeterItem[] = [
    { label: 'Apps', value: 40, color: '#3b82f6' },
    { label: 'Media', value: 25, color: '#22c55e' },
    { label: 'Documents', value: 15, color: '#f59e0b' },
    { label: 'System', value: 10, color: '#8b5cf6' }
  ];

  budget: CwMeterItem[] = [
    { label: 'Rent', value: 1200 },
    { label: 'Food', value: 600 },
    { label: 'Transport', value: 300 },
    { label: 'Savings', value: 900 }
  ];

  code = `<cw-meter-group [max]="100" [items]="[
  { label: 'Apps', value: 40, color: '#3b82f6' },
  { label: 'Media', value: 25, color: '#22c55e' }
]" />`;
  autoCode = `<cw-meter-group [items]="budget" />`;
}
