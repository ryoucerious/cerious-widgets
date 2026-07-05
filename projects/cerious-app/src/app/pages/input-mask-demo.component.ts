import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-input-mask-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputMaskComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="InputMask" description="A text input that formats as you type against a mask (9=digit, a=letter, *=alphanumeric).">
      <app-demo-section title="Phone" [code]="phoneCode">
        <cw-input-mask mask="(999) 999-9999" [(ngModel)]="phone" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Value: {{ phone || '—' }}</span>
      </app-demo-section>

      <app-demo-section title="Date & serial" [code]="moreCode">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <cw-input-mask mask="99/99/9999" [(ngModel)]="date" />
          <cw-input-mask mask="a*-9999" [(ngModel)]="serial" />
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class InputMaskDemoComponent {
  phone = '';
  date = '';
  serial = '';

  phoneCode = `<cw-input-mask mask="(999) 999-9999" [(ngModel)]="phone" />`;
  moreCode = `<cw-input-mask mask="99/99/9999" [(ngModel)]="date" />
<cw-input-mask mask="a*-9999" [(ngModel)]="serial" />`;
}
