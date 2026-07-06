import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../core/theme.service';

/** Segmented Light / Frost / Dark theme switcher, bound to {@link ThemeService}. */
@Component({
  selector: 'doc-theme-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="switcher" role="group" aria-label="Theme">
      @for (t of theme.themes; track t.id) {
        <button
          type="button"
          class="switcher__btn"
          [class.switcher__btn--active]="theme.theme() === t.id"
          [attr.aria-pressed]="theme.theme() === t.id"
          (click)="theme.set(t.id)"
          [title]="t.label"
        >
          <span class="switcher__icon" aria-hidden="true">{{ t.icon }}</span>
          <span class="switcher__label">{{ t.label }}</span>
        </button>
      }
    </div>
  `,
  styles: [`
    .switcher {
      display: inline-flex; padding: 3px; gap: 2px;
      background: var(--cw-surface-sunken, var(--cw-surface-2));
      border: 1px solid var(--cw-border); border-radius: 999px;
    }
    .switcher__btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      appearance: none; border: none; cursor: pointer;
      padding: 0.35rem 0.75rem; border-radius: 999px;
      font-size: 0.85rem; font-weight: 550; font-family: var(--cw-font);
      color: var(--cw-text-muted, var(--cw-text-secondary)); background: transparent;
    }
    .switcher__btn:hover { color: var(--cw-text); }
    .switcher__btn--active {
      background: var(--cw-surface); color: var(--cw-text);
      box-shadow: var(--cw-shadow-sm);
    }
    .switcher__icon { font-size: 0.95rem; }
    @media (max-width: 640px) { .switcher__label { display: none; } }
  `]
})
export class ThemeSwitcherComponent {
  readonly theme = inject(ThemeService);
}
