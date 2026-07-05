import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
  output,
  signal
} from '@angular/core';

/** A galleria image. */
export interface CwGalleriaImage {
  src: string;
  alt?: string;
  /** Optional thumbnail URL; falls back to `src`. */
  thumbnail?: string;
}

/**
 * An image gallery: a large active image with prev/next controls, an indicator
 * and a clickable thumbnail strip.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-galleria [images]="photos" />
 */
@Component({
  selector: 'cw-galleria',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './galleria.component.html',
  styleUrl: './galleria.component.scss',
  host: { 'class': 'cw-galleria', 'role': 'region', 'aria-roledescription': 'gallery' }
})
export class GalleriaComponent {
  /** The images. */
  readonly images = input<readonly CwGalleriaImage[]>([]);
  /** Initially active image index. */
  readonly activeIndex = input(0, { transform: numberAttribute });
  /** Show the thumbnail strip. */
  readonly showThumbnails = input(true, { transform: booleanAttribute });
  /** Show the prev/next arrows on the main image. */
  readonly showNavigators = input(true, { transform: booleanAttribute });
  /** Wrap from last to first. */
  readonly circular = input(true, { transform: booleanAttribute });

  /** Emitted when the active image changes. */
  readonly activeIndexChange = output<number>();

  private readonly userIndex = signal<number | undefined>(undefined);
  readonly current = computed(() => {
    const count = this.images().length;
    if (count === 0) {
      return 0;
    }
    return Math.min(this.userIndex() ?? this.activeIndex(), count - 1);
  });

  readonly active = computed(() => this.images()[this.current()] ?? null);
  readonly canPrev = computed(() => this.circular() || this.current() > 0);
  readonly canNext = computed(() => this.circular() || this.current() < this.images().length - 1);

  thumb(image: CwGalleriaImage): string {
    return image.thumbnail ?? image.src;
  }

  go(index: number): void {
    const count = this.images().length;
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

  next(): void {
    this.go(this.current() + 1);
  }
}
