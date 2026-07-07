import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable, Injector, Type } from '@angular/core';
import { DYNAMIC_DIALOG_CONFIG, DynamicDialogConfig } from './dynamic-dialog.config';
import { DynamicDialogContainer } from './dynamic-dialog.container';
import { DynamicDialogRef } from './dynamic-dialog.ref';

/**
 * Opens any component imperatively inside a modal dialog.
 *
 * The opened component injects {@link DynamicDialogRef} to close itself with a
 * result, and {@link DYNAMIC_DIALOG_CONFIG} to read the passed `data`.
 *
 * @example
 * const ref = this.dialog.open(EditUserComponent, { header: 'Edit', data: user });
 * ref.closed.subscribe(result => { … });
 */
@Injectable({ providedIn: 'root' })
export class DynamicDialogService {
  private readonly overlay = inject(Overlay);
  private readonly parentInjector = inject(Injector);

  open<R = unknown, D = unknown>(component: Type<unknown>, config: DynamicDialogConfig<D> = {}): DynamicDialogRef<R> {
    const dialogRef = new DynamicDialogRef<R>();

    const overlayRef: OverlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: 'cw-dialog-backdrop'
    });

    // Injector for the *opened* component: it can grab the ref + config.
    const contentInjector = Injector.create({
      parent: this.parentInjector,
      providers: [
        { provide: DynamicDialogRef, useValue: dialogRef },
        { provide: DYNAMIC_DIALOG_CONFIG, useValue: config }
      ]
    });

    const containerRef = overlayRef.attach(
      new ComponentPortal(DynamicDialogContainer, null, this.parentInjector)
    );
    containerRef.setInput('config', config);
    containerRef.setInput('portal', new ComponentPortal(component, null, contentInjector));
    containerRef.instance.closeClick.subscribe(() => dialogRef.close());
    // The overlay attaches the view without an immediate change-detection pass;
    // render synchronously so the chrome + portalled content appear at once.
    containerRef.changeDetectorRef.detectChanges();

    dialogRef.onClose = () => overlayRef.dispose();

    if (config.closeOnBackdrop !== false) {
      overlayRef.backdropClick().subscribe(() => dialogRef.close());
    }
    if (config.closeOnEscape !== false) {
      overlayRef.keydownEvents().subscribe(event => {
        if (event.key === 'Escape') {
          dialogRef.close();
        }
      });
    }

    return dialogRef;
  }
}
