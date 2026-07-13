import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { componentsByGroup } from '../core/component-registry';
import { IconComponent } from '../ui/icon.component';

/** The /components overview: a grouped gallery grid of every component. */
@Component({
  selector: 'app-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
    <header class="gallery__head">
      <h1 class="gallery__title">Components</h1>
      <p class="gallery__lede">Browse the full cerious-widgets catalog. Pick a component to see live examples, its API and theming notes.</p>
    </header>

    @for (group of groups; track group.group) {
      <section class="gallery__group">
        <h2 class="gallery__group-title">{{ group.group }}</h2>
        <div class="gallery__grid">
          @for (item of group.items; track item.slug) {
            <a class="card" [class.card--soon]="!item.ready" [routerLink]="['/components', item.slug]">
              <span class="card__icon" aria-hidden="true"><app-icon [name]="item.slug" /></span>
              <span class="card__name">
                {{ item.name }}
                @if (!item.ready) { <span class="card__soon">soon</span> }
              </span>
              <span class="card__summary">{{ item.summary }}</span>
            </a>
          }
        </div>
      </section>
    }
  `,
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  readonly groups = componentsByGroup();
}
