import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpinnerComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-spinner-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpinnerComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="spinner"><doc-tab label="Features">
      <doc-section title="Sizes" [code]="sizeCode">
        <cw-spinner size="1.25rem" />
        <cw-spinner size="2rem" />
        <cw-spinner size="3rem" />
      </doc-section>

      <doc-section title="Stroke width" [code]="strokeCode">
        <cw-spinner size="2.5rem" [strokeWidth]="2" />
        <cw-spinner size="2.5rem" [strokeWidth]="4" />
        <cw-spinner size="2.5rem" [strokeWidth]="7" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class SpinnerDocComponent {
  readonly apiProps = [
    { name: "size", type: "string", default: "'2rem'", description: "Diameter as any CSS length (e.g. '2rem', '32px')." },
    { name: "strokeWidth", type: "number", default: "4", description: "Ring thickness in pixels." },
    { name: "label", type: "string", default: "'Loading'", description: "Accessible label announced by screen readers." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-accent", description: "Secondary brand accent." }
  ];

  sizeCode = `<cw-spinner size="1.25rem" />
<cw-spinner size="2rem" />
<cw-spinner size="3rem" />`;

  strokeCode = `<cw-spinner size="2.5rem" [strokeWidth]="2" />
<cw-spinner size="2.5rem" [strokeWidth]="7" />`;
}
