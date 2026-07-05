import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

/** A panel-menu entry; `items` makes it an expandable group. */
export interface CwPanelMenuItem {
  key?: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  /** Sub-items — renders an inline expandable section. */
  items?: CwPanelMenuItem[];
  /** Invoked when a leaf item is activated. */
  command?: () => void;
  /** Link target (leaf items). */
  url?: string;
  /** Start expanded (groups only). */
  expanded?: boolean;
}

/**
 * A vertical menu whose groups expand inline (accordion-style), supporting
 * nested levels. Unlike Menubar, sub-items render in place rather than in an
 * overlay.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-panel-menu [items]="[
 *   { label: 'Files', items: [{ label: 'Documents' }, { label: 'Images' }] },
 *   { label: 'Settings' }
 * ]" />
 */
@Component({
  selector: 'cw-panel-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './panel-menu.component.html',
  styleUrl: './panel-menu.component.scss',
  host: { 'class': 'cw-panel-menu', 'role': 'tree' }
})
export class PanelMenuComponent {
  /** The top-level menu entries. */
  readonly items = input<readonly CwPanelMenuItem[]>([]);

  /** Emitted when any leaf item is activated. */
  readonly itemClick = output<CwPanelMenuItem>();

  /**
   * User expand/collapse overrides keyed by group id. Groups without an
   * override fall back to their `expanded` seed flag, so no effect (and no
   * signal write during change detection) is needed.
   */
  private readonly overrides = signal<Map<string, boolean>>(new Map());

  private groupId(item: CwPanelMenuItem): string {
    return item.key ?? item.label;
  }

  isExpanded(item: CwPanelMenuItem): boolean {
    const override = this.overrides().get(this.groupId(item));
    return override ?? !!item.expanded;
  }

  activate(item: CwPanelMenuItem): void {
    if (item.disabled) {
      return;
    }
    if (item.items?.length) {
      const next = new Map(this.overrides());
      next.set(this.groupId(item), !this.isExpanded(item));
      this.overrides.set(next);
    } else {
      item.command?.();
      this.itemClick.emit(item);
    }
  }
}
