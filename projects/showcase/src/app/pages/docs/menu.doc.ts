import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, CwMenuItem, MenuComponent, PopoverDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-menu-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuComponent, ButtonComponent, PopoverDirective, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="menu"><doc-tab label="Features">
      <doc-section title="Inline" [code]="inlineCode">
        <div style="border: 1px solid var(--cw-border); border-radius: var(--cw-radius); background: var(--cw-surface);">
          <cw-menu [items]="nav" [activeIndex]="0" />
        </div>
      </doc-section>

      <doc-section title="Dropdown" description="Compose with the popover for an actions menu." [code]="dropdownCode">
        <button cwButton severity="secondary" variant="outlined" [cwPopover]="actionsMenu">Actions ▾</button>
        <ng-template #actionsMenu>
          <cw-menu [items]="actions" />
        </ng-template>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class MenuDocComponent {
  readonly apiProps = [
    { name: "items", type: "readonly CwMenuItem[]", default: "[]", description: "The menu entries, in order." },
    { name: "activeIndex", type: "number", default: "-1", description: "Index of the item to highlight as active (e.g. current route)." }
  ];
  readonly apiEvents = [
    { name: "itemClick", type: "CwMenuItem", description: "Emitted when an item is activated (after its `command` runs)." }
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

  nav: CwMenuItem[] = [
    { label: 'Dashboard' },
    { label: 'Users' },
    { label: 'Settings' },
    { label: 'Reports' }
  ];

  actions: CwMenuItem[] = [
    { label: 'Edit' },
    { label: 'Duplicate' },
    { separator: true },
    { label: 'Delete', danger: true }
  ];

  inlineCode = `<cw-menu [items]="[{ label: 'Dashboard' }, { label: 'Users' }]" [activeIndex]="0" />`;
  dropdownCode = `<button cwButton [cwPopover]="menu">Actions ▾</button>
<ng-template #menu><cw-menu [items]="actions" /></ng-template>`;
}
