import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent, CwTieredMenuItem, PopoverDirective, TieredMenuComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-tiered-menu-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TieredMenuComponent, ButtonComponent, PopoverDirective, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="TieredMenu" description="A vertical menu whose parent items open nested submenus in flanking overlays on hover.">
      <app-demo-section title="Inline" description="Hover a parent item to reveal its submenu." [code]="inlineCode">
        <div style="border: 1px solid var(--cw-border); border-radius: var(--cw-radius); background: var(--cw-surface); min-height: 15rem;">
          <cw-tiered-menu [items]="items" (itemClick)="last.set($event.label ?? '')" />
        </div>
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Last: {{ last() }}</span>
      </app-demo-section>

      <app-demo-section title="As a dropdown" [code]="dropdownCode">
        <button cwButton severity="secondary" variant="outlined" [cwPopover]="menu">Menu ▾</button>
        <ng-template #menu>
          <cw-tiered-menu [items]="items" (itemClick)="last.set($event.label ?? '')" />
        </ng-template>
      </app-demo-section>
    </app-demo-page>
  `
})
export class TieredMenuDemoComponent {
  readonly last = signal('—');

  items: CwTieredMenuItem[] = [
    { label: 'File', items: [
      { label: 'New', items: [
        { label: 'Document', command: () => this.last.set('Document') },
        { label: 'Spreadsheet', command: () => this.last.set('Spreadsheet') }
      ] },
      { label: 'Open', command: () => this.last.set('Open') },
      { label: 'Save', command: () => this.last.set('Save') }
    ] },
    { label: 'Edit', items: [
      { label: 'Undo', command: () => this.last.set('Undo') },
      { label: 'Redo', command: () => this.last.set('Redo') }
    ] },
    { separator: true },
    { label: 'Delete', danger: true, command: () => this.last.set('Delete') }
  ];

  inlineCode = `<cw-tiered-menu [items]="[
  { label: 'File', items: [{ label: 'New', items: [...] }, { label: 'Open' }] },
  { label: 'Delete', danger: true }
]" />`;
  dropdownCode = `<button cwButton [cwPopover]="menu">Menu ▾</button>
<ng-template #menu><cw-tiered-menu [items]="items" /></ng-template>`;
}
