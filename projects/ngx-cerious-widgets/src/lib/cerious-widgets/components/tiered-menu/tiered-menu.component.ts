import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  ViewContainerRef
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/** A tiered-menu entry; `items` makes it a submenu parent. */
export interface CwTieredMenuItem {
  label?: string;
  icon?: string;
  separator?: boolean;
  disabled?: boolean;
  danger?: boolean;
  command?: () => void;
  url?: string;
  items?: CwTieredMenuItem[];
}

/**
 * A vertical menu whose parent items open nested submenus in flanking
 * overlays on hover. Use inline or inside a `[cwPopover]` for a dropdown.
 *
 * Signal-based and OnPush, built on the CDK overlay foundation and styled
 * with `--cw-*` tokens.
 *
 * @example
 * <cw-tiered-menu [items]="[
 *   { label: 'File', items: [{ label: 'New' }, { label: 'Open' }] },
 *   { label: 'Exit' }
 * ]" />
 */
@Component({
  selector: 'cw-tiered-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tiered-menu.component.html',
  styleUrl: './tiered-menu.component.scss',
  host: { 'class': 'cw-tiered-menu', 'role': 'menu' }
})
export class TieredMenuComponent implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ tieredMenu: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('tieredMenu', this.api);
  }

  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  /** The menu entries. */
  readonly items = input<readonly CwTieredMenuItem[]>([]);

  /** Emitted when a leaf item is activated (bubbles up from submenus). */
  readonly itemClick = output<CwTieredMenuItem>();
  /** Emitted to ask an ancestor to close (after a leaf activation). */
  readonly closeRequest = output<void>();

  /** The parent item whose submenu is currently open. */
  readonly openItem = signal<CwTieredMenuItem | null>(null);

  private submenuRef?: OverlayRef;

  onItemEnter(item: CwTieredMenuItem, trigger: HTMLElement): void {
    if (item.separator) {
      return;
    }
    if (item.items?.length && !item.disabled) {
      this.openSubmenu(item, trigger);
    } else {
      this.closeSubmenu();
    }
  }

  activate(item: CwTieredMenuItem): void {
    if (item.disabled || item.separator || item.items?.length) {
      return;
    }
    item.command?.();
    this.itemClick.emit(item);
    this.closeRequest.emit();
  }

  private openSubmenu(item: CwTieredMenuItem, trigger: HTMLElement): void {
    if (this.openItem() === item) {
      return;
    }
    this.closeSubmenu();
    this.openItem.set(item);

    this.submenuRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(trigger)
        .withPush(true)
        .withPositions(this.positions()),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: ['cw-overlay-panel', 'cw-tiered-menu__submenu']
    });

    const ref = this.submenuRef.attach(new ComponentPortal(TieredMenuComponent, this.viewContainerRef));
    ref.setInput('items', item.items ?? []);
    // Bubble activations up and propagate the close request to our own ancestor.
    ref.instance.itemClick.subscribe(sub => this.itemClick.emit(sub));
    ref.instance.closeRequest.subscribe(() => {
      this.closeSubmenu();
      this.closeRequest.emit();
    });
    ref.changeDetectorRef.detectChanges();
  }

  closeSubmenu(): void {
    this.submenuRef?.dispose();
    this.submenuRef = undefined;
    this.openItem.set(null);
  }

  ngOnDestroy(): void {
    this.closeSubmenu();
  }

  private positions(): ConnectedPosition[] {
    return [
      { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 2, offsetY: -5 },
      { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -2, offsetY: -5 }
    ];
  }
}
