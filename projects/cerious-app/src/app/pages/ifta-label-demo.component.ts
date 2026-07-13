import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IftaLabelComponent, InputTextDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-ifta-label-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IftaLabelComponent, InputTextDirective, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="IftaLabel" description="A small label pinned to the top of the field, with the control below it in the same box. Unlike FloatLabel, the label is always shown.">
      <app-demo-section title="Basic" [code]="code">
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
          <cw-ifta-label label="Email">
            <input cwInput [(ngModel)]="email" />
          </cw-ifta-label>
          <cw-ifta-label label="Company">
            <input cwInput [(ngModel)]="company" />
          </cw-ifta-label>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class IftaLabelDemoComponent {
  email = '';
  company = '';

  code = `<cw-ifta-label label="Email">
  <input cwInput [(ngModel)]="email" />
</cw-ifta-label>`;
}
