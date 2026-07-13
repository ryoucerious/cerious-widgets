import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent, DrawerComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-drawer-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DrawerComponent, ButtonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Drawer" description="A panel that slides in from the screen edge over a backdrop. Escape, ✕ and backdrop click all close it.">
      <app-demo-section title="From either edge" [code]="code">
        <button cwButton (click)="left.set(true)">Open left</button>
        <button cwButton severity="secondary" variant="outlined" (click)="right.set(true)">Open right</button>

        <cw-drawer header="Navigation" position="left" [visible]="left()" (visibleChange)="left.set($event)">
          A drawer sliding from the left — good for navigation.
        </cw-drawer>

        <cw-drawer header="Filters" position="right" [visible]="right()" (visibleChange)="right.set($event)">
          A drawer sliding from the right — good for filters and detail panes.
        </cw-drawer>
      </app-demo-section>
    </app-demo-page>
  `
})
export class DrawerDemoComponent {
  readonly left = signal(false);
  readonly right = signal(false);

  code = `<button cwButton (click)="open = true">Open</button>
<cw-drawer header="Filters" position="right" [(visible)]="open">…</cw-drawer>`;
}
