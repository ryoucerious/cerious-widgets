import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { COMPONENT_ICONS, FALLBACK_ICON } from '../core/icons';

/**
 * Renders a component's line icon from the shared {@link COMPONENT_ICONS} map,
 * wrapped in a uniform 24×24 stroke `<svg>` (so every icon shares viewBox,
 * stroke width, caps and `currentColor`). Falls back to a generic glyph.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="app-icon" [innerHTML]="svg()"></span>`,
  styles: [`
    :host { display: inline-flex; line-height: 0; }
    .app-icon { display: inline-flex; width: 100%; height: 100%; }
    :host ::ng-deep svg { width: 100%; height: 100%; display: block; }
  `]
})
export class IconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  /** Component slug (key into the icon map). */
  readonly name = input<string>('');

  readonly svg = computed<SafeHtml>(() => {
    const inner = COMPONENT_ICONS[this.name()] ?? FALLBACK_ICON;
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ` +
        `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`
    );
  });
}
