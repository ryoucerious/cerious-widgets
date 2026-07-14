import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollPanelComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-scroll-panel-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollPanelComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="scroll-panel"><doc-tab label="Features">
      <doc-section title="Bounded height" [code]="code">
        <cw-scroll-panel height="14rem" style="width: 100%; max-width: 26rem; border: 1px solid var(--cw-border); border-radius: var(--cw-radius);">
          <div style="padding: 1rem;">
            @for (line of lines; track line) {
              <p style="margin: 0 0 0.75rem;">Line {{ line }}, this content scrolls within the panel.</p>
            }
          </div>
        </cw-scroll-panel>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class ScrollPanelDocComponent {
  readonly apiProps = [
    { name: "height", type: "string", default: "''", description: "Fixed viewport height (any CSS length)." },
    { name: "maxHeight", type: "string", default: "''", description: "Maximum viewport height (any CSS length)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-font", description: "Font family." }
  ];

  lines = Array.from({ length: 30 }, (_, i) => i + 1);

  code = `<cw-scroll-panel height="14rem">…long content…</cw-scroll-panel>`;
}
