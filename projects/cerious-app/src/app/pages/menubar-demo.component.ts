import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwMenubarItem, MenubarComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-menubar-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenubarComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Menubar" description="A horizontal application menu bar; top-level items open dropdown sub-menus.">
      <app-demo-section title="Basic" [code]="code">
        <div style="width: 100%;">
          <cw-menubar [items]="items" (itemClick)="last.set($event.label)" />
          <p style="color: var(--cw-text-muted); font-size: 0.875rem; margin-top: 0.75rem;">Last: {{ last() }}</p>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class MenubarDemoComponent {
  readonly last = signal('—');

  items: CwMenubarItem[] = [
    { label: 'File', items: [
      { label: 'New', command: () => this.last.set('New') },
      { label: 'Open', command: () => this.last.set('Open') },
      { label: 'Save', command: () => this.last.set('Save') }
    ] },
    { label: 'Edit', items: [
      { label: 'Undo', command: () => this.last.set('Undo') },
      { label: 'Redo', command: () => this.last.set('Redo') }
    ] },
    { label: 'View', items: [
      { label: 'Zoom In', command: () => this.last.set('Zoom In') },
      { label: 'Zoom Out', command: () => this.last.set('Zoom Out') }
    ] },
    { label: 'Help', command: () => this.last.set('Help') }
  ];

  code = `<cw-menubar [items]="[
  { label: 'File', items: [{ label: 'New' }, { label: 'Open' }] },
  { label: 'Help', command: () => help() }
]" />`;
}
