import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-checkbox-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="checkbox"><doc-tab label="Features">
      <doc-section title="Basic" description="Bind with ngModel." [code]="basicCode">
        <cw-checkbox label="Remember me" [(ngModel)]="remember" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Value: {{ remember }}</span>
      </doc-section>

      <doc-section title="Indeterminate" description="Shows a dash until the user interacts." [code]="indeterminateCode">
        <cw-checkbox label="Select all" indeterminate />
      </doc-section>

      <doc-section title="Disabled" [code]="disabledCode">
        <cw-checkbox label="Disabled" disabled />
        <cw-checkbox label="Disabled, checked" disabled [ngModel]="true" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class CheckboxDocComponent {
  readonly apiProps = [
    { name: "label", type: "string", default: "''", description: "Text label rendered after the box (projected content also renders)." },
    { name: "indeterminate", type: "boolean", default: "false", description: "Show the indeterminate (dash) state; a user click clears it." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable the control (also settable via forms `setDisabledState`)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." }
  ];

  remember = false;

  basicCode = `<cw-checkbox label="Remember me" [(ngModel)]="remember" />`;
  indeterminateCode = `<cw-checkbox label="Select all" indeterminate />`;
  disabledCode = `<cw-checkbox label="Disabled" disabled />
<cw-checkbox label="Disabled, checked" disabled [ngModel]="true" />`;
}
