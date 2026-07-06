import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-slider-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SliderComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="slider"><doc-tab label="Features">
      <doc-section title="Basic" description="Bind with ngModel." [code]="basicCode">
        <div style="width: 100%; max-width: 20rem;">
          <cw-slider [(ngModel)]="volume" />
        </div>
      </doc-section>

      <doc-section title="Min / max / step" [code]="rangeCode">
        <div style="width: 100%; max-width: 20rem;">
          <cw-slider [min]="0" [max]="200" [step]="10" [(ngModel)]="limit" />
        </div>
      </doc-section>

      <doc-section title="Without bubble & disabled" [code]="plainCode">
        <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 20rem;">
          <cw-slider [showValue]="false" [(ngModel)]="plain" />
          <cw-slider disabled [ngModel]="30" [showValue]="false" />
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class SliderDocComponent {
  readonly apiProps = [
    { name: "min", type: "number", default: "0", description: "Minimum value." },
    { name: "max", type: "number", default: "100", description: "Maximum value." },
    { name: "step", type: "number", default: "1", description: "Step between values." },
    { name: "showValue", type: "boolean", default: "true", description: "Show the value bubble above the thumb." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable the control (also settable via forms `setDisabledState`)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-primary", description: "Primary / brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-shadow-sm", description: "Subtle elevation shadow." },
    { token: "--cw-font", description: "Font family." }
  ];

  volume = 50;
  limit = 120;
  plain = 65;

  basicCode = `<cw-slider [(ngModel)]="volume" />`;
  rangeCode = `<cw-slider [min]="0" [max]="200" [step]="10" [(ngModel)]="limit" />`;
  plainCode = `<cw-slider [showValue]="false" [(ngModel)]="value" />
<cw-slider disabled [ngModel]="30" [showValue]="false" />`;
}
