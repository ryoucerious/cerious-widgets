import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  Directive,
  effect,
  inject,
  input,
  NgZone,
  numberAttribute,
  output,
  signal,
  TemplateRef
} from '@angular/core';

/**
 * Marks a carousel slide: `<ng-template cwCarouselItem>…</ng-template>`.
 * Collected by {@link CarouselComponent}.
 */
@Directive({ selector: '[cwCarouselItem]', standalone: true })
export class CarouselItemDirective {
  readonly template = inject(TemplateRef<unknown>);
}

/**
 * A content carousel: rotates through projected slides with prev/next
 * controls and indicator dots, plus optional autoplay.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-carousel [autoplay]="3000">
 *   <ng-template cwCarouselItem>Slide one</ng-template>
 *   <ng-template cwCarouselItem>Slide two</ng-template>
 * </cw-carousel>
 */
@Component({
  selector: 'cw-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  host: { 'class': 'cw-carousel', 'role': 'region', 'aria-roledescription': 'carousel' }
})
export class CarouselComponent {
  private readonly zone = inject(NgZone);

  readonly slides = contentChildren(CarouselItemDirective);

  /** Initially active slide index. */
  readonly activeIndex = input(0, { transform: numberAttribute });
  /** Wrap from the last slide to the first (and vice versa). */
  readonly circular = input(true, { transform: booleanAttribute });
  /** Autoplay interval in ms; 0 disables it. */
  readonly autoplay = input(0, { transform: numberAttribute });
  /** Show the indicator dots. */
  readonly showIndicators = input(true, { transform: booleanAttribute });
  /** Show the prev/next arrows. */
  readonly showNavigators = input(true, { transform: booleanAttribute });

  /** Emitted when the active slide changes. */
  readonly activeIndexChange = output<number>();

  private readonly userIndex = signal<number | undefined>(undefined);
  readonly current = computed(() => {
    const count = this.slides().length;
    if (count === 0) {
      return 0;
    }
    return Math.min(this.userIndex() ?? this.activeIndex(), count - 1);
  });

  readonly canPrev = computed(() => this.circular() || this.current() > 0);
  readonly canNext = computed(() => this.circular() || this.current() < this.slides().length - 1);
  readonly activeTemplate = computed(() => this.slides()[this.current()]?.template ?? null);

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Restart the autoplay timer whenever the interval or slide count changes.
    // The interval callback writes signals as a deferred task (not synchronously
    // inside the effect), so there is no signal-write-in-effect violation.
    effect(() => {
      const ms = this.autoplay();
      const count = this.slides().length;
      this.stop();
      if (ms > 0 && count > 1) {
        this.zone.runOutsideAngular(() => {
          this.timer = setInterval(() => this.zone.run(() => this.next(true)), ms);
        });
      }
    });
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  go(index: number): void {
    const count = this.slides().length;
    if (count === 0) {
      return;
    }
    const next = this.circular()
      ? ((index % count) + count) % count
      : Math.min(Math.max(index, 0), count - 1);
    if (next !== this.current()) {
      this.userIndex.set(next);
      this.activeIndexChange.emit(next);
    }
  }

  prev(): void {
    this.go(this.current() - 1);
  }

  next(fromTimer = false): void {
    if (!fromTimer && !this.canNext()) {
      return;
    }
    this.go(this.current() + 1);
  }

  private stop(): void {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
