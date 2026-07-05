import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-accordion-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccordionComponent, AccordionPanelComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Accordion" description="Collapsible panels; grouping them makes opening one collapse the others.">
      <app-demo-section title="Exclusive (default)" [code]="basicCode">
        <cw-accordion style="width: 100%; max-width: 32rem;">
          <cw-accordion-panel header="What is cerious-widgets?" expanded>
            An Angular component library built around a virtualized data grid.
          </cw-accordion-panel>
          <cw-accordion-panel header="How do themes work?">
            Runtime CSS custom properties — switch with a data-cw-theme attribute.
          </cw-accordion-panel>
          <cw-accordion-panel header="Is it accessible?">
            Controls wrap real native inputs so keyboard and forms stay native.
          </cw-accordion-panel>
        </cw-accordion>
      </app-demo-section>

      <app-demo-section title="Multiple open" [code]="multipleCode">
        <cw-accordion multiple style="width: 100%; max-width: 32rem;">
          <cw-accordion-panel header="Panel one" expanded>Content one.</cw-accordion-panel>
          <cw-accordion-panel header="Panel two" expanded>Content two.</cw-accordion-panel>
        </cw-accordion>
      </app-demo-section>
    </app-demo-page>
  `
})
export class AccordionDemoComponent {
  basicCode = `<cw-accordion>
  <cw-accordion-panel header="Section 1" expanded>…</cw-accordion-panel>
  <cw-accordion-panel header="Section 2">…</cw-accordion-panel>
</cw-accordion>`;
  multipleCode = `<cw-accordion multiple>
  <cw-accordion-panel header="Panel one" expanded>…</cw-accordion-panel>
  <cw-accordion-panel header="Panel two" expanded>…</cw-accordion-panel>
</cw-accordion>`;
}
