import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-input-mask-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputMaskComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="input-mask"><doc-tab label="Features">
      <doc-section title="Phone" [code]="phoneCode">
        <cw-input-mask mask="(999) 999-9999" [(ngModel)]="phone" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Value: {{ phone || '—' }}</span>
      </doc-section>

      <doc-section title="Date & serial" [code]="moreCode">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <cw-input-mask mask="99/99/9999" [(ngModel)]="date" />
          <cw-input-mask mask="a*-9999" [(ngModel)]="serial" />
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class InputMaskDocComponent {
  readonly apiProps = [
    { name: "mask", type: "string", default: "''", description: "The mask pattern." },
    { name: "slotChar", type: "string", default: "'_'", description: "Character shown for unfilled slots." },
    { name: "unmask", type: "boolean", default: "false", description: "Emit the raw (unmasked) value instead of the formatted string." },
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

  phone = '';
  date = '';
  serial = '';

  phoneCode = `<cw-input-mask mask="(999) 999-9999" [(ngModel)]="phone" />`;
  moreCode = `<cw-input-mask mask="99/99/9999" [(ngModel)]="date" />
<cw-input-mask mask="a*-9999" [(ngModel)]="serial" />`;
}
