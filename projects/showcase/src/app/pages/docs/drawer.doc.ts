import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent, DrawerComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-drawer-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DrawerComponent, ButtonComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="drawer"><doc-tab label="Features">
      <doc-section title="From either edge" [code]="code">
        <button cwButton (click)="left.set(true)">Open left</button>
        <button cwButton severity="secondary" variant="outlined" (click)="right.set(true)">Open right</button>

        <cw-drawer header="Navigation" position="left" [visible]="left()" (visibleChange)="left.set($event)">
          A drawer sliding from the left — good for navigation.
        </cw-drawer>

        <cw-drawer header="Filters" position="right" [visible]="right()" (visibleChange)="right.set($event)">
          A drawer sliding from the right — good for filters and detail panes.
        </cw-drawer>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class DrawerDocComponent {
  readonly apiProps = [
    { name: "header", type: "string", default: "''", description: "The drawer title." },
    { name: "visible", type: "boolean", default: "false", description: "Show / hide the drawer (two-way: `[(visible)]`)." },
    { name: "position", type: "CwDrawerPosition", default: "'left'", description: "Which edge to slide in from." },
    { name: "width", type: "string", default: "'20rem'", description: "Panel width (any CSS length)." }
  ];
  readonly apiEvents = [
    { name: "visibleChange", type: "boolean", description: "Emitted when the drawer closes itself (✕, backdrop, Escape)." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-divider", description: "Divider line colour." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-secondary", description: "Secondary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius-sm", description: "Small corner radius." }
  ];

  readonly left = signal(false);
  readonly right = signal(false);

  code = `<button cwButton (click)="open = true">Open</button>
<cw-drawer header="Filters" position="right" [(visible)]="open">…</cw-drawer>`;
}
