import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef, ComponentRef, createComponent, EnvironmentInjector,
  inject, Injectable, PLATFORM_ID, signal
} from '@angular/core';
import { buildTokens } from './build-tokens';
import { CW_PRESETS, findPreset } from './presets';
import { CwStyleHostComponent } from './style-host.component';
import { CwPreset, CwThemeConfig } from './theme.types';

const STORAGE_KEY = 'cw-theme';

/**
 * Runtime theming for cerious-widgets. `apply()` expands a preset (+ optional
 * brand-colour / token overrides) into the full `--cw-*` token set and writes it
 * as inline custom properties on a scope element (default `<html>`), so the
 * whole component library — including body-attached CDK overlays — re-skins
 * live. The static stylesheet (Light/Frost/Dark) remains the zero-JS baseline;
 * this layer sits on top.
 *
 * @example
 * // In app.config.ts: provideCeriousTheme({ preset: 'emerald' })
 * // Or at runtime:
 * themeService.apply({ preset: 'dark', primary: '#e11d48' });
 */
@Injectable({ providedIn: 'root' })
export class CwThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly custom = new Map<string, CwPreset>();

  private styleHostRef?: ComponentRef<CwStyleHostComponent>;

  /** The name of the currently applied preset. */
  readonly theme = signal<string>('light');

  /** All available presets (built-in + any registered at runtime). */
  get presets(): CwPreset[] {
    return [...CW_PRESETS, ...this.custom.values()];
  }

  /** Register a custom preset so it can be applied by name and listed in pickers. */
  registerPreset(preset: CwPreset): void {
    this.custom.set(preset.name, preset);
  }

  /** Resolve a preset by name from built-ins or registered customs. */
  private resolve(name?: string): CwPreset {
    return this.custom.get(name ?? '') ?? findPreset(name);
  }

  /**
   * Apply a theme. Derives the token set from the chosen preset and any
   * overrides, then writes `--cw-*` custom properties (and `data-cw-theme` /
   * `color-scheme` / `.cw-dark`) onto the scope element.
   */
  apply(config: CwThemeConfig = {}): void {
    this.ensureGlobalStyles();

    const target = config.scope ?? this.doc.documentElement;
    if (!target) { return; }

    const preset = this.resolve(config.preset ?? this.theme());
    const tokens = buildTokens(preset, { ...config });

    for (const [key, value] of Object.entries(tokens)) {
      target.style.setProperty(`--cw-${key}`, value);
    }

    const dark = preset.dark ?? preset.base === 'dark';
    // Reflect the base mode so static [data-cw-theme] hooks (e.g. the Frost
    // glassmorphism rules) still activate; the inline tokens above win over them.
    target.setAttribute('data-cw-theme', preset.base);
    target.setAttribute('data-cw-preset', preset.name);
    target.style.colorScheme = dark ? 'dark' : 'light';
    target.classList.toggle('cw-dark', dark);

    this.theme.set(preset.name);

    if (config.persist) {
      try { localStorage.setItem(STORAGE_KEY, preset.name); } catch { /* ignore */ }
    }
  }

  /**
   * Inject the library's structural stylesheet once (design tokens, overlay and
   * virtual-scrollbar theming, directive-applied form classes, grid chrome) by
   * instantiating the {@link CwStyleHostComponent} (`ViewEncapsulation.None`).
   * Idempotent and browser-only. This is what lets consumers skip adding
   * `grid-styles-generated.scss` to their build, calling `provideCeriousTheme()`
   * or `CeriousWidgetsModule.forRoot()` is enough. A pre-existing manual import
   * still works, the injected sheet is identical and simply deduped by the browser.
   */
  ensureGlobalStyles(): void {
    if (this.styleHostRef || !this.isBrowser) { return; }
    const ref = createComponent(CwStyleHostComponent, { environmentInjector: this.envInjector });
    this.appRef.attachView(ref.hostView);
    this.doc.body?.appendChild(ref.location.nativeElement);
    this.styleHostRef = ref;
  }

  /** The persisted preset name from a previous session, if any. */
  readStored(): string | null {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }
}
