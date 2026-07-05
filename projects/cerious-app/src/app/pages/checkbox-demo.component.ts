import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-checkbox-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Checkbox" description="A boolean checkbox over a real native input — keyboard, focus and forms stay native.">
      <app-demo-section title="Basic" description="Bind with ngModel." [code]="basicCode">
        <cw-checkbox label="Remember me" [(ngModel)]="remember" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Value: {{ remember }}</span>
      </app-demo-section>

      <app-demo-section title="Indeterminate" description="Shows a dash until the user interacts." [code]="indeterminateCode">
        <cw-checkbox label="Select all" indeterminate />
      </app-demo-section>

      <app-demo-section title="Disabled" [code]="disabledCode">
        <cw-checkbox label="Disabled" disabled />
        <cw-checkbox label="Disabled, checked" disabled [ngModel]="true" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class CheckboxDemoComponent {
  remember = false;

  basicCode = `<cw-checkbox label="Remember me" [(ngModel)]="remember" />`;
  indeterminateCode = `<cw-checkbox label="Select all" indeterminate />`;
  disabledCode = `<cw-checkbox label="Disabled" disabled />
<cw-checkbox label="Disabled, checked" disabled [ngModel]="true" />`;
}
