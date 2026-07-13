import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelComponent, InputTextDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-float-label-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FloatLabelComponent, InputTextDirective, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="FloatLabel" description="Wraps a control with a label that sits inside the field, then floats up on focus or when filled.">
      <app-demo-section title="Basic" description="Focus the field or type to float the label." [code]="code">
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
          <cw-float-label label="Email">
            <input cwInput [(ngModel)]="email" />
          </cw-float-label>
          <cw-float-label label="Full name">
            <input cwInput [(ngModel)]="name" />
          </cw-float-label>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class FloatLabelDemoComponent {
  email = '';
  name = '';

  code = `<cw-float-label label="Email">
  <input cwInput [(ngModel)]="email" />
</cw-float-label>`;
}
