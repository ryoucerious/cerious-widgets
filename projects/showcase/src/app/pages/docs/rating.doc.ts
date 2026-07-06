import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-rating-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RatingComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="rating"><doc-tab label="Features">
      <doc-section title="Basic" description="Click the current rating again to clear it." [code]="basicCode">
        <cw-rating [(ngModel)]="score" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Score: {{ score }}</span>
      </doc-section>

      <doc-section title="Custom star count" [code]="starsCode">
        <cw-rating [stars]="10" [(ngModel)]="wide" />
      </doc-section>

      <doc-section title="Readonly & disabled" [code]="readonlyCode">
        <cw-rating readonly [ngModel]="4" />
        <cw-rating disabled [ngModel]="2" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class RatingDocComponent {
  readonly apiProps = [
    { name: "stars", type: "number", default: "5", description: "Number of stars." },
    { name: "readonly", type: "boolean", default: "false", description: "Display-only: no pointer or keyboard interaction." },
    { name: "cancelable", type: "boolean", default: "true", description: "Allow clicking the current rating again to clear it back to 0." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable the control (also settable via forms `setDisabledState`)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." },
    { token: "--cw-warn", description: "Themed via this token." }
  ];

  score = 3;
  wide = 7;

  basicCode = `<cw-rating [(ngModel)]="score" />`;
  starsCode = `<cw-rating [stars]="10" [(ngModel)]="score" />`;
  readonlyCode = `<cw-rating readonly [ngModel]="4" />
<cw-rating disabled [ngModel]="2" />`;
}
