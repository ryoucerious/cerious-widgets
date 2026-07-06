import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NAV_ITEMS, NavItem } from './showcase/nav';

interface NavGroup {
  group: string;
  items: NavItem[];
}

type ThemeName = 'light' | 'frost' | 'dark';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly groups = this.groupNav();
  readonly themes: { id: ThemeName; label: string }[] = [
    { id: 'light', label: 'Light' },
    { id: 'frost', label: 'Frost' },
    { id: 'dark', label: 'Dark' }
  ];
  theme: ThemeName = 'light';

  /** Apply a theme on <html> so the whole app + body-attached overlays follow. */
  setTheme(theme: ThemeName): void {
    this.theme = theme;
    const html = document.documentElement;
    html.setAttribute('data-cw-theme', theme);
    html.classList.toggle('cw-dark', theme === 'dark');
  }

  private groupNav(): NavGroup[] {
    const order = ['Data', 'Form', 'Display', 'Navigation', 'Overlay', 'Utilities'];
    const map = new Map<string, NavItem[]>();
    for (const item of NAV_ITEMS) {
      (map.get(item.group) ?? map.set(item.group, []).get(item.group)!).push(item);
    }
    return order.filter(g => map.has(g)).map(g => ({ group: g, items: map.get(g)! }));
  }
}
