import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnimateOnScrollDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-animate-on-scroll-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimateOnScrollDirective, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="animate-on-scroll"><doc-tab label="Features">
      <doc-section title="Scroll down to reveal" [code]="code">
        <p style="color: var(--cw-text-muted);">Scroll within the panel, each card animates in on entry.</p>
        <div class="scroller" tabindex="0" role="region" aria-label="Scrollable demo">
          <div class="spacer">↓ keep scrolling ↓</div>
          @for (card of cards; track card) {
            <div class="reveal-card" cwAnimateOnScroll enterClass="cw-fade-in-up" [threshold]="0.4">
              {{ card }}
            </div>
          }
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `,
  styles: [`
    .scroller {
      height: 320px;
      overflow-y: auto;
      border: 1px solid var(--cw-border);
      border-radius: var(--cw-radius);
      padding: 1rem;
      background: var(--cw-surface-sunken);
    }
    .spacer {
      height: 260px;
      display: grid;
      place-items: center;
      color: var(--cw-text-muted);
      font-size: 0.85rem;
    }
    .reveal-card {
      margin: 1rem 0;
      padding: 2rem;
      border-radius: var(--cw-radius);
      background: var(--cw-primary);
      color: var(--cw-primary-contrast);
      font-weight: 600;
      text-align: center;
    }
  `]
})
export class AnimateOnScrollDocComponent {
  readonly apiProps = [
    { name: "enterClass", type: "string", default: "'cw-animate-enter'", description: "Class added while the host is intersecting the viewport." },
    { name: "leaveClass", type: "string", default: "''", description: "Class added while the host is *not* intersecting (when not `once`)." },
    { name: "threshold", type: "number", default: "0.15", description: "Fraction of the host that must be visible to trigger (0-1)." },
    { name: "once", type: "boolean", default: "true", description: "Fire only the first time it enters, then stop observing." }
  ];
  readonly apiEvents = [
    { name: "entered", type: "void", description: "Emitted each time the host enters the viewport." }
  ];
  readonly themeTokens = [

  ];

  cards = ['Fades up on entry', 'So does this one', 'And this', 'Last one'];

  code = `<div cwAnimateOnScroll enterClass="cw-fade-in-up" [threshold]="0.4">
  Reveals when scrolled into view
</div>`;
}
