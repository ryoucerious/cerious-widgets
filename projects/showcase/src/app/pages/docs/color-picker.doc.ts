import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPickerComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-color-picker-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ColorPickerComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="color-picker"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <cw-color-picker [(ngModel)]="brand" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Value: {{ brand }}</span>
      </doc-section>

      <doc-section title="Disabled" [code]="disabledCode">
        <cw-color-picker [ngModel]="'#22c55e'" disabled />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class ColorPickerDocComponent {
  readonly apiProps = [
    { name: "presets", type: "readonly string[]", default: "DEFAULT_PRESETS", description: "Preset swatches shown in the panel." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable the control (also settable via forms `setDisabledState`)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." }
  ];

  brand = '#6366f1';

  basicCode = `<cw-color-picker [(ngModel)]="brand" />`;
  disabledCode = `<cw-color-picker [ngModel]="'#22c55e'" disabled />`;
}
