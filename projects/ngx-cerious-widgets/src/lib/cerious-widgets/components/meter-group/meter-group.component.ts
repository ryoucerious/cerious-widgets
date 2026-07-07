import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';

/** One coloured segment of the meter. */
export interface CwMeterItem {
  label: string;
  value: number;
  /** CSS colour for the segment (defaults cycle through the accent scale). */
  color?: string;
}

/**
 * A horizontal multi-segment meter with a legend — for storage breakdowns,
 * budget splits and other part-of-whole displays.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-meter-group [max]="100" [items]="[
 *   { label: 'Apps', value: 40, color: '#3b82f6' },
 *   { label: 'Media', value: 25, color: '#22c55e' }
 * ]" />
 */
@Component({
  selector: 'cw-meter-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './meter-group.component.html',
  styleUrl: './meter-group.component.scss',
  host: { 'class': 'cw-meter-group' }
})
export class MeterGroupComponent {
  private static readonly PALETTE = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

  /** The segments. */
  readonly items = input<readonly CwMeterItem[]>([]);
  /** Total the segments are measured against. Defaults to the sum of values. */
  readonly max = input<number | null>(null);
  /** Track thickness in px. */
  readonly size = input(16, { transform: numberAttribute });
  /** Show the legend below the bar. */
  readonly showLegend = input(true);
  /** Accessible name for the whole meter. Defaults to a summary of the segments. */
  readonly ariaLabel = input<string>('');

  /**
   * The bar as a whole is a single image to assistive tech (a multi-segment
   * part-of-whole display isn't a single scalar `meter`), described by this
   * composite label; the visible legend carries the per-segment detail.
   */
  readonly a11yLabel = computed(() =>
    this.ariaLabel() || this.segments().map(s => `${s.label}: ${s.value}`).join(', '));

  readonly total = computed(() => {
    const explicit = this.max();
    if (explicit != null && explicit > 0) {
      return explicit;
    }
    return this.items().reduce((sum, i) => sum + Math.max(0, i.value), 0) || 1;
  });

  /** Segments with resolved colour and percentage width. */
  readonly segments = computed(() =>
    this.items().map((item, i) => ({
      label: item.label,
      value: item.value,
      color: item.color ?? MeterGroupComponent.PALETTE[i % MeterGroupComponent.PALETTE.length],
      percent: (Math.max(0, item.value) / this.total()) * 100
    }))
  );
}
