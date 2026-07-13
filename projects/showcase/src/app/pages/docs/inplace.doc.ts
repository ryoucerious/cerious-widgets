import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InplaceComponent, InputTextDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-inplace-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InplaceComponent, InputTextDirective, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="inplace"><doc-tab label="Features">
      <doc-section title="Edit a value" [code]="code">
        <cw-inplace>
          <span cwInplaceDisplay>{{ name() || 'Click to edit name' }}</span>
          <input cwInplaceEditor cwInput [ngModel]="name()" (ngModelChange)="name.set($event)" placeholder="Your name" />
        </cw-inplace>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class InplaceDocComponent {
  readonly apiProps = [
    { name: "disabled", type: "boolean", default: "false", description: "Prevent activation." },
    { name: "closable", type: "boolean", default: "true", description: "Show a close (✕) button in editor mode." }
  ];
  readonly apiEvents = [
    { name: "opened", type: "void", description: "Emitted when the editor opens." },
    { name: "closed", type: "void", description: "Emitted when the editor closes." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." }
  ];

  readonly name = signal('Olivia Rhye');

  code = `<cw-inplace>
  <span cwInplaceDisplay>{{ name }}</span>
  <input cwInplaceEditor cwInput [(ngModel)]="name" />
</cw-inplace>`;
}
