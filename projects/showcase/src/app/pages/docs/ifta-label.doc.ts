import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IftaLabelComponent, InputTextDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-ifta-label-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IftaLabelComponent, InputTextDirective, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="ifta-label"><doc-tab label="Features">
      <doc-section title="Basic" [code]="code">
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
          <cw-ifta-label label="Email">
            <input cwInput [(ngModel)]="email" />
          </cw-ifta-label>
          <cw-ifta-label label="Company">
            <input cwInput [(ngModel)]="company" />
          </cw-ifta-label>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class IftaLabelDocComponent {
  readonly apiProps = [
    { name: "label", type: "string", default: "''", description: "The label text." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-font", description: "Font family." }
  ];

  email = '';
  company = '';

  code = `<cw-ifta-label label="Email">
  <input cwInput [(ngModel)]="email" />
</cw-ifta-label>`;
}
