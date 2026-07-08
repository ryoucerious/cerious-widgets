import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

let gradSeq = 0;

export interface ChartSeries { name: string; color: string; data: number[]; }
export interface DonutSegment { label: string; value: number; color: string; }

/**
 * A responsive area/line chart drawn as pure SVG (no dependencies), themed with
 * `--cw-*` tokens. Supports one or more overlaid series with a gradient fill.
 */
@Component({
  selector: 'app-area-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" preserveAspectRatio="none" class="chart" role="img" [attr.aria-label]="ariaLabel()">
      <defs>
        @for (s of geom(); track s.name) {
          <linearGradient [attr.id]="s.gradId" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" [attr.stop-color]="s.color" stop-opacity="0.28" />
            <stop offset="100%" [attr.stop-color]="s.color" stop-opacity="0" />
          </linearGradient>
        }
      </defs>

      <!-- horizontal gridlines + y labels -->
      @for (g of gridlines(); track g.y) {
        <line [attr.x1]="padL" [attr.x2]="W - padR" [attr.y1]="g.y" [attr.y2]="g.y" stroke="var(--cw-divider)" stroke-width="1" />
        <text [attr.x]="padL - 8" [attr.y]="g.y + 4" text-anchor="end" class="chart__axis">{{ g.label }}</text>
      }
      <!-- x labels -->
      @for (x of xLabels(); track x.i) {
        <text [attr.x]="x.x" [attr.y]="H - 6" text-anchor="middle" class="chart__axis">{{ x.label }}</text>
      }

      @for (s of geom(); track s.name) {
        <path [attr.d]="s.area" [attr.fill]="'url(#' + s.gradId + ')'" />
        <path [attr.d]="s.line" fill="none" [attr.stroke]="s.color" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
        @for (p of s.points; track $index) {
          <circle [attr.cx]="p.x" [attr.cy]="p.y" r="3" [attr.fill]="'var(--cw-surface)'" [attr.stroke]="s.color" stroke-width="2" />
        }
      }
    </svg>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .chart { width: 100%; height: auto; display: block; }
    .chart__axis { fill: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 11px; font-family: var(--cw-font); }
  `]
})
export class AreaChartComponent {
  readonly series = input<ChartSeries[]>([]);
  readonly labels = input<string[]>([]);
  readonly ariaLabel = input<string>('Chart');

  readonly W = 640; readonly H = 260;
  readonly padL = 40; readonly padR = 16; readonly padT = 16; readonly padB = 26;

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
      const area = `M ${points[0].x} ${base} ` + points.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ` L ${points[n - 1].x} ${base} Z`;
      return { name: s.name, color: s.color, line, area, points, gradId: 'cw-grad-' + (++gradSeq) };
    });
  });
}

/**
 * A donut chart with a centred total, drawn with stroke-dasharray arcs.
 */
@Component({
  selector: 'app-donut-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 120 120" class="donut" role="img" [attr.aria-label]="ariaLabel()">
      <circle cx="60" cy="60" [attr.r]="r" fill="none" stroke="var(--cw-surface-sunken, var(--cw-border))" [attr.stroke-width]="thickness" />
      @for (a of arcs(); track a.label) {
        <circle cx="60" cy="60" [attr.r]="r" fill="none" [attr.stroke]="a.color" [attr.stroke-width]="thickness"
                [attr.stroke-dasharray]="a.dash + ' ' + (circ - a.dash)" [attr.stroke-dashoffset]="a.offset"
                stroke-linecap="round" transform="rotate(-90 60 60)" />
      }
      <text x="60" y="55" text-anchor="middle" class="donut__value">{{ centerValue() }}</text>
      <text x="60" y="72" text-anchor="middle" class="donut__label">{{ centerLabel() }}</text>
    </svg>
  `,
  styles: [`
    :host { display: block; }
    .donut { width: 100%; height: auto; }
    .donut__value { fill: var(--cw-text); font-size: 18px; font-weight: 700; font-family: var(--cw-font); }
    .donut__label { fill: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 8px; font-family: var(--cw-font); text-transform: uppercase; letter-spacing: 0.05em; }
  `]
})
export class DonutChartComponent {
  readonly segments = input<DonutSegment[]>([]);
  readonly centerValue = input<string>('');
  readonly centerLabel = input<string>('');
  readonly ariaLabel = input<string>('Donut chart');

  readonly r = 46;
  readonly thickness = 14;
  readonly circ = 2 * Math.PI * 46;

  readonly arcs = computed(() => {
    const total = this.segments().reduce((s, x) => s + x.value, 0) || 1;
    let acc = 0;
    return this.segments().map(seg => {
      const dash = (seg.value / total) * this.circ;
      const offset = -(acc / total) * this.circ;
      acc += seg.value;
      return { label: seg.label, color: seg.color, dash, offset };
    });
  });
}

/** A tiny inline sparkline for KPI cards. */
@Component({
  selector: 'app-sparkline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" class="spark" aria-hidden="true">
      <path [attr.d]="area()" [attr.fill]="color()" fill-opacity="0.15" />
      <path [attr.d]="line()" fill="none" [attr.stroke]="color()" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
    </svg>
  `,
  styles: [`:host { display: block; } .spark { width: 100%; height: 32px; display: block; }`]
})
export class SparklineComponent {
  readonly data = input<number[]>([]);
  readonly color = input<string>('var(--cw-primary)');

  private readonly pts = computed(() => {
    const d = this.data();
    const min = Math.min(...d), max = Math.max(...d);
    const n = d.length;
    return d.map((v, i) => ({ x: n > 1 ? (100 / (n - 1)) * i : 0, y: 30 - ((v - min) / (max - min || 1)) * 28 }));
  });
  readonly line = computed(() => this.pts().map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' '));
  readonly area = computed(() => {
    const p = this.pts();
    if (!p.length) { return ''; }
    return `M ${p[0].x} 32 ` + p.map(q => `L ${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(' ') + ` L ${p[p.length - 1].x} 32 Z`;
  });
}
