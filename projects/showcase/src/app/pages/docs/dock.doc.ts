import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwDockItem, DockComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-dock-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DockComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="dock"><doc-tab label="Features">
      <doc-section title="Bottom dock" description="Hover the icons to see the magnification." [code]="code">
        <div style="display: flex; justify-content: center; width: 100%; padding: 1.5rem 0;">
          <cw-dock [items]="items" (itemClick)="last.set($event.label)" />
        </div>
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Last: {{ last() }}</span>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class DockDocComponent {
  readonly apiProps = [
    { name: "items", type: "readonly CwDockItem[]", default: "[]", description: "The dock items." },
    { name: "position", type: "CwDockPosition", default: "'bottom'", description: "Which edge the dock sits on (affects layout + magnify direction)." },
    { name: "magnification", type: "number", default: "1.5", description: "Peak scale of the hovered item." }
  ];
  readonly apiEvents = [
    { name: "itemClick", type: "CwDockItem", description: "Emitted when an item is activated." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-surface-raised", description: "Raised/overlay background." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-radius-lg", description: "Large corner radius." }
  ];

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
