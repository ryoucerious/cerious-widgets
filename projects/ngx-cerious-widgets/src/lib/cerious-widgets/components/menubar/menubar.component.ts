import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/** A menubar entry; `items` makes it a dropdown parent. */
export interface CwMenubarItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  /** Invoked when a leaf item is activated. */
  command?: () => void;
  /** Link target (leaf items). */
  url?: string;
  /** Sub-items — renders a dropdown on click. */
  items?: CwMenubarItem[];
}

/**
 * A horizontal application menu bar. Top-level items with `items` open a
 * dropdown built on the CDK overlay; leaf items run their `command`.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-menubar [items]="[
 *   { label: 'File', items: [{ label: 'New' }, { label: 'Open' }] },
 *   { label: 'Help' }
 * ]" />
 */
@Component({
  selector: 'cw-menubar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss',
  host: { 'class': 'cw-menubar', 'role': 'menubar' }
})
export class MenubarComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ menubar: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('menubar', this.api);
  }

  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('submenu', { static: true }) private submenuTemplate!: TemplateRef<unknown>;

  /** The top-level menu entries. */
  readonly items = input<readonly CwMenubarItem[]>([]);

  /** Emitted when any leaf item is activated. */
  readonly itemClick = output<CwMenubarItem>();

  /** The item whose dropdown is open, and its sub-items for the template. */
  readonly openItem = signal<CwMenubarItem | null>(null);
  readonly openSubItems = signal<readonly CwMenubarItem[]>([]);

  private overlayRef?: OverlayRef;

  onRootClick(item: CwMenubarItem, trigger: HTMLElement): void {
    if (item.disabled) {
      return;
    }
    if (item.items?.length) {
      this.openItem() === item ? this.close() : this.open(item, trigger);
    } else {
      this.activate(item);
    }
  }

  activate(item: CwMenubarItem): void {
    if (item.disabled || item.items?.length) {
      return;
    }
    item.command?.();
    this.itemClick.emit(item);
    this.close();
  }

  private open(item: CwMenubarItem, trigger: HTMLElement): void {
    this.close();
    this.openItem.set(item);
    this.openSubItems.set(item.items ?? []);
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(trigger)
        .withPush(false)
        .withPositions(this.positions()),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: ['cw-overlay-panel', 'cw-menubar__dropdown']
    });
    this.overlayRef.attach(new TemplatePortal(this.submenuTemplate, this.viewContainerRef));
    this.overlayRef.outsidePointerEvents().subscribe(event => {
      if (!trigger.contains(event.target as Node)) {
        this.close();
      }
    });
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.openItem.set(null);
    this.openSubItems.set([]);
  }

  private positions(): ConnectedPosition[] {
    return [
      { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
      { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 }
    ];
  }
}
