import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AreaChartComponent, AvatarComponent, BreadcrumbComponent, ButtonComponent, CardComponent, CwChartPointEvent,
  CwChartSeries, CwDonutSegment, CwTableColumn, CwTimelineEvent, CwToastService, DonutChartComponent,
  ProgressBarComponent, SelectButtonComponent, SparklineComponent, TableColumnDirective, TableComponent,
  TagComponent, TimelineComponent
} from 'ngx-cerious-widgets';
import { Order, orderSeverity, seedOrders } from './demo-data';
import { IconComponent } from '../ui/icon.component';

interface Kpi { label: string; value: string; delta: string; up: boolean; icon: string; tint: string; spark: number[]; }
interface Seller { name: string; sold: number; percent: number; color: string; }

@Component({
  selector: 'app-demo-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, CurrencyPipe, CardComponent, TableComponent, TableColumnDirective, TagComponent,
    AvatarComponent, ButtonComponent, BreadcrumbComponent, TimelineComponent, ProgressBarComponent,
    SelectButtonComponent, AreaChartComponent, DonutChartComponent, SparklineComponent, IconComponent
  ],
  template: `
    <cw-breadcrumb [items]="crumbs" />

    <header class="page-head">
      <div>
        <h1 class="page-head__title">Dashboard</h1>
        <p class="page-head__sub">Welcome back, Jane. Here's what's happening today.</p>
      </div>
      <div class="page-head__tools">
        <cw-select-button [options]="ranges" [ngModel]="range()" (ngModelChange)="range.set($event)" />
        <button cwButton (click)="exportReport()">Export</button>
      </div>
    </header>

    <!-- KPI row -->
    <div class="kpis">
      @for (k of kpis; track k.label) {
        <div class="kpi">
          <div class="kpi__top">
            <span class="kpi__icon" [style.background]="k.tint + '22'" [style.color]="k.tint"><app-icon [name]="k.icon" /></span>
            <span class="kpi__delta" [class.kpi__delta--down]="!k.up">{{ k.up ? '▲' : '▼' }} {{ k.delta }}</span>
          </div>
          <div class="kpi__value">{{ k.value }}</div>
          <div class="kpi__label">{{ k.label }}</div>
          <cw-sparkline [data]="k.spark" [color]="k.tint" />
        </div>
      }
    </div>

    <!-- Two flowing columns keep the split aligned down the whole page. -->
    <div class="dash">
      <div class="dash__col">
        <cw-card title="Revenue overview" subtitle="This year vs. last year">
          <cw-area-chart [series]="revenueSeries()" [labels]="revenueLabels()" (pointClick)="onPoint($event)" ariaLabel="Revenue overview" />
          <div class="legend">
            @for (s of revenueSeries(); track s.name) {
              <span class="legend__item"><i [style.background]="s.color"></i> {{ s.name }}</span>
            }
          </div>
        </cw-card>

        <cw-card title="Recent orders" subtitle="Latest transactions">
          <cw-table [columns]="orderColumns" [value]="orders" hoverable>
            <ng-template cwColumn="customer" let-row>
              <div class="cust"><cw-avatar [label]="initials(row.customer)" size="small" /> <span>{{ row.customer }}</span></div>
            </ng-template>
            <ng-template cwColumn="total" let-value="value">{{ value | currency }}</ng-template>
            <ng-template cwColumn="status" let-value="value"><cw-tag [value]="value" [severity]="statusSeverity(value)" /></ng-template>
          </cw-table>
        </cw-card>
      </div>

      <div class="dash__col">
        <cw-card title="Sales by category" subtitle="Share of revenue">
          <div class="donut-wrap">
            <cw-donut-chart [segments]="category" centerValue="$84.1k" centerLabel="Total" (segmentClick)="onSlice($event)" ariaLabel="Sales by category" />
            <ul class="cat-legend">
              @for (c of category; track c.label) {
                <li><i [style.background]="c.color"></i><span>{{ c.label }}</span><strong>{{ c.value }}%</strong></li>
              }
            </ul>
          </div>
        </cw-card>

        <cw-card title="Best sellers" subtitle="Top products this month">
          <ul class="sellers">
            @for (s of sellers; track s.name) {
              <li class="seller">
                <div class="seller__head"><span>{{ s.name }}</span><strong>{{ s.sold }} sold</strong></div>
                <cw-progress-bar [value]="s.percent" [attr.aria-label]="s.name" />
              </li>
            }
          </ul>
        </cw-card>

        <cw-card title="Monthly goals" subtitle="Progress toward targets">
          <div class="goals">
            @for (g of goals; track g.label) {
              <div class="goal"><div class="goal__row"><span>{{ g.label }}</span><strong>{{ g.value }}%</strong></div>
                <cw-progress-bar [value]="g.value" [attr.aria-label]="g.label" /></div>
            }
          </div>
        </cw-card>

        <cw-card title="Recent activity" subtitle="What's happening in your store">
          <cw-timeline [events]="activity" />
        </cw-card>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin: 0.25rem 0 1.5rem; }
    .page-head__title { margin: 0; font-size: 1.6rem; font-weight: 700; color: var(--cw-text); }
    .page-head__sub { margin: 0.25rem 0 0; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .page-head__tools { display: flex; align-items: center; gap: 0.6rem; }

    .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1rem; }
    .kpi { background: var(--cw-surface); border: 1px solid var(--cw-border); border-radius: var(--cw-radius-md, var(--cw-radius)); padding: 1.1rem 1.2rem 0.6rem; box-shadow: var(--cw-shadow-sm, 0 1px 2px rgba(0,0,0,0.04)); }
    .kpi__top { display: flex; align-items: center; justify-content: space-between; }
    .kpi__icon { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 10px; }
    .kpi__icon app-icon { width: 20px; height: 20px; display: block; }
    .kpi__delta { font-size: 0.8rem; font-weight: 600; color: var(--cw-success, #16a34a); }
    .kpi__delta--down { color: var(--cw-danger, #dc2626); }
    .kpi__value { font-size: 1.7rem; font-weight: 700; color: var(--cw-text); margin-top: 0.6rem; line-height: 1.1; }
    .kpi__label { color: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 0.88rem; margin-bottom: 0.4rem; }

    .dash { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1rem; align-items: start; margin-bottom: 1rem; }
    .dash__col { display: flex; flex-direction: column; gap: 1rem; min-width: 0; }
    .dash__col cw-card { display: block; }

    .legend { display: flex; gap: 1.25rem; margin-top: 0.5rem; }
    .legend__item { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .legend__item i, .cat-legend i, .legend i { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }

    .donut-wrap { display: flex; align-items: center; gap: 1rem; }
    .donut-wrap cw-donut-chart { width: 140px; flex: none; }
    .cat-legend { list-style: none; margin: 0; padding: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 0.5rem; }
    .cat-legend li { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .cat-legend li strong { margin-left: auto; color: var(--cw-text); }

    .cust { display: flex; align-items: center; gap: 0.5rem; }
    .sellers { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.9rem; }
    .seller__head, .goal__row { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--cw-text-muted, var(--cw-text-secondary)); margin-bottom: 0.35rem; }
    .seller__head strong, .goal__row strong { color: var(--cw-text); }
    .goals { display: flex; flex-direction: column; gap: 0.9rem; }

    @media (max-width: 1000px) {
      .kpis { grid-template-columns: repeat(2, 1fr); }
      .dash { grid-template-columns: 1fr; }
    }
  `]
})
export class DemoDashboardComponent {
  private readonly toast = inject(CwToastService);

