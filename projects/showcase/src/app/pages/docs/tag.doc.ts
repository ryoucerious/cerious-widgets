import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TagComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-tag-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="tag"><doc-tab label="Features">
      <doc-section title="Severities" [code]="severityCode">
        <cw-tag value="Default" />
        <cw-tag value="Info" severity="info" />
        <cw-tag value="Active" severity="success" />
        <cw-tag value="Pending" severity="warn" />
        <cw-tag value="Error" severity="danger" />
      </doc-section>

      <doc-section title="Rounded" description="Use the rounded attribute for a pill shape." [code]="roundedCode">
        <cw-tag value="New" rounded />
        <cw-tag value="Beta" severity="info" rounded />
        <cw-tag value="Live" severity="success" rounded />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class TagDocComponent {
  readonly apiProps = [
    { name: "value", type: "string", default: "''", description: "The tag label." },
    { name: "severity", type: "CwSeverity", default: "'neutral'", description: "Intent colour." },
    { name: "rounded", type: "boolean", default: "false", description: "Use a fully rounded (pill) shape instead of the default radius." },
    { name: "icon", type: "string", default: "''", description: "Optional leading icon class (e.g. a font-icon class)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-font", description: "Font family." },
    { token: "--cw-neutral-bg", description: "Themed via this token." },
    { token: "--cw-neutral-fg", description: "Themed via this token." },
    { token: "--cw-success-bg", description: "Themed via this token." },
    { token: "--cw-success-fg", description: "Themed via this token." }
  ];

  severityCode = `<cw-tag value="Info" severity="info" />
<cw-tag value="Active" severity="success" />
<cw-tag value="Error" severity="danger" />`;

  roundedCode = `<cw-tag value="New" rounded />
<cw-tag value="Live" severity="success" rounded />`;
}
