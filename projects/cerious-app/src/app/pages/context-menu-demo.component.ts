import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ContextMenuDirective, CwMenuItem } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-context-menu-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContextMenuDirective, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="ContextMenu" description="Opens a menu at the pointer on right-click.">
      <app-demo-section title="Right-click the area" [code]="code">
        <div
          [cwContextMenu]="items"
          style="display: flex; align-items: center; justify-content: center; width: 100%; height: 8rem; border: 1px dashed var(--cw-border-strong); border-radius: var(--cw-radius); color: var(--cw-text-muted); user-select: none;"
        >
          Right-click anywhere in this box
        </div>
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Last action: {{ last() }}</span>
      </app-demo-section>
    </app-demo-page>
  `
})
export class ContextMenuDemoComponent {
  readonly last = signal('—');

  items: CwMenuItem[] = [
    { label: 'Rename', command: () => this.last.set('Rename') },
    { label: 'Duplicate', command: () => this.last.set('Duplicate') },
    { separator: true },
    { label: 'Delete', danger: true, command: () => this.last.set('Delete') }
  ];

  code = `<div [cwContextMenu]="[
  { label: 'Rename', command: () => rename() },
  { separator: true },
  { label: 'Delete', danger: true }
]">Right-click me</div>`;
}
