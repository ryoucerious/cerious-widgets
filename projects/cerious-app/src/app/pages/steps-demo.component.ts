import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StepsComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-steps-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepsComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Steps" description="A numbered progress sequence — completed steps show a check, the current step is highlighted.">
      <app-demo-section title="Basic" [code]="basicCode">
        <div style="width: 100%; max-width: 36rem;">
          <cw-steps [items]="items" [activeIndex]="1" />
        </div>
      </app-demo-section>

      <app-demo-section title="Clickable" description="Click a step to jump to it." [code]="clickableCode">
        <div style="width: 100%; max-width: 36rem;">
          <cw-steps [items]="items" [activeIndex]="0" clickable />
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class StepsDemoComponent {
  items = [{ label: 'Cart' }, { label: 'Shipping' }, { label: 'Payment' }, { label: 'Confirm' }];

  basicCode = `<cw-steps [items]="[{ label: 'Cart' }, { label: 'Shipping' }, { label: 'Payment' }]" [activeIndex]="1" />`;
  clickableCode = `<cw-steps [items]="items" clickable (activeIndexChange)="go($event)" />`;
}
