import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { StepDirective, StepperComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-stepper-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepperComponent, StepDirective, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Stepper" description="A wizard: a numbered header over each step's content, with Back / Next navigation. Set linear to require in-order completion.">
      <app-demo-section title="Checkout wizard" [code]="code">
        <div style="width: 100%; max-width: 34rem;">
          <cw-stepper [linear]="true" (activeIndexChange)="active.set($event)">
            <ng-template cwStep label="Cart">
              <p>Review the items in your cart before continuing.</p>
            </ng-template>
            <ng-template cwStep label="Shipping">
              <p>Enter your delivery address and preferred method.</p>
            </ng-template>
            <ng-template cwStep label="Payment">
              <p>Provide your payment details securely.</p>
            </ng-template>
            <ng-template cwStep label="Confirm">
              <p>All set — place your order!</p>
            </ng-template>
          </cw-stepper>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class StepperDemoComponent {
  readonly active = signal(0);

  code = `<cw-stepper [linear]="true">
  <ng-template cwStep label="Cart">…</ng-template>
  <ng-template cwStep label="Payment">…</ng-template>
</cw-stepper>`;
}
