import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CwMeterItem, MeterGroupComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-meter-group-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MeterGroupComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="MeterGroup" description="A horizontal multi-segment meter with a legend — for storage breakdowns and budget splits.">
      <app-demo-section title="Storage breakdown" [code]="code">
        <div style="width: 100%; max-width: 30rem;">
          <cw-meter-group [max]="100" [items]="storage" />
        </div>
      </app-demo-section>

      <app-demo-section title="Auto total (sum of values)" [code]="autoCode">
        <div style="width: 100%; max-width: 30rem;">
          <cw-meter-group [items]="budget" />
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class MeterGroupDemoComponent {
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
