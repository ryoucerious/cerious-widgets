import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CwDataViewLayout, DataViewComponent, DataViewItemDirective, SelectButtonComponent } from 'ngx-cerious-widgets';
import { FormsModule } from '@angular/forms';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

interface Product { name: string; category: string; price: number; }

@Component({
  selector: 'app-data-view-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataViewComponent, DataViewItemDirective, SelectButtonComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="DataView" description="Renders a collection in list or grid layout with a projected item template. Paginate, or leave it and a large list is virtualized with ngx-cerious-scroll.">
      <app-demo-section title="List / grid, paginated" [code]="basicCode">
        <div style="width: 100%; max-width: 40rem;">
          <div style="margin-bottom: 0.75rem;">
            <cw-select-button [options]="['list', 'grid']" [(ngModel)]="layout" />
          </div>
          <cw-data-view [value]="products" [layout]="layout" [rows]="6">
            <ng-template cwDataViewItem let-item let-l="layout">
              <div [style.padding]="l === 'grid' ? '1rem' : '0.75rem 1rem'">
                <div style="font-weight: 600;">{{ item.name }}</div>
                <div style="color: var(--cw-text-muted); font-size: 0.8125rem;">{{ item.category }}</div>
                <div style="color: var(--cw-primary); font-weight: 600; margin-top: 0.25rem;">\${{ item.price }}</div>
              </div>
            </ng-template>
          </cw-data-view>
        </div>
      </app-demo-section>

      <app-demo-section title="1,000 items — virtualized list" [code]="virtualCode">
        <div style="width: 100%; max-width: 40rem;">
          <cw-data-view [value]="many" layout="list" listHeight="320px">
            <ng-template cwDataViewItem let-item>
              <div style="padding: 0.625rem 1rem;">{{ item.name }} — <span style="color: var(--cw-text-muted);">{{ item.category }}</span></div>
            </ng-template>
          </cw-data-view>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class DataViewDemoComponent {
  layout: CwDataViewLayout = 'grid';
  private cats = ['Electronics', 'Books', 'Clothing', 'Home', 'Toys'];

  products: Product[] = Array.from({ length: 24 }, (_, i) => ({
    name: `Product ${i + 1}`,
    category: this.cats[i % this.cats.length],
    price: 20 + ((i * 37) % 480)
  }));

  many: Product[] = Array.from({ length: 1000 }, (_, i) => ({
    name: `Item ${i + 1}`,
    category: this.cats[i % this.cats.length],
    price: 10 + ((i * 13) % 990)
  }));

  basicCode = `<cw-data-view [value]="products" layout="grid" [rows]="6">
  <ng-template cwDataViewItem let-item>{{ item.name }}</ng-template>
</cw-data-view>`;
  virtualCode = `// 1,000 items — the list is virtualized with ngx-cerious-scroll
<cw-data-view [value]="many" layout="list" listHeight="320px">…</cw-data-view>`;
}
