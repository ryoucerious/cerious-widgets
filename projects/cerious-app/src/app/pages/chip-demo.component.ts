import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChipComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-chip-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChipComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Chip" description="A compact element for an input, attribute or filter value — removable and able to carry an image or icon.">
      <app-demo-section title="Basic" [code]="basicCode">
        <cw-chip label="Angular" />
        <cw-chip label="TypeScript" />
        <cw-chip label="RxJS" />
      </app-demo-section>

      <app-demo-section title="Removable" description="The ✕ removes the chip and emits remove." [code]="removableCode">
        <cw-chip label="Filter: Active" removable />
        <cw-chip label="Region: EU" removable />
      </app-demo-section>

      <app-demo-section title="With image" [code]="imageCode">
        <cw-chip label="Olivia Rhye" image="https://i.pravatar.cc/40?img=1" removable />
        <cw-chip label="Phoenix Baker" image="https://i.pravatar.cc/40?img=2" removable />
      </app-demo-section>
    </app-demo-page>
  `
})
export class ChipDemoComponent {
  basicCode = `<cw-chip label="Angular" />`;
  removableCode = `<cw-chip label="Filter: Active" removable (remove)="onRemove()" />`;
  imageCode = `<cw-chip label="Olivia Rhye" image="olivia.png" removable />`;
}
