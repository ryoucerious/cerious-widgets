import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderListComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-order-list-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrderListComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="order-list"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <cw-order-list [options]="tasks" header="Tasks" [(ngModel)]="ordered" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Order: {{ ordered.join(', ') }}</span>
      </doc-section>

      <doc-section title="300 items — virtualized" [code]="virtualCode">
        <cw-order-list [options]="many" header="Items" [(ngModel)]="manyOrder" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class OrderListDocComponent {
  readonly apiProps = [
    { name: "options", type: "readonly unknown[]", default: "[]", description: "The items — objects, or primitives for a simple list." },
    { name: "optionLabel", type: "string", default: "'label'", description: "Property name to read an item's display label from (for object items)." },
    { name: "optionValue", type: "string", default: "'value'", description: "Property name to read an item's value from (for object items)." },
    { name: "header", type: "string", default: "''", description: "Optional heading above the list." },
    { name: "listHeight", type: "string", default: "'280px'", description: "List height (any CSS length) — the virtualized viewport size." },
    { name: "virtualThreshold", type: "number", default: "100", description: "Virtualize the list (cerious-scroll) at or above this item count." },
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

  tasks = ['Design', 'Develop', 'Review', 'Test', 'Deploy'];
  ordered = [...this.tasks];

  many = Array.from({ length: 300 }, (_, i) => `Item ${i + 1}`);
  manyOrder = [...this.many];

  basicCode = `<cw-order-list [options]="tasks" header="Tasks" [(ngModel)]="ordered" />`;
  virtualCode = `// 300 items — virtualized with ngx-cerious-scroll
<cw-order-list [options]="many" [(ngModel)]="order" />`;
}
