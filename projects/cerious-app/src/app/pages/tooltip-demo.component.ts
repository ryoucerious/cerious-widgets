import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, TooltipDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipDirective, ButtonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Tooltip" description="A small text bubble shown next to an element on hover or focus.">
      <app-demo-section title="Basic" description="Hover or focus the button." [code]="basicCode">
        <button cwButton severity="secondary" variant="outlined" cwTooltip="This is a helpful tooltip">Hover me</button>
      </app-demo-section>

      <app-demo-section title="Positions" [code]="positionCode">
        <button cwButton severity="secondary" variant="outlined" cwTooltip="On top" cwTooltipPosition="top">Top</button>
        <button cwButton severity="secondary" variant="outlined" cwTooltip="On the right" cwTooltipPosition="right">Right</button>
        <button cwButton severity="secondary" variant="outlined" cwTooltip="Below" cwTooltipPosition="bottom">Bottom</button>
        <button cwButton severity="secondary" variant="outlined" cwTooltip="On the left" cwTooltipPosition="left">Left</button>
      </app-demo-section>
    </app-demo-page>
  `
})
export class TooltipDemoComponent {
  basicCode = `<button cwButton cwTooltip="This is a helpful tooltip">Hover me</button>`;
  positionCode = `<button cwButton cwTooltip="On top" cwTooltipPosition="top">Top</button>`;
}
