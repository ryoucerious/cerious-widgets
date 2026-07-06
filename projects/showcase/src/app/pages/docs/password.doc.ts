import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-password-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PasswordComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="password"><doc-tab label="Features">
      <doc-section title="With strength meter" description="Type to see the strength update." [code]="basicCode">
        <cw-password [(ngModel)]="password" placeholder="Enter a password" />
      </doc-section>

      <doc-section title="No feedback" [code]="plainCode">
        <cw-password [(ngModel)]="plain" [feedback]="false" placeholder="Password" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class PasswordDocComponent {
  readonly apiProps = [
    { name: "placeholder", type: "string", default: "''", description: "Input placeholder." },
    { name: "feedback", type: "boolean", default: "true", description: "Show the strength meter." },
    { name: "toggleMask", type: "boolean", default: "true", description: "Show the visibility toggle." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable the control (also settable via forms `setDisabledState`)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." }
  ];

  password = '';
  plain = '';

  basicCode = `<cw-password [(ngModel)]="password" placeholder="Enter a password" />`;
  plainCode = `<cw-password [(ngModel)]="password" [feedback]="false" />`;
}
