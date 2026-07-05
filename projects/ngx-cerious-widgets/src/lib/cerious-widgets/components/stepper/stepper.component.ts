import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  inject,
  input,
  output,
  signal,
  TemplateRef
} from '@angular/core';

/**
 * One step of a {@link StepperComponent}. Its projected content is shown when
 * the step is active: `<ng-template cwStep label="Cart">…</ng-template>`.
 */
@Directive({ selector: '[cwStep]', standalone: true })
export class StepDirective {
  readonly template = inject(TemplateRef<unknown>);
  /** The step label shown in the header. */
  readonly label = input<string>('');
  /** Prevent activating this step. */
  readonly disabled = input(false, { transform: booleanAttribute });
}

/**
 * A wizard: a numbered header over the active step's projected content, with
 * Back / Next navigation. Set `linear` to require steps be completed in order.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-stepper>
 *   <ng-template cwStep label="Cart">…</ng-template>
 *   <ng-template cwStep label="Payment">…</ng-template>
 * </cw-stepper>
 */
@Component({
  selector: 'cw-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  host: { 'class': 'cw-stepper' }
})
export class StepperComponent {
  readonly steps = contentChildren(StepDirective);

  /** Initially active step index. */
  readonly activeIndex = input(0);
  /** Require steps be reached in order (can't click ahead). */
  readonly linear = input(false, { transform: booleanAttribute });
  /** Hide the built-in Back / Next buttons (drive it yourself via the API). */
  readonly showControls = input(true, { transform: booleanAttribute });

  /** Emitted when the active step changes. */
  readonly activeIndexChange = output<number>();

  private readonly userIndex = signal<number | undefined>(undefined);
  readonly current = computed(() => {
    const count = this.steps().length;
    if (count === 0) {
      return 0;
    }
    return Math.min(this.userIndex() ?? this.activeIndex(), count - 1);
  });

  readonly activeTemplate = computed(() => this.steps()[this.current()]?.template ?? null);
  readonly isFirst = computed(() => this.current() === 0);
  readonly isLast = computed(() => this.current() === this.steps().length - 1);

  isDone(index: number): boolean {
    return index < this.current();
  }

  /** Whether the header step at `index` can be clicked. */
  canActivate(index: number): boolean {
    if (this.steps()[index]?.disabled()) {
      return false;
    }
    // In linear mode the header only allows going back (or staying); forward
    // progress goes through the Next button.
    return this.linear() ? index <= this.current() : true;
  }

  /** Activate a step from a header click (respects the linear restriction). */
  go(index: number): void {
    if (this.canActivate(index)) {
      this.goTo(index);
    }
  }

  next(): void {
    this.goTo(this.current() + 1);
  }

  back(): void {
    this.goTo(this.current() - 1);
  }

  /** Move to a step, checked only against bounds and the target's disabled flag. */
  private goTo(index: number): void {
    if (index < 0 || index >= this.steps().length || index === this.current() || this.steps()[index]?.disabled()) {
      return;
    }
    this.userIndex.set(index);
    this.activeIndexChange.emit(index);
  }
}
