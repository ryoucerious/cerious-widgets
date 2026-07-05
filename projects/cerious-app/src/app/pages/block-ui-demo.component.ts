import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BlockUiComponent, ButtonComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-block-ui-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockUiComponent, ButtonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="BlockUI" description="Overlays a region with a scrim and spinner while it is busy — for loading or disabled areas.">
      <app-demo-section title="Block a panel" [code]="code">
        <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 26rem;">
          <button cwButton (click)="simulate()">{{ blocked() ? 'Working…' : 'Save (blocks for 2s)' }}</button>
          <cw-block-ui [blocked]="blocked()">
            <div style="border: 1px solid var(--cw-border); border-radius: var(--cw-radius); padding: 1.25rem;">
              <p style="margin: 0 0 0.5rem; font-weight: 600;">Account settings</p>
              <p style="margin: 0; color: var(--cw-text-secondary);">This panel is blocked while the save is in progress.</p>
            </div>
          </cw-block-ui>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class BlockUiDemoComponent {
  readonly blocked = signal(false);

  simulate(): void {
    this.blocked.set(true);
    setTimeout(() => this.blocked.set(false), 2000);
  }

  code = `<cw-block-ui [blocked]="saving">
  <form>…</form>
</cw-block-ui>`;
}
