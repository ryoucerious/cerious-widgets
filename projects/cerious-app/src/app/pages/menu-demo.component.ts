import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, CwMenuItem, MenuComponent, PopoverDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-menu-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuComponent, ButtonComponent, PopoverDirective, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Menu" description="A vertical menu of actions or links — inline, or inside a popover as a dropdown.">
      <app-demo-section title="Inline" [code]="inlineCode">
        <div style="border: 1px solid var(--cw-border); border-radius: var(--cw-radius); background: var(--cw-surface);">
          <cw-menu [items]="nav" [activeIndex]="0" />
        </div>
      </app-demo-section>

      <app-demo-section title="Dropdown" description="Compose with the popover for an actions menu." [code]="dropdownCode">
        <button cwButton severity="secondary" variant="outlined" [cwPopover]="actionsMenu">Actions ▾</button>
        <ng-template #actionsMenu>
          <cw-menu [items]="actions" />
        </ng-template>
      </app-demo-section>
    </app-demo-page>
  `
})
export class MenuDemoComponent {
  nav: CwMenuItem[] = [
    { label: 'Dashboard' },
    { label: 'Users' },
    { label: 'Settings' },
    { label: 'Reports' }
  ];

  actions: CwMenuItem[] = [
    { label: 'Edit' },
    { label: 'Duplicate' },
    { separator: true },
    { label: 'Delete', danger: true }
  ];

  inlineCode = `<cw-menu [items]="[{ label: 'Dashboard' }, { label: 'Users' }]" [activeIndex]="0" />`;
  dropdownCode = `<button cwButton [cwPopover]="menu">Actions ▾</button>
<ng-template #menu><cw-menu [items]="actions" /></ng-template>`;
}
