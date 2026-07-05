import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollPanelComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-scroll-panel-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollPanelComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="ScrollPanel" description="A scrollable container with slim, theme-styled scrollbars around its content.">
      <app-demo-section title="Bounded height" [code]="code">
        <cw-scroll-panel height="14rem" style="width: 100%; max-width: 26rem; border: 1px solid var(--cw-border); border-radius: var(--cw-radius);">
          <div style="padding: 1rem;">
            @for (line of lines; track line) {
              <p style="margin: 0 0 0.75rem;">Line {{ line }} — this content scrolls within the panel.</p>
            }
          </div>
        </cw-scroll-panel>
      </app-demo-section>
    </app-demo-page>
  `
})
export class ScrollPanelDemoComponent {
  lines = Array.from({ length: 30 }, (_, i) => i + 1);

  code = `<cw-scroll-panel height="14rem">…long content…</cw-scroll-panel>`;
}
