import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-alert-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="alert"><doc-tab label="Features">
      <doc-section title="Severities" [code]="severityCode">
        <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 32rem;">
          <cw-alert severity="success">Success message</cw-alert>
          <cw-alert severity="info">Info message</cw-alert>
          <cw-alert severity="warn">Warning message</cw-alert>
          <cw-alert severity="danger">Error message</cw-alert>
        </div>
      </doc-section>

      <doc-section title="Closable" description="The ✕ dismisses the alert and emits closed." [code]="closableCode">
        <div style="width: 100%; max-width: 32rem;">
          <cw-alert severity="info" closable>You can dismiss this message.</cw-alert>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class AlertDocComponent {
  readonly apiProps = [
    { name: "severity", type: "CwSeverity", default: "'info'", description: "Intent colour and icon." },
    { name: "closable", type: "boolean", default: "false", description: "Show a ✕ button that dismisses the alert." }
  ];
  readonly apiEvents = [
    { name: "closed", type: "void", description: "Emitted when the ✕ button dismisses the alert." }
  ];
  readonly themeTokens = [
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." },
    { token: "--cw-info-bg", description: "Themed via this token." },
    { token: "--cw-info-fg", description: "Themed via this token." },
    { token: "--cw-success-bg", description: "Themed via this token." }
  ];

  severityCode = `<cw-alert severity="success">Success message</cw-alert>
<cw-alert severity="info">Info message</cw-alert>
<cw-alert severity="warn">Warning message</cw-alert>
<cw-alert severity="danger">Error message</cw-alert>`;
  closableCode = `<cw-alert severity="info" closable (closed)="onClosed()">You can dismiss this message.</cw-alert>`;
}
