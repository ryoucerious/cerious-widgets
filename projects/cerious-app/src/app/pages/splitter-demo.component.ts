import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SplitterComponent, SplitterPanelDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-splitter-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SplitterComponent, SplitterPanelDirective, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Splitter" description="Splits panels with draggable gutters so the user can resize them. Drag a gutter to try it.">
      <app-demo-section title="Horizontal" [code]="hCode">
        <cw-splitter [initialSizes]="[30, 70]" style="width: 100%; max-width: 40rem; height: 12rem;">
          <ng-template cwSplitterPanel>
            <div style="padding: 1rem; height: 100%; box-sizing: border-box;">
              <strong>Sidebar</strong>
              <p style="color: var(--cw-text-muted); font-size: 0.8125rem;">30% to start</p>
            </div>
          </ng-template>
          <ng-template cwSplitterPanel>
            <div style="padding: 1rem; height: 100%; box-sizing: border-box;">
              <strong>Content</strong>
              <p style="color: var(--cw-text-muted); font-size: 0.8125rem;">Drag the gutter on the left to resize.</p>
            </div>
          </ng-template>
        </cw-splitter>
      </app-demo-section>

      <app-demo-section title="Vertical, three panes" [code]="vCode">
        <cw-splitter layout="vertical" [initialSizes]="[25, 50, 25]" style="width: 100%; max-width: 40rem; height: 16rem;">
          <ng-template cwSplitterPanel><div style="padding: 0.75rem 1rem;">Header</div></ng-template>
          <ng-template cwSplitterPanel><div style="padding: 0.75rem 1rem;">Body</div></ng-template>
          <ng-template cwSplitterPanel><div style="padding: 0.75rem 1rem;">Footer</div></ng-template>
        </cw-splitter>
      </app-demo-section>
    </app-demo-page>
  `
})
export class SplitterDemoComponent {
  hCode = `<cw-splitter [initialSizes]="[30, 70]">
  <ng-template cwSplitterPanel>Sidebar</ng-template>
  <ng-template cwSplitterPanel>Content</ng-template>
</cw-splitter>`;
  vCode = `<cw-splitter layout="vertical" [initialSizes]="[25, 50, 25]">…</cw-splitter>`;
}
