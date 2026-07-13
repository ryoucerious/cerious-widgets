import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, PopoverDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-popover-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PopoverDirective, ButtonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Popover" description="The anchored-overlay primitive: a floating panel positioned against its trigger. Menus, dropdowns, and tooltips build on this.">
      <app-demo-section title="Basic" description="Click to open; click outside or press Esc to close." [code]="basicCode">
        <button cwButton [cwPopover]="menu">Open menu ▾</button>
        <ng-template #menu>
          <div class="pop-menu">
            @for (item of ['Profile', 'Settings', 'Sign out']; track item) {
              <div class="pop-menu__item">{{ item }}</div>
            }
          </div>
        </ng-template>
      </app-demo-section>

      <app-demo-section title="Placement" description="Position the panel on any side; it flips when there is no room." [code]="placementCode">
        <button cwButton variant="outlined" [cwPopover]="tip" cwPopoverPlacement="top">Top</button>
        <button cwButton variant="outlined" [cwPopover]="tip" cwPopoverPlacement="right">Right</button>
        <button cwButton variant="outlined" [cwPopover]="tip" cwPopoverPlacement="bottom">Bottom</button>
        <ng-template #tip>
          <div style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">A small anchored panel.</div>
        </ng-template>
      </app-demo-section>
    </app-demo-page>
  `,
  styles: [`
    .pop-menu { min-width: 168px; display: flex; flex-direction: column; gap: 2px; font-size: 0.85rem; }
    .pop-menu__item { padding: 7px 10px; border-radius: var(--cw-radius); cursor: pointer; color: var(--cw-text); }
    .pop-menu__item:hover { background: var(--cw-surface-raised); }
  `]
})
export class PopoverDemoComponent {
  basicCode = `<button cwButton [cwPopover]="menu">Open menu ▾</button>
<ng-template #menu> ...panel content... </ng-template>`;

  placementCode = `<button cwButton [cwPopover]="tip" cwPopoverPlacement="top">Top</button>
<button cwButton [cwPopover]="tip" cwPopoverPlacement="right">Right</button>`;
}
