import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal
} from '@angular/core';

/** Tooltip placement relative to its host. */
export type CwTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * The overlay-rendered tooltip bubble. Created by {@link TooltipDirective};
 * not meant to be used directly.
 */
@Component({
  selector: 'cw-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ text() }}`,
  styleUrl: './tooltip.directive.scss',
  host: {
    'class': 'cw-tooltip',
    'role': 'tooltip',
    '[attr.data-position]': 'position()'
  }
})
export class TooltipComponent {
  readonly text = signal('');
  readonly position = signal<CwTooltipPosition>('right');
}

/**
 * Shows a small text bubble next to the host on hover / focus.
 *
 * @example
 * <button cwTooltip="Delete this row">🗑</button>
 * <span cwTooltip="More info" cwTooltipPosition="top">ⓘ</span>
 */
@Directive({
  selector: '[cwTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'show()',
    '(focus)': 'show()',
    '(mouseleave)': 'hide()',
    '(blur)': 'hide()'
  }
})
export class TooltipDirective implements OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The tooltip text; nothing is shown while empty. */
  readonly text = input<string>('', { alias: 'cwTooltip' });
  /** Placement relative to the host. */
  readonly position = input<CwTooltipPosition>('right', { alias: 'cwTooltipPosition' });

  private overlayRef?: OverlayRef;

  show(): void {
    if (!this.text() || this.overlayRef) {
      return;
    }
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.host)
        .withPush(false)
        .withPositions(this.positions()),
      scrollStrategy: this.overlay.scrollStrategies.close()
    });
    const ref = this.overlayRef.attach(new ComponentPortal(TooltipComponent));
    ref.instance.text.set(this.text());
    ref.instance.position.set(this.position());
  }

  hide(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  ngOnDestroy(): void {
    this.hide();
  }

  private positions(): ConnectedPosition[] {
    const gap = 8;
    const all: Record<CwTooltipPosition, ConnectedPosition> = {
      right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: gap },
      left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -gap },
      top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -gap },
      bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: gap }
    };
    const opposite: Record<CwTooltipPosition, CwTooltipPosition> = {
      right: 'left', left: 'right', top: 'bottom', bottom: 'top'
    };
    return [all[this.position()], all[opposite[this.position()]]];
  }
}
