import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent, CwTieredMenuItem, PopoverDirective, TieredMenuComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-tiered-menu-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TieredMenuComponent, ButtonComponent, PopoverDirective, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="tiered-menu"><doc-tab label="Features">
      <doc-section title="Inline" description="Hover a parent item to reveal its submenu." [code]="inlineCode">
        <div style="border: 1px solid var(--cw-border); border-radius: var(--cw-radius); background: var(--cw-surface); min-height: 15rem;">
          <cw-tiered-menu [items]="items" (itemClick)="last.set($event.label ?? '')" />
        </div>
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Last: {{ last() }}</span>
      </doc-section>

      <doc-section title="As a dropdown" [code]="dropdownCode">
        <button cwButton severity="secondary" variant="outlined" [cwPopover]="menu">Menu ▾</button>
        <ng-template #menu>
          <cw-tiered-menu [items]="items" (itemClick)="last.set($event.label ?? '')" />
        </ng-template>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class TieredMenuDocComponent {
  readonly apiProps = [
    { name: "items", type: "readonly CwTieredMenuItem[]", default: "[]", description: "The menu entries." }
  ];
  readonly apiEvents = [
    { name: "itemClick", type: "CwTieredMenuItem", description: "Emitted when a leaf item is activated (bubbles up from submenus)." },
    { name: "closeRequest", type: "void", description: "Emitted to ask an ancestor to close (after a leaf activation)." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-divider", description: "Divider line colour." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." }
  ];

  readonly last = signal(', ');

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
