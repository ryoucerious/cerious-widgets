import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

/** A dock item. */
export interface CwDockItem {
  label: string;
  /** Icon class, or omit to show the label's first letter. */
  icon?: string;
  disabled?: boolean;
  command?: () => void;
}

/** Dock edge. */
export type CwDockPosition = 'bottom' | 'top' | 'left' | 'right';

/**
 * A macOS-style icon dock with hover magnification: the hovered item grows,
 * with its neighbours scaling less by distance.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-dock [items]="[{ label: 'Files' }, { label: 'Mail' }]" />
 */
@Component({
  selector: 'cw-dock',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.scss',
  host: {
    'class': 'cw-dock',
    '[attr.data-position]': 'position()',
    '(mouseleave)': 'hovered.set(-1)'
  }
})
export class DockComponent {
  /** The dock items. */
  readonly items = input<readonly CwDockItem[]>([]);
  /** Which edge the dock sits on (affects layout + magnify direction). */
  readonly position = input<CwDockPosition>('bottom');
  /** Peak scale of the hovered item. */
  readonly magnification = input(1.5);

  /** Emitted when an item is activated. */
  readonly itemClick = output<CwDockItem>();

  readonly hovered = signal(-1);

  /** Scale for the item at `index`, falling off with distance from the hover. */
  scale(index: number): number {
    const h = this.hovered();
    if (h < 0) {
      return 1;
    }
    const distance = Math.abs(index - h);
    const peak = this.magnification();
    // Neighbours within 2 slots get a partial bump.
    const bump = Math.max(0, (peak - 1) * (1 - distance / 3));
    return 1 + bump;
  }

  /** Stacking order so the hovered (largest) item paints above its neighbours. */
  zIndex(index: number): number {
    const h = this.hovered();
    return h < 0 ? 0 : 100 - Math.abs(index - h);
  }

  activate(item: CwDockItem): void {
    if (item.disabled) {
      return;
    }
    item.command?.();
    this.itemClick.emit(item);
  }
}
