import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, CardComponent, PanelComponent, ToolbarComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-card-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, PanelComponent, ToolbarComponent, ButtonComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="card"><doc-tab label="Features">
      <doc-section title="Card" [code]="cardCode">
        <cw-card title="Monthly Report" subtitle="June 2026" style="max-width: 22rem;">
          Revenue is up 14% month over month, driven by the new enterprise tier.
          <div cwCardFooter>
            <button cwButton>View details</button>
          </div>
        </cw-card>
      </doc-section>

      <doc-section title="Panel" description="Toggleable via the header chevron." [code]="panelCode">
        <cw-panel header="Advanced settings" toggleable style="width: 100%; max-width: 28rem;">
          Fine-tune caching, timeouts and retry behaviour here.
        </cw-panel>
      </doc-section>

      <doc-section title="Toolbar" [code]="toolbarCode">
        <cw-toolbar style="width: 100%;">
          <div cwToolbarStart>
            <button cwButton>New</button>
            <button cwButton severity="secondary" variant="outlined">Import</button>
          </div>
          <div cwToolbarEnd>
            <button cwButton severity="secondary" variant="outlined">Export</button>
          </div>
        </cw-toolbar>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class CardDocComponent {
  readonly apiProps = [
    { name: "title", type: "string", default: "''", description: "The card heading." },
    { name: "subtitle", type: "string", default: "''", description: "Muted line under the title." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-secondary", description: "Secondary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius-lg", description: "Large corner radius." },
    { token: "--cw-shadow-sm", description: "Subtle elevation shadow." },
    { token: "--cw-font", description: "Font family." }
  ];

  cardCode = `<cw-card title="Monthly Report" subtitle="June 2026">
  Revenue is up 14% month over month.
  <div cwCardFooter><button cwButton>View details</button></div>
</cw-card>`;
  panelCode = `<cw-panel header="Advanced settings" toggleable>…</cw-panel>`;
  toolbarCode = `<cw-toolbar>
  <div cwToolbarStart><button cwButton>New</button></div>
  <div cwToolbarEnd><button cwButton>Export</button></div>
</cw-toolbar>`;
}
