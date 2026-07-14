import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AreaChartComponent, CwChartPointEvent, CwChartSeries, CwDonutSegment, DonutChartComponent, SparklineComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-chart-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AreaChartComponent, DonutChartComponent, SparklineComponent, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="chart">
      <doc-tab label="Features">
        <doc-section title="Area & line" description="Interactive: hover for a crosshair + tooltip, click a point to select it. Pure SVG, no external chart library." [code]="areaCode">
          <div style="width: 100%;">
            <div style="max-width: 34rem;">
              <cw-area-chart [series]="series" [labels]="labels" (pointClick)="onPoint($event)" ariaLabel="Revenue by month" />
            </div>
            <p class="hint">{{ readout() || 'Hover the chart, then click a point…' }}</p>
          </div>
        </doc-section>

        <doc-section title="Donut" description="Hover a slice to emphasise it and show its value in the centre; click to select. Set thickness to 52 (the radius) for a full pie." [code]="donutCode">
          <div style="width: 100%;">
            <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
              <div style="width: 160px;"><cw-donut-chart [segments]="segments" centerValue="100" centerLabel="Total" (segmentClick)="onSlice($event)" /></div>
              <div style="width: 160px;"><cw-donut-chart [segments]="segments" [thickness]="52" ariaLabel="Pie" (segmentClick)="onSlice($event)" /></div>
            </div>
            <p class="hint">{{ sliceReadout() || 'Click a slice…' }}</p>
          </div>
        </doc-section>

        <doc-section title="Sparkline" description="A tiny inline trend for KPI cards and table cells." [code]="sparkCode">
          <div style="display: flex; gap: 2rem; align-items: center;">
            <div style="width: 120px;"><cw-sparkline [data]="[3,5,4,8,7,10,9,13]" /></div>
            <div style="width: 120px;"><cw-sparkline [data]="[10,8,9,6,7,5,6,4]" color="#ec4899" /></div>
          </div>
        </doc-section>
      </doc-tab>

      <doc-tab label="API">
        <doc-api [props]="areaProps" />
        <div style="margin-top: 1.5rem;"><doc-api [props]="donutProps" /></div>
        <div style="margin-top: 1.5rem;"><doc-api [props]="sparkProps" /></div>
      </doc-tab>

      <doc-tab label="Theming"><doc-theming [tokens]="tokens" /></doc-tab>
    </doc-page>
  `
})
export class ChartDocComponent {
  readonly readout = signal('');
  readonly sliceReadout = signal('');
  onPoint(e: CwChartPointEvent): void {
    this.readout.set(`${e.label}: ` + e.values.map(v => `${v.name} ${v.value}`).join(' · '));
  }
  onSlice(s: CwDonutSegment): void {
    this.sliceReadout.set(`${s.label}, ${s.value}`);
  }

  readonly labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  readonly series: CwChartSeries[] = [
    { name: 'This year', color: '#6c63ff', data: [42, 48, 45, 60, 58, 72] },
    { name: 'Last year', color: '#94a3b8', data: [35, 38, 40, 44, 46, 52] }
  ];
  readonly segments: CwDonutSegment[] = [
    { label: 'Electronics', value: 38, color: '#6c63ff' },
    { label: 'Apparel', value: 24, color: '#22c55e' },
    { label: 'Home', value: 18, color: '#f59e0b' },
    { label: 'Other', value: 20, color: '#ec4899' }
  ];

  areaCode = `<cw-area-chart [series]="[{ name: 'Revenue', color: '#6c63ff', data: [42, 48, 45, 60] }]"
               [labels]="['Q1','Q2','Q3','Q4']" ariaLabel="Revenue" />`;
  donutCode = `<cw-donut-chart [segments]="segments" centerValue="100" centerLabel="Total" />`;
  sparkCode = `<cw-sparkline [data]="[3, 5, 4, 8, 7, 10]" color="var(--cw-primary)" />`;

  areaProps = [
    { name: 'series', type: 'CwChartSeries[]', default: '[]', description: 'One or more overlaid series ({ name, color, data }).' },
    { name: 'labels', type: 'string[]', default: '[]', description: 'X-axis labels aligned to each data point.' },
    { name: 'showGrid', type: 'boolean', default: 'true', description: 'Show gridlines + y-axis labels.' },
    { name: 'showPoints', type: 'boolean', default: 'true', description: 'Draw a marker at each data point.' },
    { name: 'ariaLabel', type: 'string', default: `'Area chart'`, description: 'Accessible name for the chart.' }
  ];
  donutProps = [
    { name: 'segments', type: 'CwDonutSegment[]', default: '[]', description: 'Slices ({ label, value, color }).' },
    { name: 'centerValue', type: 'string', default: `''`, description: 'Large centred text (e.g. a total).' },
    { name: 'centerLabel', type: 'string', default: `''`, description: 'Small caption under the centre value.' },
    { name: 'thickness', type: 'number', default: '14', description: 'Ring thickness (set 46 for a full pie).' },
    { name: 'ariaLabel', type: 'string', default: `'Donut chart'`, description: 'Accessible name for the chart.' }
  ];
  sparkProps = [
    { name: 'data', type: 'number[]', default: '[]', description: 'The values to plot.' },
    { name: 'color', type: 'string', default: `'var(--cw-primary)'`, description: 'Line + fill colour.' }
  ];
  tokens = [
    { token: '--cw-divider', description: 'Gridlines.' },
    { token: '--cw-text-muted', description: 'Axis labels.' },
    { token: '--cw-surface', description: 'Data-point marker fill.' },
    { token: '--cw-surface-sunken', description: 'Donut track (unfilled ring).' },
    { token: '--cw-primary', description: 'Default sparkline colour.' },
    { token: '--cw-font', description: 'Font family.' }
  ];
}
