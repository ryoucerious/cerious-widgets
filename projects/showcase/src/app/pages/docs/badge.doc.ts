import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-badge-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="badge"><doc-tab label="Features">
      <doc-section title="Severities" [code]="severityCode">
        <cw-badge [value]="2" />
        <cw-badge [value]="5" severity="info" />
        <cw-badge [value]="8" severity="success" />
        <cw-badge [value]="3" severity="warn" />
        <cw-badge [value]="12" severity="danger" />
      </doc-section>

      <doc-section title="Dot" description="Set the dot attribute for a compact status marker." [code]="dotCode">
        <cw-badge dot />
        <cw-badge dot severity="success" />
        <cw-badge dot severity="warn" />
        <cw-badge dot severity="danger" />
      </doc-section>

      <doc-section title="Sizes" [code]="sizeCode">
        <cw-badge [value]="7" size="small" />
        <cw-badge [value]="7" />
        <cw-badge [value]="7" size="large" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class BadgeDocComponent {
  readonly apiProps = [
    { name: "value", type: "string | number", default: "''", description: "The text/number to display. Ignored when `dot` is set." },
    { name: "severity", type: "CwSeverity", default: "'neutral'", description: "Intent colour." },
    { name: "size", type: "CwBadgeSize", default: "'normal'", description: "Visual size." },
    { name: "dot", type: "boolean", default: "false", description: "Render a small status dot instead of a value." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-font", description: "Font family." },
    { token: "--cw-neutral-bg", description: "Themed via this token." },
    { token: "--cw-neutral-fg", description: "Themed via this token." },
    { token: "--cw-success-bg", description: "Themed via this token." },
    { token: "--cw-success-fg", description: "Themed via this token." },
    { token: "--cw-info-bg", description: "Themed via this token." }
  ];

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
