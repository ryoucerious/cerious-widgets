import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonComponent, ToggleButtonComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-select-button-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectButtonComponent, ToggleButtonComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="select-button"><doc-tab label="Features">
      <doc-section title="SelectButton" [code]="selectCode">
        <cw-select-button [options]="['Low', 'Medium', 'High']" [(ngModel)]="priority" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Priority: {{ priority ?? ', ' }}</span>
      </doc-section>

      <doc-section title="ToggleButton" [code]="toggleCode">
        <cw-toggle-button onLabel="Following" offLabel="Follow" [(ngModel)]="following" />
        <cw-toggle-button onLabel="Muted" offLabel="Mute" [ngModel]="true" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class SelectButtonDocComponent {
  readonly apiProps = [
    { name: "options", type: "readonly unknown[]", default: "[]", description: "The choices, objects, or primitives for a simple list." },
    { name: "optionLabel", type: "string", default: "'label'", description: "Property name to read an option's display label from (for object options)." },
    { name: "optionValue", type: "string", default: "'value'", description: "Property name to read an option's value from (for object options)." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable the control (also settable via forms `setDisabledState`)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-shadow-sm", description: "Subtle elevation shadow." },
    { token: "--cw-font", description: "Font family." }
  ];

  priority: string | null = 'Medium';
  following = false;

  selectCode = `<cw-select-button [options]="['Low', 'Medium', 'High']" [(ngModel)]="priority" />`;
  toggleCode = `<cw-toggle-button onLabel="Following" offLabel="Follow" [(ngModel)]="following" />`;
}
