import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelComponent, InputTextDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-float-label-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FloatLabelComponent, InputTextDirective, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="float-label"><doc-tab label="Features">
      <doc-section title="Basic" description="Focus the field or type to float the label." [code]="code">
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
          <cw-float-label label="Email">
            <input cwInput [(ngModel)]="email" />
          </cw-float-label>
          <cw-float-label label="Full name">
            <input cwInput [(ngModel)]="name" />
          </cw-float-label>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class FloatLabelDocComponent {
  readonly apiProps = [
    { name: "label", type: "string", default: "''", description: "The label text." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-font", description: "Font family." }
  ];

  email = '';
  name = '';

  code = `<cw-float-label label="Email">
  <input cwInput [(ngModel)]="email" />
</cw-float-label>`;
}
