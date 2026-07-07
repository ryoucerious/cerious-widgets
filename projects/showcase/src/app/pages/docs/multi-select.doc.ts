import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-multi-select-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MultiSelectComponent, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="multi-select">
      <doc-tab label="Features">
        <doc-section title="Basic" description="Bind an array with ngModel; selections render as chips with a filter box." [code]="basicCode">
          <cw-multi-select [options]="cities" [(ngModel)]="selected" placeholder="Select cities" style="min-width: 18rem;" aria-label="Cities" />
          <p class="hint">Selected: {{ selected.length ? selected.join(', ') : '—' }}</p>
        </doc-section>

        <doc-section title="10,000 options — virtualized"
          description="Above virtualThreshold the panel renders through ngx-cerious-scroll, so only the visible rows exist in the DOM."
          [code]="virtualCode">
          <cw-multi-select [options]="many" [(ngModel)]="manySelected" placeholder="Search 10,000 items" style="min-width: 18rem;" aria-label="Search items" />
        </doc-section>

        <doc-section title="Chip overflow" description="maxChips caps visible chips; the rest collapse into a “+N” pill." [code]="chipCode">
          <cw-multi-select [options]="cities" [(ngModel)]="selected" [maxChips]="2" style="min-width: 18rem;" aria-label="Cities" />
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
export class MultiSelectDocComponent {
  selected: string[] = ['Berlin'];
  manySelected: string[] = [];
  readonly cities = ['Amsterdam', 'Berlin', 'Cairo', 'Denver', 'London', 'Madrid', 'New York', 'Oslo', 'Tokyo'];
  readonly many = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

  basicCode = `<cw-multi-select [options]="cities" [(ngModel)]="selected" placeholder="Select cities" />`;
  virtualCode = `// 10,000 options — the panel list is virtualized with ngx-cerious-scroll
<cw-multi-select [options]="many" [(ngModel)]="selected" />`;
  chipCode = `<cw-multi-select [options]="cities" [(ngModel)]="selected" [maxChips]="2" />`;

  props = [
    { name: 'options', type: 'unknown[]', default: '[]', description: 'Option objects or primitives.' },
    { name: 'optionLabel / optionValue', type: 'string', default: `'label' / 'value'`, description: 'Keys for label & bound value.' },
    { name: 'filterable', type: 'boolean', default: 'true', description: 'Show the in-panel filter box.' },
    { name: 'maxChips', type: 'number', default: '3', description: 'Chips shown before collapsing to “+N”.' },
    { name: 'virtualThreshold', type: 'number', default: '100', description: 'Option count above which the panel virtualizes.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control.' }
  ];
  events = [{ name: 'ngModelChange', type: 'unknown[]', description: 'Emitted with the array of selected values.' }];
  tokens = [
    { token: '--cw-chip-bg / --cw-chip-fg', description: 'Selected-value chip colours.' },
    { token: '--cw-primary', description: 'Checkbox tick + focus accent.' },
    { token: '--cw-surface', description: 'Panel background.' }
  ];
}
