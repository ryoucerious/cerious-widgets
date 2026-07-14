import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';
import { CwMenuItem, MenuComponent } from '../menu/menu.component';

/**
 * Opens a `cw-menu` at the pointer on right-click.
 *
 * @example
 * <div [cwContextMenu]="[{ label: 'Rename' }, { label: 'Delete', danger: true }]">
 *   Right-click me
 * </div>
 */
@Directive({
  selector: '[cwContextMenu]',
  standalone: true,
  host: { '(contextmenu)': 'open($event)' }
})
export class ContextMenuDirective implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ contextMenu: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('contextMenu', this.api);
  }

  private readonly overlay = inject(Overlay);

  /** The menu entries to show. */
  readonly items = input<readonly CwMenuItem[]>([], { alias: 'cwContextMenu' });

  private overlayRef?: OverlayRef;

  /**
   * Dismiss on the *next* pointer press outside the menu. We deliberately listen
   * for `pointerdown` (a fresh press), not the release of the right-click that
   * opened the menu — CDK's `outsidePointerEvents` fires on that release on some
   * platforms (notably macOS), which made the menu vanish the instant the button
   * came up. The opening press already happened before this listener existed, so
   * it can only ever fire on a subsequent interaction.
   */
  private readonly onDocPointerDown = (e: PointerEvent): void => {
    if (this.overlayRef && !this.overlayRef.overlayElement.contains(e.target as Node)) {
      this.close();
    }
  };

  open(event: MouseEvent): void {
    if (!this.items().length) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.close();

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .global()
        .left(`${event.clientX}px`)
        .top(`${event.clientY}px`),
      scrollStrategy: this.overlay.scrollStrategies.close(),
      hasBackdrop: false,
      panelClass: 'cw-overlay-panel'
    });

    const ref = this.overlayRef.attach(new ComponentPortal(MenuComponent));
    ref.setInput('items', this.items());
    ref.instance.itemClick.subscribe(() => this.close());
    ref.changeDetectorRef.detectChanges();

    // Capture-phase so it runs before component handlers; safe to add now — the
    // opening press has already fired, so this only reacts to the next press.
    document.addEventListener('pointerdown', this.onDocPointerDown, true);
    this.overlayRef.keydownEvents().subscribe(e => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  close(): void {
    document.removeEventListener('pointerdown', this.onDocPointerDown, true);
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  ngOnDestroy(): void {
    this.close();
  }
}
