import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TagComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-tag-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Tag" description="A labelled pill used to categorise or highlight content.">
      <app-demo-section title="Severities" [code]="severityCode">
        <cw-tag value="Default" />
        <cw-tag value="Info" severity="info" />
        <cw-tag value="Active" severity="success" />
        <cw-tag value="Pending" severity="warn" />
        <cw-tag value="Error" severity="danger" />
      </app-demo-section>

      <app-demo-section title="Rounded" description="Use the rounded attribute for a pill shape." [code]="roundedCode">
        <cw-tag value="New" rounded />
        <cw-tag value="Beta" severity="info" rounded />
        <cw-tag value="Live" severity="success" rounded />
      </app-demo-section>
    </app-demo-page>
  `
})
export class TagDemoComponent {
  severityCode = `<cw-tag value="Info" severity="info" />
<cw-tag value="Active" severity="success" />
<cw-tag value="Error" severity="danger" />`;

  roundedCode = `<cw-tag value="New" rounded />
<cw-tag value="Live" severity="success" rounded />`;
}
