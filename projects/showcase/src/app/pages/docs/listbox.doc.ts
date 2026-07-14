import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListboxComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-listbox-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListboxComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="listbox"><doc-tab label="Features">
      <doc-section title="Single" [code]="singleCode">
        <cw-listbox [options]="cities" [(ngModel)]="city" aria-label="City" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">City: {{ city ?? ', ' }}</span>
      </doc-section>

      <doc-section title="Multiple with checkboxes" [code]="multipleCode">
        <cw-listbox [options]="cities" multiple [(ngModel)]="picked" aria-label="Cities" />
      </doc-section>

      <doc-section title="5,000 options, virtualized + filter" description="Only the visible rows exist in the DOM." [code]="virtualCode">
        <cw-listbox [options]="many" filterable [(ngModel)]="item" aria-label="Item" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class ListboxDocComponent {
  readonly apiProps = [
    { name: "options", type: "readonly unknown[]", default: "[]", description: "The available options, objects, or primitives for a simple list." },
    { name: "optionLabel", type: "string", default: "'label'", description: "Property name to read an option's display label from (for object options)." },
    { name: "optionValue", type: "string", default: "'value'", description: "Property name to read an option's value from (for object options)." },
    { name: "multiple", type: "boolean", default: "false", description: "Allow selecting several values (the model becomes an array)." },
    { name: "filterable", type: "boolean", default: "false", description: "Show a filter box above the list." },
    { name: "listHeight", type: "string", default: "'240px'", description: "List height (any CSS length), the virtualized viewport size." },
    { name: "virtualThreshold", type: "number", default: "100", description: "Virtualize the list (cerious-scroll) at or above this option count." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable the control (also settable via forms `setDisabledState`)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius", description: "Corner radius." }
  ];

  cities = ['New York', 'London', 'Tokyo', 'Sydney', 'Berlin'];
  city: string | null = null;
  picked: string[] = ['London'];

  many = Array.from({ length: 5000 }, (_, i) => `Item ${i + 1}`);
  item: string | null = null;

  singleCode = `<cw-listbox [options]="cities" [(ngModel)]="city" />`;
  multipleCode = `<cw-listbox [options]="cities" multiple [(ngModel)]="picked" />`;
  virtualCode = `// 5,000 options, virtualized with ngx-cerious-scroll
<cw-listbox [options]="many" filterable [(ngModel)]="item" />`;
}
