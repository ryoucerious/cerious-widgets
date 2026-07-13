import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BlockUiComponent, ButtonComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-block-ui-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockUiComponent, ButtonComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="block-ui"><doc-tab label="Features">
      <doc-section title="Block a panel" [code]="code">
        <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 26rem;">
          <button cwButton (click)="simulate()">{{ blocked() ? 'Working…' : 'Save (blocks for 2s)' }}</button>
          <cw-block-ui [blocked]="blocked()">
            <div style="border: 1px solid var(--cw-border); border-radius: var(--cw-radius); padding: 1.25rem;">
              <p style="margin: 0 0 0.5rem; font-weight: 600;">Account settings</p>
              <p style="margin: 0; color: var(--cw-text-secondary);">This panel is blocked while the save is in progress.</p>
            </div>
          </cw-block-ui>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class BlockUiDocComponent {
  readonly apiProps = [
    { name: "blocked", type: "boolean", default: "false", description: "Block (overlay) the content." },
    { name: "showSpinner", type: "boolean", default: "true", description: "Show a spinner in the centre of the mask." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-font", description: "Font family." }
  ];

  readonly blocked = signal(false);

  simulate(): void {
    this.blocked.set(true);
    setTimeout(() => this.blocked.set(false), 2000);
  }

  code = `<cw-block-ui [blocked]="saving">
  <form>…</form>
</cw-block-ui>`;
}
