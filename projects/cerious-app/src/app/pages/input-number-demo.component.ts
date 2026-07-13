import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-input-number-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputNumberComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="InputNumber" description="A numeric input with stepper buttons, min/max clamping and currency formatting.">
      <app-demo-section title="Basic" [code]="basicCode">
        <cw-input-number [(ngModel)]="qty" [min]="0" [max]="99" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Qty: {{ qty }}</span>
      </app-demo-section>

      <app-demo-section title="Currency" [code]="currencyCode">
        <cw-input-number [(ngModel)]="price" mode="currency" currency="USD" [step]="0.5" />
      </app-demo-section>

      <app-demo-section title="Without buttons & disabled" [code]="plainCode">
        <cw-input-number [(ngModel)]="plain" [showButtons]="false" />
        <cw-input-number [ngModel]="42" disabled />
      </app-demo-section>
    </app-demo-page>
  `
})
export class InputNumberDemoComponent {
  qty = 5;
  price = 19.99;
  plain = 100;

  basicCode = `<cw-input-number [(ngModel)]="qty" [min]="0" [max]="99" />`;
  currencyCode = `<cw-input-number [(ngModel)]="price" mode="currency" currency="USD" [step]="0.5" />`;
  plainCode = `<cw-input-number [(ngModel)]="value" [showButtons]="false" />`;
}
