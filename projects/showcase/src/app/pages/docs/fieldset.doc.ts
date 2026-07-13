import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldsetComponent, InputTextDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-fieldset-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FieldsetComponent, InputTextDirective, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="fieldset"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <cw-fieldset legend="Shipping address" style="width: 100%; max-width: 28rem;">
          Enter where the order should be delivered. All fields are optional in this demo.
        </cw-fieldset>
      </doc-section>

      <doc-section title="Toggleable" [code]="toggleCode">
        <cw-fieldset legend="Advanced options" toggleable style="width: 100%; max-width: 28rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <input cwInput placeholder="Coupon code" />
            <input cwInput placeholder="Gift message" />
          </div>
        </cw-fieldset>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class FieldsetDocComponent {
  readonly apiProps = [
    { name: "legend", type: "string", default: "''", description: "The legend label." },
    { name: "toggleable", type: "boolean", default: "false", description: "Allow collapsing the content from the legend." },
    { name: "collapsed", type: "boolean", default: "false", description: "Start collapsed (requires `toggleable`)." }
  ];
  readonly apiEvents = [
    { name: "collapsedChange", type: "boolean", description: "Emitted with the new collapsed state on every toggle." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-secondary", description: "Secondary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." }
  ];

  basicCode = `<cw-fieldset legend="Shipping address">…</cw-fieldset>`;
  toggleCode = `<cw-fieldset legend="Advanced options" toggleable>…</cw-fieldset>`;
}
