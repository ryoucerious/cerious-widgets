import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-radio-button-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RadioButtonComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="radio-button"><doc-tab label="Features">
      <doc-section title="Group" description="Radios sharing a name and model form a group." [code]="groupCode">
        <cw-radio-button name="size" value="sm" label="Small" [(ngModel)]="size" />
        <cw-radio-button name="size" value="md" label="Medium" [(ngModel)]="size" />
        <cw-radio-button name="size" value="lg" label="Large" [(ngModel)]="size" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Selected: {{ size ?? ', ' }}</span>
      </doc-section>

      <doc-section title="Disabled" [code]="disabledCode">
        <cw-radio-button name="d" value="a" label="Disabled" disabled />
        <cw-radio-button name="d" value="b" label="Disabled, selected" disabled [ngModel]="'b'" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class RadioButtonDocComponent {
  readonly apiProps = [
    { name: "value", type: "unknown", default: "undefined", description: "This radio's own value; selected when the bound model equals it." },
    { name: "name", type: "string", default: "''", description: "Native group name, radios sharing a name form a keyboard group." },
    { name: "label", type: "string", default: "''", description: "Text label rendered after the control (projected content also renders)." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable the control (also settable via forms `setDisabledState`)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." }
  ];

  size: string | null = 'md';

  groupCode = `<cw-radio-button name="size" value="sm" label="Small" [(ngModel)]="size" />
<cw-radio-button name="size" value="md" label="Medium" [(ngModel)]="size" />
<cw-radio-button name="size" value="lg" label="Large" [(ngModel)]="size" />`;
  disabledCode = `<cw-radio-button name="d" value="a" label="Disabled" disabled />`;
}
