import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-multi-select-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MultiSelectComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="MultiSelect" description="A multi-select dropdown with chips, filtering, a plugin API — and a cerious-scroll virtualized list for large option sets.">
      <app-demo-section title="Basic" description="Bind an array with ngModel; selections render as chips." [code]="basicCode">
        <cw-multi-select [options]="cities" placeholder="Select cities" [(ngModel)]="selected" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Selected: {{ selected.join(', ') || '—' }}</span>
      </app-demo-section>

      <app-demo-section title="10,000 options — virtualized" description="Above the virtualThreshold the panel renders through ngx-cerious-scroll, so only the visible rows exist in the DOM." [code]="virtualCode">
        <cw-multi-select [options]="many" placeholder="Search 10,000 items" [(ngModel)]="manySelected" />
      </app-demo-section>

      <app-demo-section title="Disabled" [code]="disabledCode">
        <cw-multi-select [options]="cities" disabled placeholder="Disabled" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class MultiSelectDemoComponent {
  cities = [
    { label: 'New York', value: 'ny' },
    { label: 'London', value: 'ld' },
    { label: 'Tokyo', value: 'tk' },
    { label: 'Sydney', value: 'sy' },
    { label: 'Berlin', value: 'br' }
  ];
  selected: string[] = ['ny'];

  many = Array.from({ length: 10000 }, (_, i) => ({ label: `Item ${i + 1}`, value: i + 1 }));
  manySelected: number[] = [];

  basicCode = `<cw-multi-select [options]="cities" placeholder="Select cities" [(ngModel)]="selected" />`;
  virtualCode = `// 10,000 options — the panel list is virtualized with ngx-cerious-scroll
<cw-multi-select [options]="many" [(ngModel)]="selected" />`;
  disabledCode = `<cw-multi-select [options]="cities" disabled />`;
}
