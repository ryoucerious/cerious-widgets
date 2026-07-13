import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/**
 * A tiny inline trend line (sparkline) for KPI cards and table cells. Pure SVG,
 * no dependencies; the line colour defaults to the accent token.
 *
 * @example
 * <cw-sparkline [data]="[3, 5, 4, 8, 7, 10]" color="var(--cw-primary)" />
 */
@Component({
  selector: 'cw-sparkline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" class="cw-sparkline__svg" role="img" [attr.aria-label]="ariaLabel()">
      <path [attr.d]="area()" [attr.fill]="color()" fill-opacity="0.15" />
      <path [attr.d]="line()" fill="none" [attr.stroke]="color()" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
    </svg>
  `,
  styles: [`
    :host { display: block; }
    .cw-sparkline__svg { width: 100%; height: 32px; display: block; }
  `],
  host: { 'class': 'cw-sparkline' }
})
export class SparklineComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ sparkline: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('sparkline', this.api);
  }

  /** The values to plot. */
  readonly data = input<readonly number[]>([]);
  /** Line + fill colour (any CSS colour). */
  readonly color = input<string>('var(--cw-primary)');
  /** Accessible name (empty renders a decorative chart). */
  readonly ariaLabel = input<string>('Sparkline');

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
