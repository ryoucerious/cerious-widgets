import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VirtualScrollerComponent, VirtualScrollerItemDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-virtual-scroller-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VirtualScrollerComponent, VirtualScrollerItemDirective, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="virtual-scroller"><doc-tab label="Features">
      <doc-section title="100,000 rows" description="Bind a materialized array to [items], only the visible rows are ever in the DOM." [code]="code">
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
      </doc-section>

      <doc-section title="1,000,000 rows" description="A full million rows in a single list. Scroll from the very top to the very bottom, it stays smooth the whole way, because only the couple dozen rows actually on screen are ever in the DOM." [code]="millionCode">
        <div style="width: 100%; max-width: 32rem;">
          <cw-virtual-scroller [getItem]="getRow" [totalElements]="1000000" scrollHeight="360px">
            <ng-template cwVirtualScrollerItem let-item let-i="index">
              <div style="display: flex; justify-content: space-between; padding: 0.625rem 1rem;">
                <span>{{ item.name }}</span>
                <span style="color: var(--cw-text-muted); font-variant-numeric: tabular-nums;">#{{ i }}</span>
              </div>
            </ng-template>
          </cw-virtual-scroller>
        </div>
      </doc-section>

      <doc-section title="Dynamic row heights" description="Rows don't have to be uniform. The engine measures each rendered row's real height (via a ResizeObserver), so variable-length content just works, no itemHeight to configure." [code]="dynamicCode">
        <div style="width: 100%; max-width: 32rem;">
          <cw-virtual-scroller [items]="passages" scrollHeight="360px">
            <ng-template cwVirtualScrollerItem let-item let-i="index">
              <div style="padding: 0.75rem 1rem;">
                <div style="display: flex; justify-content: space-between; font-weight: 600;">
                  <span>{{ item.title }}</span>
                  <span style="color: var(--cw-text-muted); font-variant-numeric: tabular-nums;">#{{ i }}</span>
                </div>
                <p style="margin: 0.35rem 0 0; color: var(--cw-text-muted); line-height: 1.5;">{{ item.body }}</p>
              </div>
            </ng-template>
          </cw-virtual-scroller>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class VirtualScrollerDocComponent {
  readonly apiProps = [
    { name: "items", type: "readonly unknown[]", default: "[]", description: "The full collection to virtualize. Ignored when getItem is provided." },
    { name: "getItem", type: "(index: number) => unknown", default: "null", description: "Lazy row accessor for huge datasets, the engine only requests indices it renders. Pair with totalElements." },
    { name: "totalElements", type: "number", default: "null", description: "Row count when using getItem instead of a materialized items array." },
    { name: "scrollHeight", type: "string", default: "'400px'", description: "Viewport height (any CSS length)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-font", description: "Font family." },
    { token: "--cw-row-border", description: "Themed via this token." }
  ];

  items = Array.from({ length: 100000 }, (_, i) => ({ name: `Row ${i + 1}` }));

  // A lazy accessor instead of a 1,000,000-element array: the scroller only
  // calls this for the handful of indices it actually renders.
  readonly getRow = (index: number): { name: string } => ({ name: `Row ${index + 1}` });

  // Variable-length bodies produce rows of differing heights; the engine
  // measures each one, so nothing here declares a fixed row height.
  private readonly words = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor '
    + 'incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud').split(' ');
  passages = Array.from({ length: 5000 }, (_, i) => {
    const len = 4 + ((i * 7) % 34); // 4..37 words → short and tall rows interleaved
    return { title: `Passage ${i + 1}`, body: Array.from({ length: len }, (_, w) => this.words[(i + w) % this.words.length]).join(' ') + '.' };
  });

  code = `<cw-virtual-scroller [items]="rows" scrollHeight="360px">
  <ng-template cwVirtualScrollerItem let-item let-i="index">
    {{ i }}: {{ item.name }}
  </ng-template>
</cw-virtual-scroller>`;

  millionCode = `// One million rows, rendered smoothly.
<cw-virtual-scroller [getItem]="getRow" [totalElements]="1000000" scrollHeight="360px">
  <ng-template cwVirtualScrollerItem let-item let-i="index">
    {{ i }}: {{ item.name }}
  </ng-template>
</cw-virtual-scroller>`;

  dynamicCode = `// Rows can be any height, the engine measures each rendered row.
<cw-virtual-scroller [items]="passages" scrollHeight="360px">
  <ng-template cwVirtualScrollerItem let-item>
    <h4>{{ item.title }}</h4>
    <p>{{ item.body }}</p>   <!-- variable length ⇒ variable height -->
  </ng-template>
</cw-virtual-scroller>`;
}
