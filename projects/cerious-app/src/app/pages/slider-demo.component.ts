import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-slider-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SliderComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Slider" description="A numeric slider over a real native range input, with a value bubble above the thumb.">
      <app-demo-section title="Basic" description="Bind with ngModel." [code]="basicCode">
        <div style="width: 100%; max-width: 20rem;">
          <cw-slider [(ngModel)]="volume" />
        </div>
      </app-demo-section>

      <app-demo-section title="Min / max / step" [code]="rangeCode">
        <div style="width: 100%; max-width: 20rem;">
          <cw-slider [min]="0" [max]="200" [step]="10" [(ngModel)]="limit" />
        </div>
      </app-demo-section>

      <app-demo-section title="Without bubble & disabled" [code]="plainCode">
        <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 20rem;">
          <cw-slider [showValue]="false" [(ngModel)]="plain" />
          <cw-slider disabled [ngModel]="30" [showValue]="false" />
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class SliderDemoComponent {
  volume = 50;
  limit = 120;
  plain = 65;

  basicCode = `<cw-slider [(ngModel)]="volume" />`;
  rangeCode = `<cw-slider [min]="0" [max]="200" [step]="10" [(ngModel)]="limit" />`;
  plainCode = `<cw-slider [showValue]="false" [(ngModel)]="value" />
<cw-slider disabled [ngModel]="30" [showValue]="false" />`;
}
