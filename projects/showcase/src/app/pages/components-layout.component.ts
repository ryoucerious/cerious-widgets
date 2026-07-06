import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { componentsByGroup } from '../core/component-registry';

/**
 * The docs shell: a filterable, grouped component sidebar beside a router outlet
 * that renders the gallery overview or an individual component doc page.
 */
@Component({
  selector: 'app-components-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="docs">
      <aside class="docs__sidebar">
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
                >
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
