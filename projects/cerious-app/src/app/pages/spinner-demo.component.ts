import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpinnerComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-spinner-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpinnerComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Spinner" description="An indeterminate loading indicator in the accent colour.">
      <app-demo-section title="Sizes" [code]="sizeCode">
        <cw-spinner size="1.25rem" />
        <cw-spinner size="2rem" />
        <cw-spinner size="3rem" />
      </app-demo-section>

      <app-demo-section title="Stroke width" [code]="strokeCode">
        <cw-spinner size="2.5rem" [strokeWidth]="2" />
        <cw-spinner size="2.5rem" [strokeWidth]="4" />
        <cw-spinner size="2.5rem" [strokeWidth]="7" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class SpinnerDemoComponent {
  sizeCode = `<cw-spinner size="1.25rem" />
<cw-spinner size="2rem" />
<cw-spinner size="3rem" />`;

  strokeCode = `<cw-spinner size="2.5rem" [strokeWidth]="2" />
<cw-spinner size="2.5rem" [strokeWidth]="7" />`;
}
