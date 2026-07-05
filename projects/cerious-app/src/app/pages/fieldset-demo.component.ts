import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldsetComponent, InputTextDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-fieldset-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FieldsetComponent, InputTextDirective, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Fieldset" description="A bordered content group with a legend, optionally collapsible.">
      <app-demo-section title="Basic" [code]="basicCode">
        <cw-fieldset legend="Shipping address" style="width: 100%; max-width: 28rem;">
          Enter where the order should be delivered. All fields are optional in this demo.
        </cw-fieldset>
      </app-demo-section>

      <app-demo-section title="Toggleable" [code]="toggleCode">
        <cw-fieldset legend="Advanced options" toggleable style="width: 100%; max-width: 28rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <input cwInput placeholder="Coupon code" />
            <input cwInput placeholder="Gift message" />
          </div>
        </cw-fieldset>
      </app-demo-section>
    </app-demo-page>
  `
})
export class FieldsetDemoComponent {
  basicCode = `<cw-fieldset legend="Shipping address">…</cw-fieldset>`;
  toggleCode = `<cw-fieldset legend="Advanced options" toggleable>…</cw-fieldset>`;
}
