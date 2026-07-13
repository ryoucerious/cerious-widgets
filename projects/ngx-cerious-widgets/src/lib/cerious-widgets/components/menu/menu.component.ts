import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/** One menu entry; set `separator` for a divider line instead of an item. */
export interface CwMenuItem {
  label?: string;
  /** Optional leading icon class. */
  icon?: string;
  /** Render as a divider line. */
  separator?: boolean;
  disabled?: boolean;
  /** Style the item as destructive (e.g. Delete). */
  danger?: boolean;
  /** Invoked when the item is activated. */
  command?: () => void;
  /** Render as a link instead of a button. */
  url?: string;
}

/**
 * A vertical menu of actions or links. Use it inline (navigation panel) or
 * inside a `[cwPopover]` panel for a dropdown menu.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-menu [items]="[{ label: 'Edit' }, { separator: true }, { label: 'Delete', danger: true }]" />
 */
@Component({
  selector: 'cw-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  host: { 'class': 'cw-menu', 'role': 'menu' }
})
export class MenuComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ menu: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('menu', this.api);
  }

  /** The menu entries, in order. */
  readonly items = input<readonly CwMenuItem[]>([]);
  /** Index of the item to highlight as active (e.g. current route). */
  readonly activeIndex = input(-1);

  /** Emitted when an item is activated (after its `command` runs). */
  readonly itemClick = output<CwMenuItem>();

  activate(item: CwMenuItem): void {
    if (item.disabled || item.separator) {
      return;
    }
    item.command?.();
    this.itemClick.emit(item);
  }
}
