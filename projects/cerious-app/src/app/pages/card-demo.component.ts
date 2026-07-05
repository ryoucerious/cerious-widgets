import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, CardComponent, PanelComponent, ToolbarComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-card-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, PanelComponent, ToolbarComponent, ButtonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Card & Panel" description="Layout surfaces: a soft content card, a collapsible bordered panel and a toolbar.">
      <app-demo-section title="Card" [code]="cardCode">
        <cw-card title="Monthly Report" subtitle="June 2026" style="max-width: 22rem;">
          Revenue is up 14% month over month, driven by the new enterprise tier.
          <div cwCardFooter>
            <button cwButton>View details</button>
          </div>
        </cw-card>
      </app-demo-section>

      <app-demo-section title="Panel" description="Toggleable via the header chevron." [code]="panelCode">
        <cw-panel header="Advanced settings" toggleable style="width: 100%; max-width: 28rem;">
          Fine-tune caching, timeouts and retry behaviour here.
        </cw-panel>
      </app-demo-section>

      <app-demo-section title="Toolbar" [code]="toolbarCode">
        <cw-toolbar style="width: 100%;">
          <div cwToolbarStart>
            <button cwButton>New</button>
            <button cwButton severity="secondary" variant="outlined">Import</button>
          </div>
          <div cwToolbarEnd>
            <button cwButton severity="secondary" variant="outlined">Export</button>
          </div>
        </cw-toolbar>
      </app-demo-section>
    </app-demo-page>
  `
})
export class CardDemoComponent {
  cardCode = `<cw-card title="Monthly Report" subtitle="June 2026">
  Revenue is up 14% month over month.
  <div cwCardFooter><button cwButton>View details</button></div>
</cw-card>`;
  panelCode = `<cw-panel header="Advanced settings" toggleable>…</cw-panel>`;
  toolbarCode = `<cw-toolbar>
  <div cwToolbarStart><button cwButton>New</button></div>
  <div cwToolbarEnd><button cwButton>Export</button></div>
</cw-toolbar>`;
}
