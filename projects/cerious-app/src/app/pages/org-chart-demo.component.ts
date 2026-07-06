import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwOrgNode, OrgChartComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-org-chart-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrgChartComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="OrgChart" description="A top-down hierarchy of connected node cards — org charts, decision trees, taxonomies.">
      <app-demo-section title="Company structure" [code]="code">
        <cw-org-chart [root]="company" (nodeSelect)="selected.set($event.label)" />
        @if (selected()) {
          <p style="margin-top: 0.75rem; color: var(--cw-text-muted);">Selected: <strong>{{ selected() }}</strong></p>
        }
      </app-demo-section>
    </app-demo-page>
  `
})
export class OrgChartDemoComponent {
  readonly selected = signal<string>('');

  company: CwOrgNode = {
    label: 'Ada Lovelace',
    subtitle: 'CEO',
    children: [
      {
        label: 'Grace Hopper',
        subtitle: 'CTO',
        children: [
          { label: 'Linus T.', subtitle: 'Eng Lead' },
          { label: 'Margaret H.', subtitle: 'QA Lead' }
        ]
      },
      {
        label: 'Katherine J.',
        subtitle: 'CFO',
        children: [{ label: 'Alan T.', subtitle: 'Controller' }]
      },
      { label: 'Radia P.', subtitle: 'COO' }
    ]
  };

  code = `<cw-org-chart [root]="company" (nodeSelect)="open($event)" />

company: CwOrgNode = {
  label: 'CEO',
  children: [
    { label: 'CTO', children: [{ label: 'Engineer' }] },
    { label: 'CFO' }
  ]
};`;
}
