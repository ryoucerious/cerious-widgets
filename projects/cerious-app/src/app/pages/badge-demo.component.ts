import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-badge-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Badge" description="A small count or status indicator, tinted by severity.">
      <app-demo-section title="Severities" [code]="severityCode">
        <cw-badge [value]="2" />
        <cw-badge [value]="5" severity="info" />
        <cw-badge [value]="8" severity="success" />
        <cw-badge [value]="3" severity="warn" />
        <cw-badge [value]="12" severity="danger" />
      </app-demo-section>

      <app-demo-section title="Dot" description="Set the dot attribute for a compact status marker." [code]="dotCode">
        <cw-badge dot />
        <cw-badge dot severity="success" />
        <cw-badge dot severity="warn" />
        <cw-badge dot severity="danger" />
      </app-demo-section>

      <app-demo-section title="Sizes" [code]="sizeCode">
        <cw-badge [value]="7" size="small" />
        <cw-badge [value]="7" />
        <cw-badge [value]="7" size="large" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class BadgeDemoComponent {
  severityCode = `<cw-badge [value]="2" />
<cw-badge [value]="5" severity="info" />
<cw-badge [value]="8" severity="success" />
<cw-badge [value]="3" severity="warn" />
<cw-badge [value]="12" severity="danger" />`;

  dotCode = `<cw-badge dot severity="success" />
<cw-badge dot severity="danger" />`;

  sizeCode = `<cw-badge [value]="7" size="small" />
<cw-badge [value]="7" />
<cw-badge [value]="7" size="large" />`;
}
