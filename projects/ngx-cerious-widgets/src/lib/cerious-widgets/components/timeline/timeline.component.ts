import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CwSeverity } from '../severity';

/** One event on the timeline. */
export interface CwTimelineEvent {
  /** Main content line. */
  content: string;
  /** Optional opposite-side label (e.g. a timestamp). */
  opposite?: string;
  /** Marker colour. */
  severity?: CwSeverity;
  /** Optional marker icon class. */
  icon?: string;
}

/**
 * A vertical sequence of events connected by a line, each with a coloured
 * marker. Good for activity logs, order tracking and changelogs.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-timeline [events]="[
 *   { opposite: '09:00', content: 'Order placed', severity: 'info' },
 *   { opposite: '11:30', content: 'Shipped', severity: 'success' }
 * ]" />
 */
@Component({
  selector: 'cw-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  host: { 'class': 'cw-timeline' }
})
export class TimelineComponent {
  /** The events, in order. */
  readonly events = input<readonly CwTimelineEvent[]>([]);
  /** Show the opposite-side labels column. */
  readonly showOpposite = input(true);
}
