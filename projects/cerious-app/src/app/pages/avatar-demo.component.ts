import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AvatarComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-avatar-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Avatar" description="Represents a user or entity as an image, initials, or icon.">
      <app-demo-section title="Initials" [code]="labelCode">
        <cw-avatar label="JK" />
        <cw-avatar label="AB" />
        <cw-avatar label="MZ" />
      </app-demo-section>

      <app-demo-section title="Shapes" description="Circle (default) or square." [code]="shapeCode">
        <cw-avatar label="CW" />
        <cw-avatar label="CW" shape="square" />
      </app-demo-section>

      <app-demo-section title="Sizes" [code]="sizeCode">
        <cw-avatar label="S" size="small" />
        <cw-avatar label="M" />
        <cw-avatar label="L" size="large" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class AvatarDemoComponent {
  labelCode = `<cw-avatar label="JK" />
<cw-avatar label="AB" />`;

  shapeCode = `<cw-avatar label="CW" />
<cw-avatar label="CW" shape="square" />`;

  sizeCode = `<cw-avatar label="S" size="small" />
<cw-avatar label="M" />
<cw-avatar label="L" size="large" />`;
}
