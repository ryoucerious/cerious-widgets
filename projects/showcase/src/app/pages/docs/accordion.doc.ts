import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-accordion-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccordionComponent, AccordionPanelComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="accordion"><doc-tab label="Features">
      <doc-section title="Exclusive (default)" [code]="basicCode">
        <cw-accordion style="width: 100%; max-width: 32rem;">
          <cw-accordion-panel header="What is cerious-widgets?" expanded>
            An Angular component library built around a virtualized data grid.
          </cw-accordion-panel>
          <cw-accordion-panel header="How do themes work?">
            Runtime CSS custom properties, switch with a data-cw-theme attribute.
          </cw-accordion-panel>
          <cw-accordion-panel header="Is it accessible?">
            Controls wrap real native inputs so keyboard and forms stay native.
          </cw-accordion-panel>
        </cw-accordion>
      </doc-section>

      <doc-section title="Multiple open" [code]="multipleCode">
        <cw-accordion multiple style="width: 100%; max-width: 32rem;">
          <cw-accordion-panel header="Panel one" expanded>Content one.</cw-accordion-panel>
          <cw-accordion-panel header="Panel two" expanded>Content two.</cw-accordion-panel>
        </cw-accordion>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class AccordionDocComponent {
  readonly apiProps = [
    { name: "header", type: "string", default: "''", description: "The header label." },
    { name: "expanded", type: "boolean", default: "false", description: "Start expanded." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable toggling." },
    { name: "multiple", type: "boolean", default: "false", description: "Allow several panels to be open at once." }
  ];
  readonly apiEvents = [
    { name: "expandedChange", type: "boolean", description: "Emitted with the new state whenever the panel is toggled." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-divider", description: "Divider line colour." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-secondary", description: "Secondary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius", description: "Corner radius." }
  ];

  basicCode = `<cw-accordion>
  <cw-accordion-panel header="Section 1" expanded>…</cw-accordion-panel>
  <cw-accordion-panel header="Section 2">…</cw-accordion-panel>
</cw-accordion>`;
  multipleCode = `<cw-accordion multiple>
  <cw-accordion-panel header="Panel one" expanded>…</cw-accordion-panel>
  <cw-accordion-panel header="Panel two" expanded>…</cw-accordion-panel>
</cw-accordion>`;
}
