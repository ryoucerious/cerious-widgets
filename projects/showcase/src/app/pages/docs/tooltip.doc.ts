import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, TooltipDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-tooltip-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipDirective, ButtonComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="tooltip"><doc-tab label="Features">
      <doc-section title="Basic" description="Hover or focus the button." [code]="basicCode">
        <button cwButton severity="secondary" variant="outlined" cwTooltip="This is a helpful tooltip">Hover me</button>
      </doc-section>

      <doc-section title="Positions" [code]="positionCode">
        <button cwButton severity="secondary" variant="outlined" cwTooltip="On top" cwTooltipPosition="top">Top</button>
        <button cwButton severity="secondary" variant="outlined" cwTooltip="On the right" cwTooltipPosition="right">Right</button>
        <button cwButton severity="secondary" variant="outlined" cwTooltip="Below" cwTooltipPosition="bottom">Bottom</button>
        <button cwButton severity="secondary" variant="outlined" cwTooltip="On the left" cwTooltipPosition="left">Left</button>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class TooltipDocComponent {
  readonly apiProps = [
    { name: "cwTooltip", type: "string", default: "''", description: "The tooltip text; nothing is shown while empty." },
    { name: "cwTooltipPosition", type: "CwTooltipPosition", default: "'right'", description: "Placement relative to the host." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-shadow-md", description: "Medium elevation shadow." },
    { token: "--cw-font", description: "Font family." }
  ];

  basicCode = `<button cwButton cwTooltip="This is a helpful tooltip">Hover me</button>`;
  positionCode = `<button cwButton cwTooltip="On top" cwTooltipPosition="top">Top</button>`;
}
