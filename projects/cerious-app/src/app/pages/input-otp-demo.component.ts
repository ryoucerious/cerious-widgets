import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOtpComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-input-otp-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputOtpComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="InputOTP" description="A segmented one-time-code input with auto-advance, backspace and paste-to-fill.">
      <app-demo-section title="6-digit code" [code]="basicCode">
        <cw-input-otp [length]="6" integerOnly [(ngModel)]="code" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Code: {{ code || '—' }}</span>
      </app-demo-section>

      <app-demo-section title="Masked PIN" [code]="maskedCode">
        <cw-input-otp [length]="4" mask integerOnly [(ngModel)]="pin" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class InputOtpDemoComponent {
  code = '';
  pin = '';

  basicCode = `<cw-input-otp [length]="6" integerOnly [(ngModel)]="code" />`;
  maskedCode = `<cw-input-otp [length]="4" mask integerOnly [(ngModel)]="pin" />`;
}
