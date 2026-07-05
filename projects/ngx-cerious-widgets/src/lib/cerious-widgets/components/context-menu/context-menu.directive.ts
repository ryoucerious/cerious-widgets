import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, inject, input, OnDestroy } from '@angular/core';
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

    this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(e => e.type !== 'contextmenu'))
      .subscribe(() => this.close());
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
