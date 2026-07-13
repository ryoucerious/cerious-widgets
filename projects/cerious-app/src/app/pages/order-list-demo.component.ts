import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderListComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-order-list-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrderListComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="OrderList" description="A reorderable list — select a row, then move it with the side controls. Large lists are virtualized with ngx-cerious-scroll.">
      <app-demo-section title="Basic" [code]="basicCode">
        <cw-order-list [options]="tasks" header="Tasks" [(ngModel)]="ordered" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Order: {{ ordered.join(', ') }}</span>
      </app-demo-section>

      <app-demo-section title="300 items — virtualized" [code]="virtualCode">
        <cw-order-list [options]="many" header="Items" [(ngModel)]="manyOrder" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class OrderListDemoComponent {
  tasks = ['Design', 'Develop', 'Review', 'Test', 'Deploy'];
  ordered = [...this.tasks];

  many = Array.from({ length: 300 }, (_, i) => `Item ${i + 1}`);
  manyOrder = [...this.many];

  basicCode = `<cw-order-list [options]="tasks" header="Tasks" [(ngModel)]="ordered" />`;
  virtualCode = `// 300 items — virtualized with ngx-cerious-scroll
<cw-order-list [options]="many" [(ngModel)]="order" />`;
}
