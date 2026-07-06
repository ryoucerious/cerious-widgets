import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabComponent, TabsComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-tabs-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TabsComponent, TabComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="tabs"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <cw-tabs style="width: 100%; max-width: 32rem;">
          <cw-tab label="Overview">The grid ships with sorting, grouping, pinning and virtual scroll.</cw-tab>
          <cw-tab label="Installation">npm install ngx-cerious-widgets</cw-tab>
          <cw-tab label="Theming">Three themes: Cerious Light, Frost and Dark.</cw-tab>
        </cw-tabs>
      </doc-section>

      <doc-section title="Disabled tab" [code]="disabledCode">
        <cw-tabs style="width: 100%; max-width: 32rem;">
          <cw-tab label="Active">This tab is available.</cw-tab>
          <cw-tab label="Disabled" disabled>Unreachable.</cw-tab>
          <cw-tab label="Another">Also available.</cw-tab>
        </cw-tabs>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class TabsDocComponent {
  readonly apiProps = [
    { name: "label", type: "string", default: "''", description: "The tab header label." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable selecting this tab." },
    { name: "activeIndex", type: "number", default: "0", description: "Index of the initially active tab." }
  ];
  readonly apiEvents = [
    { name: "activeIndexChange", type: "number", description: "Emitted when the user activates a tab." }
  ];
  readonly themeTokens = [
    { token: "--cw-divider", description: "Divider line colour." },
    { token: "--cw-primary", description: "Primary / brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." }
  ];

  basicCode = `<cw-tabs>
  <cw-tab label="Overview">…</cw-tab>
  <cw-tab label="Installation">…</cw-tab>
  <cw-tab label="Theming">…</cw-tab>
</cw-tabs>`;
  disabledCode = `<cw-tab label="Disabled" disabled>…</cw-tab>`;
}
