import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DividerComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-divider-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DividerComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="divider"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <div style="width: 100%;">
          <p>Content above</p>
          <cw-divider />
          <p>Content below</p>
        </div>
      </doc-section>

      <doc-section title="With label" description="Project content to render a label on the line; align it left, center or right." [code]="labelCode">
        <div style="width: 100%;">
          <cw-divider align="left">Left</cw-divider>
          <cw-divider>Center</cw-divider>
          <cw-divider align="right">Right</cw-divider>
        </div>
      </doc-section>

      <doc-section title="Dashed" [code]="dashedCode">
        <div style="width: 100%;">
          <cw-divider type="dashed" />
        </div>
      </doc-section>

      <doc-section title="Vertical" [code]="verticalCode">
        <div style="display: flex; align-items: center; min-height: 4rem;">
          <span>Left</span>
          <cw-divider layout="vertical" />
          <span>Middle</span>
          <cw-divider layout="vertical" />
          <span>Right</span>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class DividerDocComponent {
  readonly apiProps = [
    { name: "layout", type: "CwDividerLayout", default: "'horizontal'", description: "Orientation: horizontal (default) or vertical." },
    { name: "type", type: "CwDividerType", default: "'solid'", description: "Line style: solid (default) or dashed." },
    { name: "align", type: "CwDividerAlign", default: "'center'", description: "Label position on a horizontal divider." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-divider", description: "Divider line colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-font", description: "Font family." }
  ];

  basicCode = `<cw-divider />`;
  labelCode = `<cw-divider align="left">Left</cw-divider>
<cw-divider>Center</cw-divider>
<cw-divider align="right">Right</cw-divider>`;
  dashedCode = `<cw-divider type="dashed" />`;
  verticalCode = `<span>Left</span>
<cw-divider layout="vertical" />
<span>Right</span>`;
}
