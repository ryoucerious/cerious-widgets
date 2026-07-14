import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-autocomplete-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AutoCompleteComponent, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="autocomplete">
      <doc-tab label="Features">
        <doc-section title="Basic" description="A typeahead input that filters options as you type." [code]="basicCode">
          <cw-autocomplete [options]="countries" [(ngModel)]="country" placeholder="Search countries" style="min-width: 18rem;" />
          <p class="hint">Value: {{ country ?? ', ' }}</p>
        </doc-section>

        <doc-section title="Minimum length" description="Wait for a few characters before showing suggestions." [code]="minCode">
          <cw-autocomplete [options]="countries" [(ngModel)]="country2" [minLength]="2" placeholder="Type 2+ letters" style="min-width: 18rem;" />
        </doc-section>

        <doc-section title="10,000 options, virtualized"
          description="The suggestions panel renders through ngx-cerious-scroll, so huge pools stay smooth."
          [code]="virtualCode">
          <cw-autocomplete [options]="many" [(ngModel)]="item" placeholder="Search 10,000 items" style="min-width: 18rem;" />
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
  styles: [`.hint { margin-top: 0.6rem; color: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 0.9rem; }`]
})
export class AutoCompleteDocComponent {
  country: string | null = null;
  country2: string | null = null;
  item: string | null = null;
  readonly countries = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Denmark', 'Egypt', 'France', 'Germany', 'India', 'Japan', 'Kenya', 'Mexico', 'Norway', 'Spain'];
  readonly many = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

  basicCode = `<cw-autocomplete [options]="countries" [(ngModel)]="country" placeholder="Search countries" />`;
  minCode = `<cw-autocomplete [options]="countries" [(ngModel)]="country" [minLength]="2" />`;
  virtualCode = `// 10,000 options, the suggestions panel is virtualized with ngx-cerious-scroll
<cw-autocomplete [options]="many" [(ngModel)]="item" />`;

  props = [
    { name: 'options', type: 'unknown[]', default: '[]', description: 'Suggestion pool (objects or primitives).' },
    { name: 'optionLabel / optionValue', type: 'string', default: `'label' / 'value'`, description: 'Keys for label & bound value.' },
    { name: 'minLength', type: 'number', default: '1', description: 'Characters required before suggesting.' },
    { name: 'virtualThreshold', type: 'number', default: '100', description: 'Suggestion count above which the panel virtualizes.' },
    { name: 'placeholder', type: 'string', default: `''`, description: 'Empty-state text.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control.' }
  ];
  events = [{ name: 'ngModelChange', type: 'unknown', description: 'Emitted when a suggestion is chosen.' }];
  tokens = [
    { token: '--cw-surface', description: 'Input & suggestions panel background.' },
    { token: '--cw-primary', description: 'Active suggestion + focus accent.' },
    { token: '--cw-surface-hover', description: 'Suggestion hover.' }
  ];
}
