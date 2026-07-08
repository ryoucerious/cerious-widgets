import { ChangeDetectionStrategy, Component, computed, input, numberAttribute, output, signal } from '@angular/core';
import { CwDonutSegment } from './chart.types';

/**
 * An interactive donut / pie chart drawn with SVG stroke-dasharray arcs — no
 * external dependencies. Hovering a slice emphasises it and shows its value in
 * the centre; clicking emits the segment. Set `thickness` equal to the radius
 * (46) for a full pie. Signal-based, OnPush and `--cw-*`-token themed.
 *
 * @example
 * <cw-donut-chart
 *   [segments]="[{ label: 'A', value: 60, color: '#6c63ff' }, { label: 'B', value: 40, color: '#22c55e' }]"
 *   centerValue="100" centerLabel="Total" (segmentClick)="onSlice($event)" />
 */
@Component({
  selector: 'cw-donut-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 120 120" class="cw-donut-chart__svg" role="img" [attr.aria-label]="ariaLabel()">
      <circle cx="60" cy="60" [attr.r]="strokeR()" fill="none"
              stroke="var(--cw-surface-sunken, var(--cw-border))" [attr.stroke-width]="t()" />
      @for (a of arcs(); track a.label) {
        <circle cx="60" cy="60" [attr.r]="strokeR()" fill="none" [attr.stroke]="a.color" [attr.stroke-width]="a.hovered ? t() + 4 : t()"
                [attr.stroke-dasharray]="a.dash + ' ' + (circ() - a.dash)" [attr.stroke-dashoffset]="a.offset"
                [attr.opacity]="a.dimmed ? 0.4 : 1" stroke-linecap="butt" transform="rotate(-90 60 60)"
                [class.cw-donut-chart__arc--interactive]="interactive()"
                (mouseenter)="hoverLabel.set(a.label)" (mouseleave)="hoverLabel.set(null)" (click)="onClick(a.label)">
          <title>{{ a.label }}: {{ a.value }}</title>
        </circle>
      }
      @if (center(); as c) { <text x="60" y="56" text-anchor="middle" class="cw-donut-chart__value">{{ c.value }}</text> }
      @if (center(); as c) { <text x="60" y="72" text-anchor="middle" class="cw-donut-chart__label">{{ c.label }}</text> }
    </svg>
  `,
  styles: [`
    :host { display: block; }
    .cw-donut-chart__svg { width: 100%; height: auto; display: block; }
    .cw-donut-chart__value { fill: var(--cw-text); font-size: 18px; font-weight: 700; font-family: var(--cw-font); }
    .cw-donut-chart__label { fill: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 8px; font-family: var(--cw-font); text-transform: uppercase; letter-spacing: 0.05em; }
    .cw-donut-chart__arc--interactive { cursor: pointer; transition: stroke-width 0.12s ease, opacity 0.12s ease; }
  `],
  host: { 'class': 'cw-donut-chart' }
})
export class DonutChartComponent {
  /** The slices. */
  readonly segments = input<readonly CwDonutSegment[]>([]);
  /** Large text shown in the centre (e.g. a total). Overridden while hovering a slice. */
  readonly centerValue = input<string>('');
  /** Small caption under the centre value. */
  readonly centerLabel = input<string>('');
  /** Ring thickness in SVG units (radius is 46; set 46 for a full pie). */
  readonly thickness = input(14, { transform: numberAttribute });
  /** Accessible name describing the chart. */
  readonly ariaLabel = input<string>('Donut chart');
  /** Enable hover emphasis + slice clicks. */
  readonly interactive = input(true);

  /** Emitted when a slice is clicked. */
  readonly segmentClick = output<CwDonutSegment>();

  /** Fixed outer radius — the ring's outer edge, kept inside the 120px viewBox. */
  readonly outerR = 52;
  /** Clamped ring width (never exceeds the radius, so a full pie fills to centre). */
  protected readonly t = computed(() => Math.max(2, Math.min(this.thickness(), this.outerR)));
  /** Stroke path radius derived from the thickness so the outer edge stays fixed. */
  readonly strokeR = computed(() => this.outerR - this.t() / 2);
  readonly circ = computed(() => 2 * Math.PI * this.strokeR());

  protected readonly hoverLabel = signal<string | null>(null);

  readonly arcs = computed(() => {
    const total = this.segments().reduce((s, x) => s + x.value, 0) || 1;
    const hover = this.interactive() ? this.hoverLabel() : null;
    const circ = this.circ();
    let acc = 0;
    return this.segments().map(seg => {
      const dash = (seg.value / total) * circ;
      const offset = -(acc / total) * circ;
      acc += seg.value;
      return {
        label: seg.label, value: seg.value, color: seg.color, dash, offset,
        hovered: hover === seg.label,
        dimmed: hover !== null && hover !== seg.label
      };
    });
  });

  /** Centre text — the hovered slice's value/label, else the configured centre. */
  readonly center = computed(() => {
    const hover = this.interactive() ? this.hoverLabel() : null;
    if (hover) {
      const seg = this.segments().find(s => s.label === hover);
      if (seg) { return { value: String(seg.value), label: seg.label }; }
    }
    return this.centerValue() ? { value: this.centerValue(), label: this.centerLabel() } : null;
  });

  onClick(label: string): void {
    if (!this.interactive()) { return; }
    const seg = this.segments().find(s => s.label === label);
    if (seg) { this.segmentClick.emit(seg); }
  }
}
