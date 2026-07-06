import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KnobComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-knob-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KnobComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="knob"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <cw-knob [(ngModel)]="volume" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Volume: {{ volume }}</span>
      </doc-section>

      <doc-section title="Percentage & custom range" [code]="rangeCode">
        <cw-knob [(ngModel)]="progress" valueTemplate="{value}%" [size]="120" />
        <cw-knob [(ngModel)]="temp" [min]="-20" [max]="40" valueTemplate="{value}°" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class KnobDocComponent {
  readonly apiProps = [
    { name: "min", type: "number", default: "0", description: "Minimum value." },
    { name: "max", type: "number", default: "100", description: "Maximum value." },
    { name: "step", type: "number", default: "1", description: "Step for keyboard changes." },
    { name: "size", type: "number", default: "96", description: "Diameter in px." },
    { name: "strokeWidth", type: "number", default: "8", description: "Arc stroke width in px." },
    { name: "showValue", type: "boolean", default: "true", description: "Show the numeric value in the centre." },
    { name: "valueTemplate", type: "string", default: "'{value}'", description: "`printf`-style template for the centre label; `{value}` is replaced." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable the control (also settable via forms `setDisabledState`)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-primary", description: "Primary / brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." },
    { token: "--cw-neutral-bg", description: "Themed via this token." }
  ];

  volume = 40;
  progress = 65;
  temp = 21;

  basicCode = `<cw-knob [(ngModel)]="volume" [min]="0" [max]="100" />`;
  rangeCode = `<cw-knob [(ngModel)]="progress" valueTemplate="{value}%" [size]="120" />`;
}
