import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  NgZone,
  numberAttribute,
  signal
} from '@angular/core';

/**
 * A floating "back to top" button that appears after the page (or a target
 * element) is scrolled past a threshold, and smooth-scrolls back to the top.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-scroll-top />                         <!-- watches the window -->
 * <cw-scroll-top [target]="scrollBox" />     <!-- watches an element -->
 */
@Component({
  selector: 'cw-scroll-top',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <button type="button" class="cw-scroll-top__btn" aria-label="Scroll to top" (click)="scrollToTop()">
        <span class="cw-scroll-top__arrow" aria-hidden="true"></span>
      </button>
    }
  `,
  styleUrl: './scroll-top.component.scss',
  host: { 'class': 'cw-scroll-top' }
})
export class ScrollTopComponent {
  private readonly zone = inject(NgZone);

  /** Element to watch/scroll; defaults to the window. */
  readonly target = input<HTMLElement | null>(null);
  /** Scroll distance (px) before the button appears. */
  readonly threshold = input(200, { transform: numberAttribute });
  /** Use smooth scrolling. */
  readonly smooth = input(true, { transform: booleanAttribute });

  readonly visible = signal(false);

  private detach: (() => void) | null = null;

  constructor() {
    // (Re)bind the scroll listener whenever the target changes.
    effect(() => {
      const el = this.target();
      this.detach?.();
      this.detach = this.bind(el ?? window);
    });
    inject(DestroyRef).onDestroy(() => this.detach?.());
  }

  private bind(source: HTMLElement | Window): () => void {
    const onScroll = () => {
      const y = source === window ? window.scrollY : (source as HTMLElement).scrollTop;
      const shouldShow = y > this.threshold();
      if (shouldShow !== this.visible()) {
        this.zone.run(() => this.visible.set(shouldShow));
      }
    };
    this.zone.runOutsideAngular(() => source.addEventListener('scroll', onScroll, { passive: true }));
    onScroll();
    return () => source.removeEventListener('scroll', onScroll);
  }

  scrollToTop(): void {
    const behavior: ScrollBehavior = this.smooth() ? 'smooth' : 'auto';
    const el = this.target();
    (el ?? window).scrollTo({ top: 0, behavior });
  }
}
