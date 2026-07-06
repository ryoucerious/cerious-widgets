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
      <doc-section title="100,000 rows" [code]="code">
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
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class VirtualScrollerDocComponent {
  readonly apiProps = [
    { name: "items", type: "readonly unknown[]", default: "[]", description: "The full collection to virtualize." },
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

  code = `<cw-virtual-scroller [items]="rows" scrollHeight="360px">
  <ng-template cwVirtualScrollerItem let-item let-i="index">
    {{ i }}: {{ item.name }}
  </ng-template>
</cw-virtual-scroller>`;
}
