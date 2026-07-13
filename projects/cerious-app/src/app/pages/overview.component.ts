import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV_ITEMS } from '../showcase/nav';

@Component({
  selector: 'app-overview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="overview">
      <h1 class="overview__title">cerious-widgets</h1>
      <p class="overview__lede">
        A modern, plugin-driven Angular component library. Every component is
        standalone, signal-based, and styled with a runtime design-token theme —
        toggle dark mode from the top bar and watch it all re-skin instantly.
      </p>

      <div class="overview__grid">
        @for (c of items; track c.path) {
          <a class="overview__card" [routerLink]="c.path">
            <span class="overview__name">{{ c.name }}</span>
            <span class="overview__group">{{ c.group }}</span>
            <span class="overview__desc">{{ c.desc }}</span>
          </a>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; padding: 1.75rem 2rem; }
    .overview { max-width: 920px; }
    .overview__title { margin: 0 0 0.5rem; font-size: 2.1rem; font-weight: 700; color: var(--cw-text); }
    .overview__lede { margin: 0 0 2rem; max-width: 62ch; color: var(--cw-text-muted); font-size: 1.05rem; line-height: 1.6; }
    .overview__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
    .overview__card {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 1.1rem 1.2rem;
      border: 1px solid var(--cw-border);
      border-radius: var(--cw-radius);
      background: var(--cw-surface);
      text-decoration: none;
      transition: border-color 0.12s ease, box-shadow 0.12s ease, transform 0.12s ease;
    }
    .overview__card:hover {
      border-color: var(--cw-accent);
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
      transform: translateY(-1px);
    }
    .overview__name { font-size: 1.05rem; font-weight: 600; color: var(--cw-text); }
    .overview__group { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--cw-accent); font-weight: 600; }
    .overview__desc { color: var(--cw-text-muted); font-size: 0.875rem; line-height: 1.45; }
  `]
})
export class OverviewComponent {
  readonly items = NAV_ITEMS.filter(i => i.path !== 'grid');
}
