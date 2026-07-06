import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, StyleClassDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-style-class-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, StyleClassDirective, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="style-class"><doc-tab label="Features">
      <doc-section title="Toggle a panel" [code]="code">
        <button cwButton [cwStyleClass]="'@next'" toggleClass="is-open">Toggle panel</button>
        <div class="collapsible">
          <p style="margin: 0;">I'm toggled purely by the <code>cwStyleClass</code> directive — no <code>*ngIf</code>, no signal.</p>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `,
  styles: [`
    .collapsible {
      max-height: 0;
      overflow: hidden;
      margin-top: 0.75rem;
      padding: 0 1rem;
      border-radius: var(--cw-radius);
      background: var(--cw-surface-sunken);
      transition: max-height 0.3s ease, padding 0.3s ease;
    }
    .collapsible.is-open {
      max-height: 140px;
      padding: 1rem;
    }
  `]
})
export class StyleClassDocComponent {
  readonly apiProps = [
    { name: "cwStyleClass", type: "string", default: "—", description: "Target selector or relative keyword (see class docs)." },
    { name: "toggleClass", type: "string", default: "''", description: "Class to toggle on the resolved target." },
    { name: "enterClass", type: "string", default: "''", description: "Class to add on click (paired with `leaveClass` for one-way transitions)." },
    { name: "leaveClass", type: "string", default: "''", description: "Class to add on a second click / when leaving." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [

  ];

  code = `<button [cwStyleClass]="'@next'" toggleClass="is-open">Toggle</button>
<div class="collapsible">…</div>

/* target keywords: @next, @prev, @parent, @grandparent, or any CSS selector */`;
}
