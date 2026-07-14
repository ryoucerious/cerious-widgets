import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CwDataViewLayout, DataViewComponent, DataViewItemDirective, SelectButtonComponent } from 'ngx-cerious-widgets';
import { FormsModule } from '@angular/forms';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

interface Product { name: string; category: string; price: number; }

@Component({
  selector: 'app-data-view-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataViewComponent, DataViewItemDirective, SelectButtonComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="data-view"><doc-tab label="Features">
      <doc-section title="List / grid, paginated" [code]="basicCode">
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
      </doc-section>

      <doc-section title="1,000 items, virtualized list" [code]="virtualCode">
        <div style="width: 100%; max-width: 40rem;">
          <cw-data-view [value]="many" layout="list" listHeight="320px">
            <ng-template cwDataViewItem let-item>
              <div style="padding: 0.625rem 1rem;">{{ item.name }}, <span style="color: var(--cw-text-muted);">{{ item.category }}</span></div>
            </ng-template>
          </cw-data-view>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class DataViewDocComponent {
  readonly apiProps = [
    { name: "value", type: "readonly unknown[]", default: "[]", description: "The full collection." },
    { name: "layout", type: "CwDataViewLayout", default: "'list'", description: "List (default) or grid layout." },
    { name: "rows", type: "number", default: "0", description: "Rows per page; 0 disables pagination." },
    { name: "gridMinColumn", type: "string", default: "'14rem'", description: "Minimum column width for the grid (any CSS length)." },
    { name: "listHeight", type: "string", default: "'420px'", description: "List height when virtualized (any CSS length)." },
    { name: "virtualThreshold", type: "number", default: "100", description: "Virtualize a non-paginated list at or above this item count." },
    { name: "emptyMessage", type: "string", default: "'No records found.'", description: "Text shown when there are no items." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-divider", description: "Divider line colour." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-font", description: "Font family." }
  ];

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
  virtualCode = `// 1,000 items, the list is virtualized with ngx-cerious-scroll
<cw-data-view [value]="many" layout="list" listHeight="320px">…</cw-data-view>`;
}
