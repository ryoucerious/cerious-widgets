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
import { filter } from 'rxjs/operators';
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

    // Defer the outside-click listener to the next tick: otherwise the
    // pointerup/mouseup from *releasing* the right button that just opened the
    // menu is caught as an "outside" event and closes it immediately (making it
    // seem like you must hold the button down).
    const ownerRef = this.overlayRef;
    setTimeout(() => {
      if (this.overlayRef !== ownerRef) {
        return;
      }
      ownerRef
        .outsidePointerEvents()
        .pipe(filter(e => e.type !== 'contextmenu'))
        .subscribe(() => this.close());
    });
    this.overlayRef.keydownEvents().subscribe(e => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  ngOnDestroy(): void {
    this.close();
  }
}
