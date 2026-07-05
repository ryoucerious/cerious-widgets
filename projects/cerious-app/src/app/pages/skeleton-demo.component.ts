import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-skeleton-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Skeleton" description="A shimmering placeholder shown while content loads.">
      <app-demo-section title="Shapes" [code]="shapeCode">
        <cw-skeleton width="10rem" height="1rem" />
        <cw-skeleton shape="circle" width="3rem" height="3rem" />
      </app-demo-section>

      <app-demo-section title="Card placeholder" description="Compose skeletons to preview a layout." [code]="cardCode">
        <div style="display: flex; align-items: center; gap: 1rem; width: 100%; max-width: 340px;">
          <cw-skeleton shape="circle" width="3rem" height="3rem" />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
            <cw-skeleton width="70%" height="0.85rem" />
            <cw-skeleton width="45%" height="0.85rem" />
          </div>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class SkeletonDemoComponent {
  shapeCode = `<cw-skeleton width="10rem" height="1rem" />
<cw-skeleton shape="circle" width="3rem" height="3rem" />`;

  cardCode = `<cw-skeleton shape="circle" width="3rem" height="3rem" />
<cw-skeleton width="70%" height="0.85rem" />
<cw-skeleton width="45%" height="0.85rem" />`;
}
