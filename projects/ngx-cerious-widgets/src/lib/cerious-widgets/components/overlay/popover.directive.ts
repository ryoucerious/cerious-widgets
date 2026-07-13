import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';
import { filter } from 'rxjs/operators';

export type CwPopoverPlacement =
  | 'bottom' | 'top' | 'left' | 'right'
  | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

/**
 * Anchored overlay primitive: opens a floating panel of templated content
 * positioned relative to its host element. This is the foundation the higher
 * level overlays (dropdown, menu, tooltip) build on.
 *
 * Wraps the CDK overlay engine (positioning / flip / scroll reposition / portal)
 * behind a signal-based, token-styled API. The panel is rendered into the CDK
 * overlay container with the `cw-overlay-panel` surface.
 *
 * @example
 * <button [cwPopover]="menu">Open</button>
 * <ng-template #menu> ...panel content... </ng-template>
 */
@Directive({
  selector: '[cwPopover]',
  standalone: true,
  exportAs: 'cwPopover',
  host: { '(click)': 'toggle()' }
})
export class PopoverDirective implements OnDestroy {
  /** Public API handed to plugins (`{ popover: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('popover', this.api);
  }

  private readonly overlay = inject(Overlay);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);

  /** The content to display in the panel. */
  readonly content = input.required<TemplateRef<unknown>>({ alias: 'cwPopover' });
  /** Preferred placement relative to the host; flips when there is no room. */
  readonly placement = input<CwPopoverPlacement>('bottom', { alias: 'cwPopoverPlacement' });
  /** Disable opening entirely. */
  readonly disabled = input(false, { alias: 'cwPopoverDisabled', transform: booleanAttribute });

  /** Emits when the panel opens. */
  readonly opened = output<void>({ alias: 'cwPopoverOpened' });
  /** Emits when the panel closes. */
  readonly closed = output<void>({ alias: 'cwPopoverClosed' });

  private overlayRef?: OverlayRef;

  /** Whether the panel is currently open. */
  get isOpen(): boolean {
    return !!this.overlayRef?.hasAttached();
  }

  /** Toggles the panel open/closed. */
  toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  /** Opens the panel (no-op if disabled or already open). */
  open(): void {
    if (this.disabled() || this.isOpen) {
      return;
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.host)
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions(this.positionsFor(this.placement()));

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: 'cw-overlay-panel'
    });

    this.overlayRef.attach(new TemplatePortal(this.content(), this.viewContainerRef));
    this.opened.emit();

    // Close on a pointer event outside both the panel and the host trigger.
    this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => !this.host.nativeElement.contains(event.target as Node)))
      .subscribe(() => this.close());

    // Close on Escape.
    this.overlayRef
      .keydownEvents()
      .pipe(filter(event => event.key === 'Escape'))
      .subscribe(() => this.close());
  }

  /** Closes and disposes the panel. */
  close(): void {
    if (!this.overlayRef) {
      return;
    }
    this.overlayRef.dispose();
    this.overlayRef = undefined;
    this.closed.emit();
  }

  ngOnDestroy(): void {
    this.close();
  }

  /** Primary connected position for a placement plus its flipped fallback. */
  private positionsFor(placement: CwPopoverPlacement): ConnectedPosition[] {
    const gap = 4;
    // Each placement lists its primary position first, then vertical-flip and
    // horizontal-align fallbacks so a trigger near a viewport edge stays on-screen
    // (CDK picks the first position that fits). `-start`/`-end` pin the panel's
    // left/right edge to the trigger (e.g. a top-right bell → `bottom-end`).
    const belowStart: ConnectedPosition = { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: gap };
    const belowEnd: ConnectedPosition = { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: gap };
    const aboveStart: ConnectedPosition = { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -gap };
    const aboveEnd: ConnectedPosition = { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -gap };
    switch (placement) {
      case 'top':
      case 'top-start':
        return [aboveStart, aboveEnd, belowStart, belowEnd];
      case 'top-end':
        return [aboveEnd, aboveStart, belowEnd, belowStart];
      case 'bottom-end':
        return [belowEnd, belowStart, aboveEnd, aboveStart];
      case 'left':
        return [
          { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -gap },
          { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -gap },
          { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: gap }
        ];
      case 'right':
        return [
          { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: gap },
          { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: gap },
          { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -gap }
        ];
      case 'bottom':
      case 'bottom-start':
      default:
        return [belowStart, belowEnd, aboveStart, aboveEnd];
    }
  }
}
