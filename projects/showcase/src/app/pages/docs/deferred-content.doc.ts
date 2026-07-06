import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DeferredContentComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-deferred-content-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DeferredContentComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="deferred-content"><doc-tab label="Features">
      <doc-section title="Lazy-render on scroll-in" [code]="code">
        <p style="color: var(--cw-text-muted);">
          The block below only renders when scrolled into view.
          Loaded: <strong>{{ loaded() ? 'yes' : 'not yet' }}</strong>
        </p>
        <div class="scroller">
          <div class="spacer">↓ scroll down ↓</div>
          <cw-deferred-content (loaded)="loaded.set(true)">
            <div class="heavy">
              <h3 style="margin: 0 0 0.5rem;">Rendered on demand 🎉</h3>
              <p style="margin: 0;">Imagine an expensive chart or map here — it stayed out of the DOM until now.</p>
            </div>
          </cw-deferred-content>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `,
  styles: [`
    .scroller {
      height: 300px;
      overflow-y: auto;
      border: 1px solid var(--cw-border);
      border-radius: var(--cw-radius);
      padding: 1rem;
      background: var(--cw-surface-sunken);
    }
    .spacer {
      height: 280px;
      display: grid;
      place-items: center;
      color: var(--cw-text-muted);
      font-size: 0.85rem;
    }
    .heavy {
      padding: 1.5rem;
      border-radius: var(--cw-radius);
      background: var(--cw-surface);
      border: 1px solid var(--cw-border);
    }
  `]
})
export class DeferredContentDocComponent {
  readonly apiProps = [
    { name: "threshold", type: "number", default: "0", description: "Fraction of the host visible before it renders (0–1)." }
  ];
  readonly apiEvents = [
    { name: "loaded", type: "void", description: "Emitted once, when the content is first rendered." }
  ];
  readonly themeTokens = [

  ];

  readonly loaded = signal(false);

  code = `<cw-deferred-content (loaded)="initChart()">
  <canvas #chart></canvas>
</cw-deferred-content>`;
}
