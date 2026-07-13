import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-toggle-switch-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToggleSwitchComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="ToggleSwitch" description="An on/off switch over a real native checkbox — keyboard, focus and forms stay native.">
      <app-demo-section title="Basic" description="Bind with ngModel." [code]="basicCode">
        <cw-toggle-switch label="Notifications" [(ngModel)]="notify" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Value: {{ notify }}</span>
      </app-demo-section>

      <app-demo-section title="Disabled" [code]="disabledCode">
        <cw-toggle-switch label="Disabled" disabled />
        <cw-toggle-switch label="Disabled, on" disabled [ngModel]="true" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class ToggleSwitchDemoComponent {
  notify = true;

  basicCode = `<cw-toggle-switch label="Notifications" [(ngModel)]="notify" />`;
  disabledCode = `<cw-toggle-switch label="Disabled" disabled />
<cw-toggle-switch label="Disabled, on" disabled [ngModel]="true" />`;
}
