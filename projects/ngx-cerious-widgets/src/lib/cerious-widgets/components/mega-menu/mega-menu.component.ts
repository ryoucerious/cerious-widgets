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

/** A leaf link inside a mega-menu column. */
export interface CwMegaMenuLink {
  label: string;
  icon?: string;
  disabled?: boolean;
  command?: () => void;
  url?: string;
}

/** A column of links inside a mega-menu panel. */
export interface CwMegaMenuColumn {
  header?: string;
  items: CwMegaMenuLink[];
}

/** A top-level mega-menu entry; `columns` makes it a mega dropdown. */
export interface CwMegaMenuItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  command?: () => void;
  columns?: CwMegaMenuColumn[];
}

/**
 * A horizontal menu bar whose top-level items open wide, multi-column
 * dropdown panels. Built on the CDK overlay foundation.
 *
 * Signal-based and OnPush, styled with `--cw-*` tokens.
 *
 * @example
 * <cw-mega-menu [items]="[
 *   { label: 'Products', columns: [{ header: 'Audio', items: [{ label: 'Headphones' }] }] }
 * ]" />
 */
@Component({
  selector: 'cw-mega-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mega-menu.component.html',
  styleUrl: './mega-menu.component.scss',
  host: { 'class': 'cw-mega-menu', 'role': 'menubar' }
})
export class MegaMenuComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ megaMenu: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('megaMenu', this.api);
  }

  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('panel', { static: true }) private panelTemplate!: TemplateRef<unknown>;

  /** The top-level entries. */
  readonly items = input<readonly CwMegaMenuItem[]>([]);

  /** Emitted when a leaf link is activated. */
  readonly itemClick = output<CwMegaMenuLink>();

  readonly openItem = signal<CwMegaMenuItem | null>(null);
  readonly openColumns = signal<readonly CwMegaMenuColumn[]>([]);

  private overlayRef?: OverlayRef;

  onRootClick(item: CwMegaMenuItem, trigger: HTMLElement): void {
    if (item.disabled) {
      return;
    }
    if (item.columns?.length) {
      this.openItem() === item ? this.close() : this.open(item, trigger);
    } else {
      item.command?.();
      this.close();
    }
  }

  activate(link: CwMegaMenuLink): void {
    if (link.disabled) {
      return;
    }
    link.command?.();
    this.itemClick.emit(link);
    this.close();
  }

  private open(item: CwMegaMenuItem, trigger: HTMLElement): void {
    this.close();
    this.openItem.set(item);
    this.openColumns.set(item.columns ?? []);
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(trigger)
        .withPush(true)
        .withPositions(this.positions()),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: ['cw-overlay-panel', 'cw-mega-menu__panel']
    });
    this.overlayRef.attach(new TemplatePortal(this.panelTemplate, this.viewContainerRef));
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
    this.openColumns.set([]);
  }

  private positions(): ConnectedPosition[] {
    return [
      { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
      { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 }
    ];
  }
}
