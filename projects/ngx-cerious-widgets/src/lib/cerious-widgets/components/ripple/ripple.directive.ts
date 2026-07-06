import { booleanAttribute, Directive, ElementRef, inject, input, NgZone, OnInit } from '@angular/core';

/**
 * Adds a material-style ripple that expands from the click point. Apply to any
 * element; the directive makes it a positioned, clipped ripple container.
 *
 * @example
 * <button cwButton cwRipple>Click me</button>
 * <div cwRipple rippleColor="rgba(99,102,241,0.35)">Card</div>
 */
@Directive({
  selector: '[cwRipple]',
  standalone: true,
  host: { 'class': 'cw-ripple-host' }
})
export class RippleDirective implements OnInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  /** Ripple colour (any CSS colour). */
  readonly rippleColor = input<string>('rgba(255, 255, 255, 0.4)');
  /** Disable the effect. */
  readonly disabled = input(false, { transform: booleanAttribute, alias: 'rippleDisabled' });

  ngOnInit(): void {
    const host = this.el.nativeElement;
    const style = getComputedStyle(host);
    if (style.position === 'static') {
      host.style.position = 'relative';
    }
    host.style.overflow = 'hidden';
    // Run pointer handling outside Angular — a ripple never needs change
    // detection.
    this.zone.runOutsideAngular(() => host.addEventListener('pointerdown', e => this.spawn(e as PointerEvent)));
  }

  private spawn(event: PointerEvent): void {
    if (this.disabled()) {
      return;
    }
    const host = this.el.nativeElement;
    const rect = host.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement('span');
    ripple.className = 'cw-ripple';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
      opacity: 0.55;
      background: ${this.rippleColor()};
      width: ${size}px;
      height: ${size}px;
      left: ${event.clientX - rect.left - size / 2}px;
      top: ${event.clientY - rect.top - size / 2}px;
      transition: transform 0.45s ease-out, opacity 0.6s ease-out;
    `;
    host.appendChild(ripple);
    // Force layout, then animate.
    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(1)';
      ripple.style.opacity = '0';
    });
    ripple.addEventListener('transitionend', () => ripple.remove(), { once: true });
    // Safety net in case transitionend never fires.
    setTimeout(() => ripple.remove(), 800);
  }
}
