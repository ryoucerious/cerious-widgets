import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { componentsByGroup } from '../core/component-registry';
import { IconComponent } from '../ui/icon.component';

/**
 * The docs shell: a filterable, grouped component sidebar beside a router outlet
 * that renders the gallery overview or an individual component doc page.
 */
@Component({
  selector: 'app-components-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="docs">
      <aside class="docs__sidebar" [class.docs__sidebar--open]="navOpen()">
        <!-- Phone-only disclosure: the full list would otherwise eat the screen
             above every doc page. Hidden on desktop, where the panel is always open. -->
        <button
          type="button"
          class="docs__toggle"
          (click)="navOpen.set(!navOpen())"
          [attr.aria-expanded]="navOpen()"
          aria-controls="docs-nav-panel"
        >
          <span>Browse components</span>
          <svg class="docs__toggle-caret" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
            <path d="M3.5 6L8 10.5 12.5 6" fill="none" stroke="currentColor"
                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div class="docs__panel" id="docs-nav-panel">
          <div class="docs__search">
            <input
              type="search"
              class="docs__search-input"
              placeholder="Filter components…"
              [value]="query()"
              (input)="query.set($any($event.target).value)"
              aria-label="Filter components"
            />
          </div>
          <nav class="docs__nav">
            @for (group of filteredGroups(); track group.group) {
              <div class="docs__group">
                <div class="docs__group-label">{{ group.group }}</div>
                @for (item of group.items; track item.slug) {
                  <a
                    class="docs__link"
                    [class.docs__link--soon]="!item.ready"
                    [routerLink]="['/components', item.slug]"
                    routerLinkActive="docs__link--active"
                    (click)="navOpen.set(false)"
                  >
                    <span class="docs__link-icon" aria-hidden="true"><app-icon [name]="item.slug" /></span>
                    <span class="docs__link-name">{{ item.name }}</span>
                    @if (!item.ready) { <span class="docs__soon">soon</span> }
                  </a>
                }
              </div>
            }
            @if (filteredGroups().length === 0) {
              <p class="docs__empty">No components match “{{ query() }}”.</p>
            }
          </nav>
        </div>
      </aside>

      <div class="docs__content">
        <router-outlet />
      </div>
    </div>
  `,
  styleUrl: './components-layout.component.scss'
})
export class ComponentsLayoutComponent {
  readonly query = signal('');
  /** Phone-only: whether the component list disclosure is expanded (see the CSS). */
  readonly navOpen = signal(false);
  private readonly groups = componentsByGroup();

  readonly filteredGroups = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      return this.groups;
    }
    return this.groups
      .map(g => ({ group: g.group, items: g.items.filter(i => i.name.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q)) }))
      .filter(g => g.items.length > 0);
  });
}
