import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AvatarComponent, ButtonComponent, DataViewComponent, DataViewItemDirective,
  RatingComponent, SelectButtonComponent, TagComponent
} from 'ngx-cerious-widgets';
import { Customer, planSeverity, seedCustomers } from './demo-data';

@Component({
  selector: 'app-demo-customers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, CurrencyPipe, DataViewComponent, DataViewItemDirective,
    AvatarComponent, TagComponent, RatingComponent, SelectButtonComponent, ButtonComponent
  ],
  template: `
    <header class="page-head">
      <div>
        <h1 class="page-head__title">Customers</h1>
        <p class="page-head__sub">{{ customers.length }} people · {{ activeCount }} active</p>
      </div>
      <cw-select-button [options]="layouts" [ngModel]="layout()" (ngModelChange)="layout.set($event)" />
    </header>

    <cw-data-view [value]="customers" [layout]="layout()" [rows]="6">
      <ng-template cwDataViewItem let-c let-l="layout">
        @if (l === 'grid') {
          <div class="cust-card">
            <cw-avatar [label]="c.initials" size="large" />
            <div class="cust-card__name">{{ c.name }}</div>
            <div class="cust-card__handle">{{ c.handle }}</div>
            <cw-tag [value]="c.plan" [severity]="severity(c.plan)" rounded />
            <cw-rating [ngModel]="c.rating" readonly [stars]="5" />
            <div class="cust-card__spent">{{ c.spent | currency }} · {{ c.orders }} orders</div>
            <button cwButton size="small" variant="outlined">View</button>
          </div>
        } @else {
          <div class="cust-row">
            <cw-avatar [label]="c.initials" />
            <div class="cust-row__meta">
              <span class="cust-row__name">{{ c.name }} <span class="cust-row__handle">{{ c.handle }}</span></span>
              <cw-rating [ngModel]="c.rating" readonly [stars]="5" />
            </div>
            <cw-tag [value]="c.plan" [severity]="severity(c.plan)" rounded />
            <span class="cust-row__spent">{{ c.spent | currency }}</span>
            <span class="cust-row__orders">{{ c.orders }} orders</span>
          </div>
        }
      </ng-template>
    </cw-data-view>
  `,
  styles: [`
    :host { display: block; }
    .page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; }
    .page-head__title { margin: 0; font-size: 1.6rem; font-weight: 700; color: var(--cw-text); }
    .page-head__sub { margin: 0.25rem 0 0; color: var(--cw-text-muted, var(--cw-text-secondary)); }

    .cust-card { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; padding: 1.25rem; text-align: center; }
    .cust-card__name { font-weight: 600; color: var(--cw-text); }
    .cust-card__handle { font-size: 0.8rem; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .cust-card__spent { font-size: 0.82rem; color: var(--cw-text-muted, var(--cw-text-secondary)); margin: 0.25rem 0; }

    .cust-row { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; }
    .cust-row__meta { display: flex; flex-direction: column; gap: 0.2rem; flex: 1 1 auto; min-width: 0; }
    .cust-row__name { font-weight: 600; color: var(--cw-text); }
    .cust-row__handle { font-weight: 400; color: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 0.85rem; }
    .cust-row__spent { font-weight: 600; color: var(--cw-text); }
    .cust-row__orders { color: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 0.85rem; width: 5.5rem; text-align: right; }

    @media (max-width: 640px) {
      /* Stack the heading above the layout switcher rather than squeezing them
         onto one line. */
      .page-head { flex-direction: column; align-items: stretch; gap: 0.75rem; }
      .page-head__title { font-size: 1.35rem; }
      .cust-row { gap: 0.6rem; padding: 0.75rem; }
      .cust-row__orders { width: auto; }
    }
  `]
})
export class DemoCustomersComponent {
  readonly customers: Customer[] = seedCustomers();
  readonly layouts = ['list', 'grid'];
  readonly layout = signal<'list' | 'grid'>('grid');
  readonly severity = planSeverity;
  readonly activeCount = this.customers.filter(c => c.active).length;
}
