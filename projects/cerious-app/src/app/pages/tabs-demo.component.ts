import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabComponent, TabsComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-tabs-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TabsComponent, TabComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Tabs" description="A tabbed container — only the active tab's content is rendered. Use ← → to move between tabs.">
      <app-demo-section title="Basic" [code]="basicCode">
        <cw-tabs style="width: 100%; max-width: 32rem;">
          <cw-tab label="Overview">The grid ships with sorting, grouping, pinning and virtual scroll.</cw-tab>
          <cw-tab label="Installation">npm install ngx-cerious-widgets</cw-tab>
          <cw-tab label="Theming">Three themes: Cerious Light, Frost and Dark.</cw-tab>
        </cw-tabs>
      </app-demo-section>

      <app-demo-section title="Disabled tab" [code]="disabledCode">
        <cw-tabs style="width: 100%; max-width: 32rem;">
          <cw-tab label="Active">This tab is available.</cw-tab>
          <cw-tab label="Disabled" disabled>Unreachable.</cw-tab>
          <cw-tab label="Another">Also available.</cw-tab>
        </cw-tabs>
      </app-demo-section>
    </app-demo-page>
  `
})
export class TabsDemoComponent {
  basicCode = `<cw-tabs>
  <cw-tab label="Overview">…</cw-tab>
  <cw-tab label="Installation">…</cw-tab>
  <cw-tab label="Theming">…</cw-tab>
</cw-tabs>`;
  disabledCode = `<cw-tab label="Disabled" disabled>…</cw-tab>`;
}
