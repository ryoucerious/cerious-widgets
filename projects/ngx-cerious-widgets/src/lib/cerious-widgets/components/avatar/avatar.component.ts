import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

export type CwAvatarSize = 'small' | 'normal' | 'large';
export type CwAvatarShape = 'circle' | 'square';

/**
 * Represents a user or entity as an image, initials, or icon.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 * Rendering priority: image → label (initials) → icon.
 *
 * @example
 * <cw-avatar label="JK" />
 * <cw-avatar image="/me.jpg" size="large" shape="square" />
 */
@Component({
  selector: 'cw-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (image()) {
      <img class="cw-avatar__image" [src]="image()" [alt]="label()" />
    } @else if (label()) {
      <span class="cw-avatar__label">{{ label() }}</span>
    } @else if (icon()) {
      <i class="cw-avatar__icon" [class]="icon()"></i>
    }
  `,
  styleUrl: './avatar.component.scss',
  host: {
    'class': 'cw-avatar',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()'
  }
})
export class AvatarComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ avatar: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('avatar', this.api);
  }

  /** Initials or short text shown when no image is provided. */
  readonly label = input<string>('');
  /** Image URL; takes precedence over label and icon. */
  readonly image = input<string>('');
  /** Icon class shown when neither image nor label is provided. */
  readonly icon = input<string>('');
  /** Visual size. */
  readonly size = input<CwAvatarSize>('normal');
  /** Circle (default) or square shape. */
  readonly shape = input<CwAvatarShape>('circle');
}
