import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CwChartSeries } from './chart.types';

/** Process-wide counter for unique gradient ids. */
let gradSeq = 0;

/** Payload emitted when a data point (x-position) is clicked. */
export interface CwChartPointEvent {
  index: number;
  label: string;
  values: { name: string; color: string; value: number }[];
}

/**
 * A responsive, interactive line / area chart drawn as pure SVG — no external
 * dependencies. Overlays one or more series with gradient fills, gridlines and
 * axis labels; hovering shows a crosshair + tooltip and clicking emits the
 * point. Signal-based, OnPush and `--cw-*`-token themed.
 *
 * @example
 * <cw-area-chart
 *   [series]="[{ name: 'This year', color: '#6c63ff', data: [4, 8, 6, 12] }]"
 *   [labels]="['Q1', 'Q2', 'Q3', 'Q4']"
 *   (pointClick)="onPoint($event)" ariaLabel="Revenue by quarter" />
 */
@Component({
  selector: 'cw-area-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cw-area-chart__plot"
         (mousemove)="onMove($event)" (mouseleave)="hoverIndex.set(null)" (click)="onClick()">
      <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" preserveAspectRatio="none"
           class="cw-area-chart__svg" role="img" [attr.aria-label]="ariaLabel()">
        <defs>
          @for (s of geom(); track s.name) {
            <linearGradient [attr.id]="s.gradId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" [attr.stop-color]="s.color" stop-opacity="0.28" />
              <stop offset="100%" [attr.stop-color]="s.color" stop-opacity="0" />
            </linearGradient>
          }
        </defs>

        @if (showGrid()) {
          @for (g of gridlines(); track g.y) {
            <line [attr.x1]="padL" [attr.x2]="W - padR" [attr.y1]="g.y" [attr.y2]="g.y"
                  stroke="var(--cw-divider)" stroke-width="1" />
            <text [attr.x]="padL - 8" [attr.y]="g.y + 4" text-anchor="end" class="cw-area-chart__axis">{{ g.label }}</text>
          }
        }
        @for (x of xLabels(); track x.i) {
          <text [attr.x]="x.x" [attr.y]="H - 6" text-anchor="middle" class="cw-area-chart__axis">{{ x.label }}</text>
        }

        <!-- hover crosshair -->
        @if (interactive() && hover(); as h) {
          <line [attr.x1]="h.x" [attr.x2]="h.x" [attr.y1]="padT" [attr.y2]="H - padB"
                stroke="var(--cw-border-strong, var(--cw-divider))" stroke-width="1" stroke-dasharray="3 3" />
        }

        @for (s of geom(); track s.name) {
          <path [attr.d]="s.area" [attr.fill]="'url(#' + s.gradId + ')'" />
          <path [attr.d]="s.line" fill="none" [attr.stroke]="s.color" stroke-width="2.5"
                stroke-linejoin="round" stroke-linecap="round" />
          @if (showPoints()) {
            @for (p of s.points; track $index) {
              <circle [attr.cx]="p.x" [attr.cy]="p.y" [attr.r]="hoverIndex() === $index ? 4.5 : 3"
                      fill="var(--cw-surface)" [attr.stroke]="s.color" stroke-width="2" />
            }
          }
        }
      </svg>

      @if (interactive() && hover(); as h) {
        <div class="cw-area-chart__tooltip" [style.left.%]="h.leftPct">
          <div class="cw-area-chart__tt-label">{{ h.label }}</div>
          @for (r of h.values; track r.name) {
            <div class="cw-area-chart__tt-row">
              <i [style.background]="r.color"></i><span>{{ r.name }}</span><strong>{{ r.value }}</strong>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .cw-area-chart__plot { position: relative; width: 100%; }
    .cw-area-chart__svg { width: 100%; height: auto; display: block; }
    .cw-area-chart__axis { fill: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 11px; font-family: var(--cw-font); }
    .cw-area-chart__plot { cursor: crosshair; }

    .cw-area-chart__tooltip {
      position: absolute; top: 6px; transform: translateX(-50%);
      background: var(--cw-surface); border: 1px solid var(--cw-border);
      border-radius: var(--cw-radius, 6px); box-shadow: var(--cw-shadow-md, 0 4px 12px rgba(0,0,0,0.12));
      padding: 0.4rem 0.55rem; font-family: var(--cw-font); font-size: 0.78rem;
      pointer-events: none; white-space: nowrap; z-index: 2;
    }
    .cw-area-chart__tt-label { font-weight: 700; color: var(--cw-text); margin-bottom: 0.2rem; }
    .cw-area-chart__tt-row { display: flex; align-items: center; gap: 0.4rem; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .cw-area-chart__tt-row i { width: 8px; height: 8px; border-radius: 2px; display: inline-block; }
    .cw-area-chart__tt-row strong { margin-left: auto; color: var(--cw-text); }
  `],
  host: { 'class': 'cw-area-chart' }
})
export class AreaChartComponent {
  /** One or more data series to overlay. */
  readonly series = input<readonly CwChartSeries[]>([]);
  /** X-axis labels, aligned to each data point. */
  readonly labels = input<readonly string[]>([]);
  /** Accessible name describing the chart. */
  readonly ariaLabel = input<string>('Area chart');
  /** Show horizontal gridlines + y-axis labels. */
  readonly showGrid = input(true);
  /** Draw a marker at each data point. */
  readonly showPoints = input(true);
  /** Enable the hover crosshair/tooltip and point clicks. */
  readonly interactive = input(true);

  /** Emitted when a data point (x-position) is clicked. */
  readonly pointClick = output<CwChartPointEvent>();

  readonly W = 640; readonly H = 260;
  readonly padL = 40; readonly padR = 16; readonly padT = 16; readonly padB = 26;

  protected readonly hoverIndex = signal<number | null>(null);

  private readonly bounds = computed(() => {
    const all = this.series().flatMap(s => s.data);
    const max = Math.max(1, ...all);
    return { min: 0, max: Math.ceil(max / 10) * 10 || 10 };
  });

  readonly gridlines = computed(() => {
    const { max } = this.bounds();
    const innerH = this.H - this.padT - this.padB;
    return [0, 1, 2, 3, 4].map(i => {
      const value = (max / 4) * (4 - i);
      return { y: this.padT + (innerH / 4) * i, label: value >= 1000 ? (value / 1000) + 'k' : String(value) };
    });
  });

  readonly xLabels = computed(() => {
    const labels = this.labels();
    const n = labels.length;
    const innerW = this.W - this.padL - this.padR;
    return labels.map((label, i) => ({ i, label, x: this.padL + (n > 1 ? (innerW / (n - 1)) * i : 0) }));
  });

  readonly geom = computed(() => {
    const { min, max } = this.bounds();
    const innerW = this.W - this.padL - this.padR;
    const innerH = this.H - this.padT - this.padB;
    return this.series().map(s => {
      const n = s.data.length;
      const points = s.data.map((v, i) => ({
        x: this.padL + (n > 1 ? (innerW / (n - 1)) * i : 0),
        y: this.padT + innerH - ((v - min) / (max - min || 1)) * innerH
      }));
      const line = points.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ');
      const base = this.padT + innerH;
      const area = points.length
        ? `M ${points[0].x} ${base} ` + points.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ` L ${points[n - 1].x} ${base} Z`
        : '';
      return { name: s.name, color: s.color, line, area, points, gradId: 'cw-area-grad-' + (++gradSeq) };
    });
  });

  /** Resolved hover state (crosshair position + tooltip rows). */
  readonly hover = computed(() => {
    const i = this.hoverIndex();
    const g = this.geom();
    if (i === null || !g.length || !g[0].points[i]) { return null; }
    return {
      i,
      x: g[0].points[i].x,
      leftPct: Math.min(90, Math.max(10, (g[0].points[i].x / this.W) * 100)),
      label: this.labels()[i] ?? '',
      values: this.series().map(s => ({ name: s.name, color: s.color, value: s.data[i] }))
    };
  });

  onMove(e: MouseEvent): void {
    if (!this.interactive()) { return; }
    const pts = this.geom()[0]?.points;
    if (!pts?.length) { return; }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (!rect.width) { return; }
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const vbX = ratio * this.W;
    let best = 0, bd = Infinity;
    pts.forEach((p, i) => { const d = Math.abs(p.x - vbX); if (d < bd) { bd = d; best = i; } });
    this.hoverIndex.set(best);
  }

  onClick(): void {
    const h = this.hover();
    if (h) { this.pointClick.emit({ index: h.i, label: h.label, values: h.values }); }
  }
}
