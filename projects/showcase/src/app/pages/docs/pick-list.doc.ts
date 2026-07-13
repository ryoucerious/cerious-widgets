import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PickListComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-pick-list-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PickListComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="pick-list"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <cw-pick-list [options]="roles" sourceHeader="Available roles" targetHeader="Assigned" [(ngModel)]="assigned" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Assigned: {{ assigned.join(', ') || '—' }}</span>
      </doc-section>

      <doc-section title="500 items — virtualized" [code]="virtualCode">
        <cw-pick-list [options]="many" [(ngModel)]="manyTarget" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class PickListDocComponent {
  readonly apiProps = [
    { name: "options", type: "readonly unknown[]", default: "[]", description: "The full pool of items — objects, or primitives for a simple list." },
    { name: "optionLabel", type: "string", default: "'label'", description: "Property name to read an item's display label from (for object items)." },
    { name: "optionValue", type: "string", default: "'value'", description: "Property name to read an item's value from (for object items)." },
    { name: "sourceHeader", type: "string", default: "'Available'", description: "Heading over the source (available) list." },
    { name: "targetHeader", type: "string", default: "'Selected'", description: "Heading over the target (selected) list." },
    { name: "listHeight", type: "string", default: "'260px'", description: "List height (any CSS length) — the virtualized viewport size." },
    { name: "virtualThreshold", type: "number", default: "100", description: "Virtualize each list (cerious-scroll) at or above this item count." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable the control (also settable via forms `setDisabledState`)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-surface-raised", description: "Raised/overlay background." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-divider", description: "Divider line colour." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-text", description: "Primary text colour." }
  ];

  roles = ['Admin', 'Editor', 'Viewer', 'Auditor', 'Billing', 'Support'];
  assigned: string[] = ['Editor'];

  many = Array.from({ length: 500 }, (_, i) => `Item ${i + 1}`);
  manyTarget: string[] = [];

  basicCode = `<cw-pick-list [options]="roles" [(ngModel)]="assigned" />`;
  virtualCode = `// 500 items — each list is virtualized with ngx-cerious-scroll
<cw-pick-list [options]="many" [(ngModel)]="target" />`;
}
