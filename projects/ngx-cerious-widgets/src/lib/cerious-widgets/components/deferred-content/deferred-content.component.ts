import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  numberAttribute,
  OnInit,
  output,
  signal
} from '@angular/core';

/**
 * Defers rendering of its projected content until it scrolls into the viewport,
 * using `IntersectionObserver`. Ideal for heavy below-the-fold sections (charts,
 * images, iframes) to cut initial render cost.
 *
 * @example
 * <cw-deferred-content (loaded)="initChart()">
 *   <canvas #chart></canvas>
 * </cw-deferred-content>
 */
@Component({
  selector: 'cw-deferred-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <ng-content />
    }
  `,
  host: { 'class': 'cw-deferred-content' }
})
export class DeferredContentComponent implements OnInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  /** Fraction of the host visible before it renders (0–1). */
  readonly threshold = input(0, { transform: numberAttribute });

  /** Emitted once, when the content is first rendered. */
  readonly loaded = output<void>();

  readonly visible = signal(false);

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.reveal();
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.reveal();
          this.observer?.disconnect();
        }
      },
      { threshold: this.threshold() }
    );
    this.observer.observe(this.host.nativeElement);
    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  private reveal(): void {
    if (!this.visible()) {
      this.visible.set(true);
      this.loaded.emit();
    }
  }
}
