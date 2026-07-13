import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwPanelMenuItem, PanelMenuComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-panel-menu-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PanelMenuComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="panel-menu"><doc-tab label="Features">
      <doc-section title="Basic" [code]="code">
        <div style="width: 100%; max-width: 18rem;">
          <cw-panel-menu [items]="items" (itemClick)="last.set($event.label)" />
          <p style="color: var(--cw-text-muted); font-size: 0.875rem; margin-top: 0.75rem;">Last: {{ last() }}</p>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class PanelMenuDocComponent {
  readonly apiProps = [
    { name: "items", type: "readonly CwPanelMenuItem[]", default: "[]", description: "The top-level menu entries." }
  ];
  readonly apiEvents = [
    { name: "itemClick", type: "CwPanelMenuItem", description: "Emitted when any leaf item is activated." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." }
  ];

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
