import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-password-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PasswordComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Password" description="A password input with a show/hide toggle and a strength meter.">
      <app-demo-section title="With strength meter" description="Type to see the strength update." [code]="basicCode">
        <cw-password [(ngModel)]="password" placeholder="Enter a password" />
      </app-demo-section>

      <app-demo-section title="No feedback" [code]="plainCode">
        <cw-password [(ngModel)]="plain" [feedback]="false" placeholder="Password" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class PasswordDemoComponent {
  password = '';
  plain = '';

  basicCode = `<cw-password [(ngModel)]="password" placeholder="Enter a password" />`;
  plainCode = `<cw-password [(ngModel)]="password" [feedback]="false" />`;
}
