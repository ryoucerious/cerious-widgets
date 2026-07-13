import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-alert-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Alert" description="An inline message bar for feedback, tinted per severity with a matching icon.">
      <app-demo-section title="Severities" [code]="severityCode">
        <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 32rem;">
          <cw-alert severity="success">Success message</cw-alert>
          <cw-alert severity="info">Info message</cw-alert>
          <cw-alert severity="warn">Warning message</cw-alert>
          <cw-alert severity="danger">Error message</cw-alert>
        </div>
      </app-demo-section>

      <app-demo-section title="Closable" description="The ✕ dismisses the alert and emits closed." [code]="closableCode">
        <div style="width: 100%; max-width: 32rem;">
          <cw-alert severity="info" closable>You can dismiss this message.</cw-alert>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class AlertDemoComponent {
  severityCode = `<cw-alert severity="success">Success message</cw-alert>
<cw-alert severity="info">Info message</cw-alert>
<cw-alert severity="warn">Warning message</cw-alert>
<cw-alert severity="danger">Error message</cw-alert>`;
  closableCode = `<cw-alert severity="info" closable (closed)="onClosed()">You can dismiss this message.</cw-alert>`;
}
