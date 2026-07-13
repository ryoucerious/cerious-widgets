import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CwTimelineEvent, TimelineComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-timeline-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimelineComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Timeline" description="A vertical sequence of events with coloured markers — good for order tracking and activity logs.">
      <app-demo-section title="Order tracking" [code]="code">
        <div style="width: 100%; max-width: 26rem;">
          <cw-timeline [events]="events" />
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class TimelineDemoComponent {
  events: CwTimelineEvent[] = [
    { opposite: 'May 12, 09:00', content: 'Order placed', severity: 'info' },
    { opposite: 'May 12, 11:30', content: 'Payment confirmed', severity: 'success' },
    { opposite: 'May 13, 08:15', content: 'Shipped from warehouse', severity: 'success' },
    { opposite: 'May 14, 14:40', content: 'Out for delivery', severity: 'warn' },
    { opposite: 'May 14, 17:02', content: 'Delivered', severity: 'success' }
  ];

  code = `<cw-timeline [events]="[
  { opposite: '09:00', content: 'Order placed', severity: 'info' },
  { opposite: '11:30', content: 'Shipped', severity: 'success' }
]" />`;
}
