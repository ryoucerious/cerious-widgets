import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, ProgressBarComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-progress-bar-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBarComponent, ButtonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="ProgressBar" description="A horizontal progress indicator, determinate or indeterminate.">
      <app-demo-section title="Determinate" [code]="determinateCode">
        <cw-progress-bar [value]="35" showValue style="max-width: 320px;" />
      </app-demo-section>

      <app-demo-section title="Interactive" description="Bind the value to reflect live progress." [code]="interactiveCode">
        <div style="width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 0.75rem;">
          <cw-progress-bar [value]="value" showValue />
          <div style="display: flex; gap: 0.5rem;">
            <button cwButton size="small" variant="outlined" (click)="value = clamp(value - 10)">−10</button>
            <button cwButton size="small" (click)="value = clamp(value + 10)">+10</button>
          </div>
        </div>
      </app-demo-section>

      <app-demo-section title="Indeterminate" description="Omit the value for an animated sweep." [code]="indeterminateCode">
        <cw-progress-bar mode="indeterminate" style="max-width: 320px;" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class ProgressBarDemoComponent {
  value = 40;

  clamp(v: number): number {
    return Math.max(0, Math.min(100, v));
  }

  determinateCode = `<cw-progress-bar [value]="35" showValue />`;
  interactiveCode = `<cw-progress-bar [value]="value" showValue />`;
  indeterminateCode = `<cw-progress-bar mode="indeterminate" />`;
}
