import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChildren, input, signal } from '@angular/core';
import { findComponent } from '../core/component-registry';
import { DocTabComponent } from './doc-tab.component';

/**
 * The frame for a single component's documentation page: a header (name +
 * summary, pulled from the registry by `slug`, plus badges) and a tab bar that
 * switches between the projected `<doc-tab>`s (Features / API / Theming).
 */
@Component({
  selector: 'doc-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <article class="doc-page">
      <header class="doc-page__head">
        <div class="doc-page__title-row">
          <h1 class="doc-page__title">{{ doc()?.name || slug() }}</h1>
          @if (doc()?.complex) { <span class="doc-page__badge doc-page__badge--complex">Advanced</span> }
          @if (doc()?.virtualized) { <span class="doc-page__badge doc-page__badge--virtual">Virtual scroll</span> }
        </div>
        <p class="doc-page__summary">{{ doc()?.summary }}</p>
      </header>

      <nav class="doc-page__tabs" role="tablist">
        @for (tab of tabs(); track tab.label(); let i = $index) {
          <button
            type="button"
            role="tab"
            class="doc-page__tab"
            [class.doc-page__tab--active]="i === active()"
            [attr.aria-selected]="i === active()"
            (click)="active.set(i)"
          >{{ tab.label() }}</button>
        }
      </nav>

      <div class="doc-page__body" role="tabpanel">
        @if (activeTab(); as t) {
          <ng-container [ngTemplateOutlet]="t.content()" />
        }
      </div>
    </article>
  `,
  styles: [`
    .doc-page { max-width: 62rem; }
    .doc-page__head { margin-bottom: 1.5rem; }
    .doc-page__title-row { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
    .doc-page__title { margin: 0; font-size: 2rem; font-weight: 750; letter-spacing: -0.02em; color: var(--cw-text); }
    .doc-page__badge {
      font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 999px;
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .doc-page__badge--complex { background: var(--cw-info-bg, #e0e7ff); color: var(--cw-info-fg, #4338ca); }
    .doc-page__badge--virtual { background: var(--cw-success-bg, #dcfce7); color: var(--cw-success-fg, #166534); }
    .doc-page__summary { margin: 0.6rem 0 0; font-size: 1.05rem; line-height: 1.6; color: var(--cw-text-muted, var(--cw-text-secondary)); max-width: 60ch; }
    .doc-page__tabs {
      display: flex; gap: 0.25rem; margin-bottom: 2rem;
      border-bottom: 1px solid var(--cw-border);
    }
    .doc-page__tab {
      appearance: none; background: none; border: none; cursor: pointer;
      padding: 0.65rem 0.9rem; font-size: 0.95rem; font-weight: 550; font-family: var(--cw-font);
      color: var(--cw-text-muted, var(--cw-text-secondary));
      border-bottom: 2px solid transparent; margin-bottom: -1px;
    }
    .doc-page__tab:hover { color: var(--cw-text); }
    .doc-page__tab--active { color: var(--cw-primary); border-bottom-color: var(--cw-primary); }
  `]
})
export class DocPageComponent {
  readonly slug = input.required<string>();
  readonly tabs = contentChildren(DocTabComponent);
  readonly active = signal(0);

  readonly doc = computed(() => findComponent(this.slug()));
  readonly activeTab = computed(() => this.tabs()[this.active()]);
}
