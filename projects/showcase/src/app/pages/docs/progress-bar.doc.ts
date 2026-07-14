import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, ProgressBarComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-progress-bar-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBarComponent, ButtonComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="progress-bar"><doc-tab label="Features">
      <doc-section title="Determinate" [code]="determinateCode">
        <cw-progress-bar [value]="35" showValue style="max-width: 320px;" aria-label="Upload progress" />
      </doc-section>

      <doc-section title="Interactive" description="Bind the value to reflect live progress." [code]="interactiveCode">
        <div style="width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 0.75rem;">
          <cw-progress-bar [value]="value" showValue aria-label="Progress" />
          <div style="display: flex; gap: 0.5rem;">
            <button cwButton size="small" variant="outlined" (click)="value = clamp(value - 10)">−10</button>
            <button cwButton size="small" (click)="value = clamp(value + 10)">+10</button>
          </div>
        </div>
      </doc-section>

      <doc-section title="Indeterminate" description="Omit the value for an animated sweep." [code]="indeterminateCode">
        <cw-progress-bar mode="indeterminate" style="max-width: 320px;" aria-label="Loading" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class ProgressBarDocComponent {
  readonly apiProps = [
    { name: "value", type: "number", default: "0", description: "Completion percentage (0-100), used in determinate mode." },
    { name: "mode", type: "CwProgressMode", default: "'determinate'", description: "Determinate (tracks `value`) or indeterminate (animated)." },
    { name: "showValue", type: "boolean", default: "false", description: "Show the numeric percentage beside the bar." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-font", description: "Font family." },
    { token: "--cw-neutral-bg", description: "Themed via this token." }
  ];

  value = 40;

  clamp(v: number): number {
    return Math.max(0, Math.min(100, v));
  }

  determinateCode = `<cw-progress-bar [value]="35" showValue />`;
  interactiveCode = `<cw-progress-bar [value]="value" showValue />`;
  indeterminateCode = `<cw-progress-bar mode="indeterminate" />`;
}
