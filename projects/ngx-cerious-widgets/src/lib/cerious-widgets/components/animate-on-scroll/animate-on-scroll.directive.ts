import {
  booleanAttribute,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
  OnInit,
  output,
  Renderer2
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/**
 * Applies an animation/visibility class when the host scrolls into view, driven
 * by `IntersectionObserver`. Re-triggers on every entry unless `once` is set.
 *
 * @example
 * <div cwAnimateOnScroll enterClass="cw-fade-in-up">…</div>
 */
@Directive({
  selector: '[cwAnimateOnScroll]',
  standalone: true,
  host: { 'class': 'cw-animate-on-scroll' }
})
export class AnimateOnScrollDirective implements OnInit {
  /** Public API handed to plugins (`{ animateOnScroll: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('animateOnScroll', this.api);
  }

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  /** Class added while the host is intersecting the viewport. */
  readonly enterClass = input<string>('cw-animate-enter');
  /** Class added while the host is *not* intersecting (when not `once`). */
  readonly leaveClass = input<string>('');
  /** Fraction of the host that must be visible to trigger (0–1). */
  readonly threshold = input(0.15, { transform: numberAttribute });
  /** Fire only the first time it enters, then stop observing. */
  readonly once = input(true, { transform: booleanAttribute });

  /** Emitted each time the host enters the viewport. */
  readonly entered = output<void>();

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      // No IO (SSR / very old browser): show immediately, no animation gating.
      this.apply(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.apply(entry.isIntersecting);
          if (entry.isIntersecting) {
            this.entered.emit();
            if (this.once()) {
              this.observer?.disconnect();
            }
          }
        }
      },
      { threshold: this.threshold() }
    );
    this.observer.observe(this.host.nativeElement);
    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  private apply(entering: boolean): void {
    const el = this.host.nativeElement;
    const enter = this.enterClass();
    const leave = this.leaveClass();
    if (entering) {
      if (leave) this.renderer.removeClass(el, leave);
      if (enter) this.renderer.addClass(el, enter);
    } else {
      if (enter) this.renderer.removeClass(el, enter);
      if (leave) this.renderer.addClass(el, leave);
    }
  }
}
