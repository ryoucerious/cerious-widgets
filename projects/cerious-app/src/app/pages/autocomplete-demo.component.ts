import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-autocomplete-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AutoCompleteComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="AutoComplete" description="A typeahead input that filters options as you type — virtualized with ngx-cerious-scroll for large suggestion pools.">
      <app-demo-section title="Basic" description="Type to filter; ↑ ↓ to move, Enter to pick." [code]="basicCode">
        <cw-autocomplete [options]="countries" placeholder="Search countries" [(ngModel)]="country" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Selected: {{ country ?? '—' }}</span>
      </app-demo-section>

      <app-demo-section title="10,000 options — virtualized" description="The suggestions panel renders through cerious-scroll." [code]="virtualCode">
        <cw-autocomplete [options]="many" placeholder="Search 10,000 items" [(ngModel)]="item" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class AutoCompleteDemoComponent {
  countries = [
    'Germany', 'France', 'Finland', 'Georgia', 'Ghana', 'Greece',
    'Spain', 'Sweden', 'Switzerland', 'Japan', 'Jordan', 'Kenya'
  ];
  country: string | null = null;

  many = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);
  item: string | null = null;

  basicCode = `<cw-autocomplete [options]="countries" placeholder="Search countries" [(ngModel)]="country" />`;
  virtualCode = `// 10,000 options — the suggestions panel is virtualized with ngx-cerious-scroll
<cw-autocomplete [options]="many" [(ngModel)]="item" />`;
}
