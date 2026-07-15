import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from 'ngx-cerious-widgets';
import { ThemeService } from '../core/theme.service';

/** Theme preset picker (backed by {@link ThemeService}); dogfoods `cw-select`. */
@Component({
  selector: 'doc-theme-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectComponent, FormsModule],
  template: `
    <cw-select
      class="theme-select"
      [options]="theme.themes"
      optionLabel="label"
      optionValue="id"
      [ngModel]="theme.theme()"
      (ngModelChange)="theme.set($event)"
      aria-label="Theme"
    />
  `,
  styles: [`
    .theme-select { min-width: 11rem; }

    /* Keep the picker compact on phones so the topbar fits without overflowing. */
    @media (max-width: 640px) {
      .theme-select { min-width: 0; width: 7rem; }
    }
  `]
})
export class ThemeSwitcherComponent {
  readonly theme = inject(ThemeService);
}
