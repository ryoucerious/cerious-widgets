import { inject, Injectable } from '@angular/core';
import { CwThemeService } from 'ngx-cerious-widgets';

/** Glyph per preset for the switcher. */
const ICONS: Record<string, string> = {
  light: '☀', frost: '❄', dark: '☾', cerious: '◆',
  midnight: '🌙', sandstone: '🏜', emerald: '🌿', grape: '🍇', contrast: '◐',
  flat: '▭', soft: '◍'
};

/**
 * App-wide theme state for the showcase, backed by the library's runtime
 * {@link CwThemeService}. Lists every built-in preset and applies the selection
 * to `<html>` (so body-attached CDK overlays follow it too), persisting it.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly cw = inject(CwThemeService);

  readonly themes = this.cw.presets
    .map(p => ({ id: p.name, label: p.label, icon: ICONS[p.name] ?? '◆' }))
    .sort((a, b) => a.label.localeCompare(b.label));

  /** Current preset name (the library service's signal). */
  readonly theme = this.cw.theme;

  constructor() {
    // Frost is the showcase default when nothing is persisted.
    this.cw.apply({ preset: this.cw.readStored() ?? 'frost', persist: true });
  }

  set(id: string): void {
    this.cw.apply({ preset: id, persist: true });
  }
}
