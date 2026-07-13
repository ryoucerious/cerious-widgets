import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwPanelMenuItem, PanelMenuComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-panel-menu-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PanelMenuComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="PanelMenu" description="A vertical menu whose groups expand inline, accordion-style, with nested levels.">
      <app-demo-section title="Basic" [code]="code">
        <div style="width: 100%; max-width: 18rem;">
          <cw-panel-menu [items]="items" (itemClick)="last.set($event.label)" />
          <p style="color: var(--cw-text-muted); font-size: 0.875rem; margin-top: 0.75rem;">Last: {{ last() }}</p>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class PanelMenuDemoComponent {
  readonly last = signal('—');

  items: CwPanelMenuItem[] = [
    { label: 'Files', expanded: true, items: [
      { label: 'Documents', items: [
        { label: 'Work', command: () => this.last.set('Work') },
        { label: 'Personal', command: () => this.last.set('Personal') }
      ] },
      { label: 'Images', command: () => this.last.set('Images') }
    ] },
    { label: 'Cloud', items: [
      { label: 'Sync', command: () => this.last.set('Sync') },
      { label: 'Backup', command: () => this.last.set('Backup') }
    ] },
    { label: 'Settings', command: () => this.last.set('Settings') }
  ];

  code = `<cw-panel-menu [items]="[
  { label: 'Files', items: [{ label: 'Documents' }, { label: 'Images' }] },
  { label: 'Settings' }
]" />`;
}
