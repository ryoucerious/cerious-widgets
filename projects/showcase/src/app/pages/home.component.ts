import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
  ProgressBarComponent,
  RatingComponent,
  TagComponent,
  ToggleSwitchComponent
} from 'ngx-cerious-widgets';
import { COMPONENTS, GROUP_ORDER, TOTAL_COMPONENTS } from '../core/component-registry';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, FormsModule,
    ButtonComponent, TagComponent, BadgeComponent, RatingComponent,
    ToggleSwitchComponent, ProgressBarComponent, AvatarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly total = TOTAL_COMPONENTS;
  readonly groupCount = GROUP_ORDER.length;
  readonly virtualCount = COMPONENTS.filter(c => c.virtualized).length;

  // Live montage state. ngModel-bound fields are plain (two-way needs a settable
  // member, not a signal getter); progress is display-only.
  ratingModel = 4;
  notificationsModel = true;
  readonly progress = signal(72);

  readonly highlights = [
    { icon: '🧩', title: `${TOTAL_COMPONENTS}+ components`, text: 'A full, comprehensive catalog — from inputs and overlays to a virtualized data grid.' },
    { icon: '🎨', title: 'Three themes, zero rebuild', text: 'Cerious Light, Frost glassmorphism and Dark — all driven by --cw-* design tokens.' },
    { icon: '⚡', title: 'Signals & OnPush', text: 'Every component is standalone, zoneless-safe and built on modern Angular signal inputs.' },
    { icon: '♾️', title: 'Virtual scrolling built in', text: `${COMPONENTS.filter(c => c.virtualized).length} data components virtualize huge lists via ngx-cerious-scroll.` }
  ];
}
