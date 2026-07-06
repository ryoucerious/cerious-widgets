import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwMenubarItem, MenubarComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-menubar-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenubarComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="menubar"><doc-tab label="Features">
      <doc-section title="Basic" [code]="code">
        <div style="width: 100%;">
          <cw-menubar [items]="items" (itemClick)="last.set($event.label)" />
          <p style="color: var(--cw-text-muted); font-size: 0.875rem; margin-top: 0.75rem;">Last: {{ last() }}</p>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class MenubarDocComponent {
  readonly apiProps = [
    { name: "items", type: "readonly CwMenubarItem[]", default: "[]", description: "The top-level menu entries." }
  ];
  readonly apiEvents = [
    { name: "itemClick", type: "CwMenubarItem", description: "Emitted when any leaf item is activated." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." }
  ];

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
