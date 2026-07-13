import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwDockItem, DockComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-dock-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DockComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Dock" description="A macOS-style icon dock with hover magnification — the hovered item grows, its neighbours less.">
      <app-demo-section title="Bottom dock" description="Hover the icons to see the magnification." [code]="code">
        <div style="display: flex; justify-content: center; width: 100%; padding: 1.5rem 0;">
          <cw-dock [items]="items" (itemClick)="last.set($event.label)" />
        </div>
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Last: {{ last() }}</span>
      </app-demo-section>
    </app-demo-page>
  `
})
export class DockDemoComponent {
  readonly last = signal('—');

  items: CwDockItem[] = [
    { label: 'Files', command: () => this.last.set('Files') },
    { label: 'Mail', command: () => this.last.set('Mail') },
    { label: 'Calendar', command: () => this.last.set('Calendar') },
    { label: 'Photos', command: () => this.last.set('Photos') },
    { label: 'Music', command: () => this.last.set('Music') },
    { label: 'Trash', disabled: true }
  ];

  code = `<cw-dock [items]="[{ label: 'Files' }, { label: 'Mail' }]" />`;
}
