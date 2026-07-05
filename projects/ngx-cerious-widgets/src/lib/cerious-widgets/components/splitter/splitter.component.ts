import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  TemplateRef
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/** Marks a splitter panel: `<ng-template cwSplitterPanel>…</ng-template>`. */
@Directive({ selector: '[cwSplitterPanel]', standalone: true })
export class SplitterPanelDirective {
  readonly template = inject(TemplateRef<unknown>);
}

/** Splitter orientation. */
export type CwSplitterLayout = 'horizontal' | 'vertical';

/**
 * Splits its projected panels with draggable gutters, so the user can resize
 * them. Panels are `<ng-template cwSplitterPanel>` children.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-splitter [initialSizes]="[30, 70]">
 *   <ng-template cwSplitterPanel>Sidebar</ng-template>
 *   <ng-template cwSplitterPanel>Content</ng-template>
 * </cw-splitter>
 */
@Component({
  selector: 'cw-splitter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './splitter.component.html',
  styleUrl: './splitter.component.scss',
  host: {
    'class': 'cw-splitter',
    '[attr.data-layout]': 'layout()'
  }
})
export class SplitterComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly panels = contentChildren(SplitterPanelDirective);

  /** Orientation. */
  readonly layout = input<CwSplitterLayout>('horizontal');
  /** Initial panel sizes as percentages (must sum to ~100). */
  readonly initialSizes = input<readonly number[]>([]);
  /** Minimum panel size in percent. */
  readonly minSize = input(10, { transform: numberAttribute });

  /** Emitted with the new size array when a drag ends. */
  readonly resizeEnd = output<number[]>();

  private readonly userSizes = signal<number[] | null>(null);

  /** Effective sizes: user-dragged, else initial, else equal split. */
  readonly sizes = computed<number[]>(() => {
    const count = this.panels().length;
    if (count === 0) {
      return [];
    }
    const user = this.userSizes();
    if (user && user.length === count) {
      return user;
    }
    const initial = this.initialSizes();
    if (initial.length === count) {
      return [...initial];
    }
    return Array.from({ length: count }, () => 100 / count);
  });

  private drag: { index: number; startPos: number; total: number; a: number; b: number } | null = null;

  onGutterDown(index: number, event: PointerEvent): void {
    event.preventDefault();
    // setPointerCapture throws for a pointerId with no active pointer (e.g.
    // synthetic events in tests) — it's a nicety, so ignore failures.
    try {
      (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    } catch {
      /* no-op */
    }
    const rect = this.host.nativeElement.getBoundingClientRect();
    const total = this.layout() === 'horizontal' ? rect.width : rect.height;
    const sizes = this.sizes();
    this.drag = {
      index,
      startPos: this.layout() === 'horizontal' ? event.clientX : event.clientY,
      total,
      a: sizes[index],
      b: sizes[index + 1]
    };
    const move = (e: PointerEvent) => this.onDragMove(e);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      this.drag = null;
      this.resizeEnd.emit(this.sizes());
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  private onDragMove(event: PointerEvent): void {
    if (!this.drag) {
      return;
    }
    const pos = this.layout() === 'horizontal' ? event.clientX : event.clientY;
    const deltaPct = ((pos - this.drag.startPos) / this.drag.total) * 100;
    const min = this.minSize();
    let a = this.drag.a + deltaPct;
    let b = this.drag.b - deltaPct;
    // Clamp so neither panel drops below the minimum.
    if (a < min) {
      b -= min - a;
      a = min;
    }
    if (b < min) {
      a -= min - b;
      b = min;
    }
    const next = [...this.sizes()];
    next[this.drag.index] = a;
    next[this.drag.index + 1] = b;
    this.userSizes.set(next);
  }

  size(index: number): string {
    return `${this.sizes()[index]}%`;
  }
}
