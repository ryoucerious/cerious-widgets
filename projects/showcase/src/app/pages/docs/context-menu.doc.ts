import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ContextMenuDirective, CwMenuItem } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-context-menu-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContextMenuDirective, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="context-menu"><doc-tab label="Features">
      <doc-section title="Right-click the area" [code]="code">
        <div
          [cwContextMenu]="items"
          style="display: flex; align-items: center; justify-content: center; width: 100%; height: 8rem; border: 1px dashed var(--cw-border-strong); border-radius: var(--cw-radius); color: var(--cw-text-muted); user-select: none;"
        >
          Right-click anywhere in this box
        </div>
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Last action: {{ last() }}</span>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class ContextMenuDocComponent {
  readonly apiProps = [
    { name: "cwContextMenu", type: "readonly CwMenuItem[]", default: "[]", description: "The menu entries to show." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [

  ];

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
