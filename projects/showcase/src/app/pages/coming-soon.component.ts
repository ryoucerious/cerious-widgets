import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { findComponent } from '../core/component-registry';

/** Placeholder page for a component whose full doc page hasn't been built yet. */
@Component({
  selector: 'app-coming-soon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="soon">
      <span class="soon__icon" aria-hidden="true">{{ doc()?.icon || '🚧' }}</span>
      <h1 class="soon__title">{{ doc()?.name || 'Component' }}</h1>
      <p class="soon__summary">{{ doc()?.summary }}</p>
      <p class="soon__note">
        A full documentation page for this component is on the way — with live examples, its API
        reference and theming notes. In the meantime, explore the
        <a routerLink="/components">component gallery</a>.
      </p>
    </div>
  `,
  styles: [`
    .soon { max-width: 40rem; padding: 3rem 0; text-align: center; margin: 0 auto; }
    .soon__icon { font-size: 3rem; }
    .soon__title { margin: 1rem 0 0.5rem; font-size: 1.9rem; font-weight: 750; color: var(--cw-text); }
    .soon__summary { margin: 0 0 1.5rem; font-size: 1.05rem; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .soon__note { color: var(--cw-text-muted, var(--cw-text-secondary)); line-height: 1.65; }
    .soon__note a { color: var(--cw-primary); }
  `]
})
export class ComingSoonComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { requireSync: true });
  readonly doc = computed(() => findComponent(this.params().get('slug') ?? ''));
}
