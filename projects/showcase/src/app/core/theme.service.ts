import { Injectable, signal } from '@angular/core';

export type ThemeName = 'light' | 'frost' | 'dark';

const STORAGE_KEY = 'cw-showcase-theme';

/**
 * App-wide theme state. Applies the selected theme to `<html>` (via
 * `data-cw-theme` + the `.cw-dark` class) so every component — including
 * body-attached CDK overlays — follows it, and persists the choice.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly themes: { id: ThemeName; label: string; icon: string }[] = [
    { id: 'light', label: 'Light', icon: '☀' },
    { id: 'frost', label: 'Frost', icon: '❄' },
    { id: 'dark', label: 'Dark', icon: '☾' }
  ];

  readonly theme = signal<ThemeName>(this.readInitial());

  constructor() {
    this.apply(this.theme());
  }

  set(theme: ThemeName): void {
    this.theme.set(theme);
    this.apply(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage may be unavailable (private mode) — ignore */
    }
  }

  private apply(theme: ThemeName): void {
    const html = document.documentElement;
    html.setAttribute('data-cw-theme', theme);
    html.classList.toggle('cw-dark', theme === 'dark');
  }

  private readInitial(): ThemeName {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
      if (stored === 'light' || stored === 'frost' || stored === 'dark') {
        return stored;
      }
    } catch {
      /* ignore */
    }
    return 'light';
  }
}
