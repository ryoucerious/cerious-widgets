import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnimateOnScrollDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-animate-on-scroll-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimateOnScrollDirective, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="AnimateOnScroll" description="Reveal elements with an animation as they scroll into view, powered by IntersectionObserver.">
      <app-demo-section title="Scroll down to reveal" [code]="code">
        <p style="color: var(--cw-text-muted);">Scroll within the panel — each card animates in on entry.</p>
        <div class="scroller">
          <div class="spacer">↓ keep scrolling ↓</div>
          @for (card of cards; track card) {
            <div class="reveal-card" cwAnimateOnScroll enterClass="cw-fade-in-up" [threshold]="0.4">
              {{ card }}
            </div>
          }
        </div>
      </app-demo-section>
    </app-demo-page>
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
export class AnimateOnScrollDemoComponent {
  cards = ['Fades up on entry', 'So does this one', 'And this', 'Last one'];

  code = `<div cwAnimateOnScroll enterClass="cw-fade-in-up" [threshold]="0.4">
  Reveals when scrolled into view
</div>`;
}
