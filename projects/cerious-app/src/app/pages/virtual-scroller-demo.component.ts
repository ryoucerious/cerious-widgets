import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VirtualScrollerComponent, VirtualScrollerItemDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-virtual-scroller-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VirtualScrollerComponent, VirtualScrollerItemDirective, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="VirtualScroller" description="A standalone virtual list: renders only the visible rows of a large collection through the ngx-cerious-scroll engine, using a projected row template.">
      <app-demo-section title="100,000 rows" [code]="code">
        <div style="width: 100%; max-width: 32rem;">
          <cw-virtual-scroller [items]="items" scrollHeight="360px">
            <ng-template cwVirtualScrollerItem let-item let-i="index">
              <div style="display: flex; justify-content: space-between; padding: 0.625rem 1rem;">
                <span>{{ item.name }}</span>
                <span style="color: var(--cw-text-muted); font-variant-numeric: tabular-nums;">#{{ i }}</span>
              </div>
            </ng-template>
          </cw-virtual-scroller>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class VirtualScrollerDemoComponent {
  items = Array.from({ length: 100000 }, (_, i) => ({ name: `Row ${i + 1}` }));

  code = `<cw-virtual-scroller [items]="rows" scrollHeight="360px">
  <ng-template cwVirtualScrollerItem let-item let-i="index">
    {{ i }}: {{ item.name }}
  </ng-template>
</cw-virtual-scroller>`;
}
