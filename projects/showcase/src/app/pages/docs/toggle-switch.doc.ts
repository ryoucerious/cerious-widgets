import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-toggle-switch-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToggleSwitchComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="toggle-switch"><doc-tab label="Features">
      <doc-section title="Basic" description="Bind with ngModel." [code]="basicCode">
        <cw-toggle-switch label="Notifications" [(ngModel)]="notify" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Value: {{ notify }}</span>
      </doc-section>

      <doc-section title="Disabled" [code]="disabledCode">
        <cw-toggle-switch label="Disabled" disabled />
        <cw-toggle-switch label="Disabled, on" disabled [ngModel]="true" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class ToggleSwitchDocComponent {
  readonly apiProps = [
    { name: "label", type: "string", default: "''", description: "Text label rendered after the switch (projected content also renders)." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable the control (also settable via forms `setDisabledState`)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-primary", description: "Primary / brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-shadow-sm", description: "Subtle elevation shadow." },
    { token: "--cw-font", description: "Font family." }
  ];

  notify = true;

  basicCode = `<cw-toggle-switch label="Notifications" [(ngModel)]="notify" />`;
  disabledCode = `<cw-toggle-switch label="Disabled" disabled />
<cw-toggle-switch label="Disabled, on" disabled [ngModel]="true" />`;
}
