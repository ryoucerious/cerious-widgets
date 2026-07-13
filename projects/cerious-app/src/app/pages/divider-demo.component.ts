import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DividerComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-divider-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DividerComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Divider" description="A separator line between content, horizontal or vertical, with an optional inline label.">
      <app-demo-section title="Basic" [code]="basicCode">
        <div style="width: 100%;">
          <p>Content above</p>
          <cw-divider />
          <p>Content below</p>
        </div>
      </app-demo-section>

      <app-demo-section title="With label" description="Project content to render a label on the line; align it left, center or right." [code]="labelCode">
        <div style="width: 100%;">
          <cw-divider align="left">Left</cw-divider>
          <cw-divider>Center</cw-divider>
          <cw-divider align="right">Right</cw-divider>
        </div>
      </app-demo-section>

      <app-demo-section title="Dashed" [code]="dashedCode">
        <div style="width: 100%;">
          <cw-divider type="dashed" />
        </div>
      </app-demo-section>

      <app-demo-section title="Vertical" [code]="verticalCode">
        <div style="display: flex; align-items: center; min-height: 4rem;">
          <span>Left</span>
          <cw-divider layout="vertical" />
          <span>Middle</span>
          <cw-divider layout="vertical" />
          <span>Right</span>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class DividerDemoComponent {
  basicCode = `<cw-divider />`;
  labelCode = `<cw-divider align="left">Left</cw-divider>
<cw-divider>Center</cw-divider>
<cw-divider align="right">Right</cw-divider>`;
  dashedCode = `<cw-divider type="dashed" />`;
  verticalCode = `<span>Left</span>
<cw-divider layout="vertical" />
<span>Right</span>`;
}
