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

/** One step in the sequence. */
export interface CwStepItem {
  label: string;
  /** Prevent selecting this step (only relevant when the steps are clickable). */
  disabled?: boolean;
}

/**
 * A numbered progress sequence: completed steps show a check, the current
 * step is highlighted, upcoming steps are muted. Set `clickable` to let users
 * jump between steps.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-steps [items]="[{ label: 'Cart' }, { label: 'Payment' }, { label: 'Done' }]" [activeIndex]="1" />
 */
@Component({
  selector: 'cw-steps',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.scss',
  host: { 'class': 'cw-steps' }
})
export class StepsComponent {
  /** The steps, in order. */
  readonly items = input<readonly CwStepItem[]>([]);
  /** Zero-based index of the current step. */
  readonly activeIndex = input(0, { transform: numberAttribute });
  /** Allow clicking a step to activate it. */
  readonly clickable = input(false, { transform: booleanAttribute });

  /** Emitted when the user activates a step (requires `clickable`). */
  readonly activeIndexChange = output<number>();

  private readonly userIndex = signal<number | undefined>(undefined);
  readonly currentIndex = computed(() => this.userIndex() ?? this.activeIndex());

  select(index: number): void {
    if (!this.clickable() || this.items()[index]?.disabled || index === this.currentIndex()) {
      return;
    }
    this.userIndex.set(index);
    this.activeIndexChange.emit(index);
  }
}
