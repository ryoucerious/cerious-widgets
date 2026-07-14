import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOtpComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-input-otp-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputOtpComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="input-otp"><doc-tab label="Features">
      <doc-section title="6-digit code" [code]="basicCode">
        <cw-input-otp [length]="6" integerOnly [(ngModel)]="code" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Code: {{ code || ', ' }}</span>
      </doc-section>

      <doc-section title="Masked PIN" [code]="maskedCode">
        <cw-input-otp [length]="4" mask integerOnly [(ngModel)]="pin" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class InputOtpDocComponent {
  readonly apiProps = [
    { name: "length", type: "number", default: "6", description: "Number of character boxes." },
    { name: "mask", type: "boolean", default: "false", description: "Mask characters (show dots)." },
    { name: "integerOnly", type: "boolean", default: "false", description: "Restrict to digits 0-9." },
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

  code = '';
  pin = '';

  basicCode = `<cw-input-otp [length]="6" integerOnly [(ngModel)]="code" />`;
  maskedCode = `<cw-input-otp [length]="4" mask integerOnly [(ngModel)]="pin" />`;
}