  readonly crumbs = [{ label: 'Home', url: '#' }, { label: 'Dashboard' }];
  readonly ranges = ['7d', '30d', '12m'];
  readonly range = signal('12m');

  readonly kpis: Kpi[] = [
    { label: 'Revenue', value: '$84,120', delta: '12.5%', up: true, icon: 'dollar', tint: '#6c63ff', spark: [12, 18, 15, 22, 20, 28, 26, 34] },
    { label: 'Orders', value: '1,204', delta: '3.2%', up: true, icon: 'receipt', tint: '#22c55e', spark: [30, 28, 33, 31, 36, 34, 40, 44] },
    { label: 'Customers', value: '3,847', delta: '8.1%', up: true, icon: 'users', tint: '#f59e0b', spark: [10, 14, 13, 19, 22, 21, 27, 30] },
    { label: 'Refund rate', value: '2.4%', delta: '0.5%', up: false, icon: '↩️', tint: '#ec4899', spark: [8, 7, 9, 6, 7, 5, 6, 4] }
  ];

  private readonly revenueData: Record<string, { labels: string[]; thisYear: number[]; lastYear: number[] }> = {
    '7d': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], thisYear: [12, 19, 15, 22, 18, 27, 24], lastYear: [10, 14, 13, 16, 15, 20, 19] },
    '30d': { labels: ['W1', 'W2', 'W3', 'W4'], thisYear: [62, 74, 68, 88], lastYear: [55, 60, 64, 70] },
    '12m': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      thisYear: [42, 48, 45, 60, 58, 72, 70, 84, 80, 96, 92, 110],
      lastYear: [35, 38, 40, 44, 46, 52, 55, 60, 62, 70, 72, 80]
    }
  };

  readonly revenueSeries = computed<CwChartSeries[]>(() => {
    const d = this.revenueData[this.range()];
    return [
      { name: 'This year', color: '#6c63ff', data: d.thisYear },
      { name: 'Last year', color: '#94a3b8', data: d.lastYear }
    ];
  });
  readonly revenueLabels = computed(() => this.revenueData[this.range()].labels);

  readonly category: CwDonutSegment[] = [
    { label: 'Electronics', value: 38, color: '#6c63ff' },
    { label: 'Apparel', value: 24, color: '#22c55e' },
    { label: 'Home', value: 18, color: '#f59e0b' },
    { label: 'Toys', value: 12, color: '#ec4899' },
    { label: 'Books', value: 8, color: '#14b8a6' }
  ];

  readonly sellers: Seller[] = [
    { name: 'Aurora Headphones', sold: 1240, percent: 92, color: '#6c63ff' },
    { name: 'Nimbus Keyboard', sold: 980, percent: 74, color: '#22c55e' },
    { name: 'Vertex Mouse', sold: 870, percent: 66, color: '#f59e0b' },
    { name: 'Pulse Watch', sold: 640, percent: 48, color: '#ec4899' }
  ];

  readonly goals = [
    { label: 'Revenue target', value: 72 },
    { label: 'New customers', value: 54 },
    { label: 'Retention', value: 88 }
  ];

  readonly orders: Order[] = seedOrders();
  readonly orderColumns: CwTableColumn[] = [
    { field: 'customer', header: 'Customer' },
    { field: 'id', header: 'Order' },
    { field: 'total', header: 'Total', align: 'right' },
    { field: 'status', header: 'Status' }
  ];
  readonly statusSeverity = orderSeverity;

  readonly activity: CwTimelineEvent[] = [
    { opposite: '2m ago', content: 'Order #10245 placed by Ada Lovelace', severity: 'success' },
    { opposite: '18m ago', content: 'New customer Barbara Liskov signed up', severity: 'info' },
    { opposite: '1h ago', content: '“Aurora Headphones” went low on stock', severity: 'warn' },
    { opposite: '3h ago', content: 'Refund issued for order #10240', severity: 'danger' },
    { opposite: 'Yesterday', content: 'Monthly report exported', severity: 'neutral' }
  ];

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  exportReport(): void {
    this.toast.show({ severity: 'success', summary: 'Report exported', detail: 'Your report is downloading.' });
  }

  onPoint(e: CwChartPointEvent): void {
    this.toast.show({ severity: 'info', summary: e.label, detail: e.values.map(v => `${v.name}: ${v.value}`).join(' · ') });
  }
  onSlice(s: CwDonutSegment): void {
    this.toast.show({ severity: 'info', summary: s.label, detail: `${s.value}% of revenue` });
  }
}
