import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SplitterComponent, SplitterPanelDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-splitter-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SplitterComponent, SplitterPanelDirective, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="splitter"><doc-tab label="Features">
      <doc-section title="Horizontal" [code]="hCode">
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
      </doc-section>

      <doc-section title="Vertical, three panes" [code]="vCode">
        <cw-splitter layout="vertical" [initialSizes]="[25, 50, 25]" style="width: 100%; max-width: 40rem; height: 16rem;">
          <ng-template cwSplitterPanel><div style="padding: 0.75rem 1rem;">Header</div></ng-template>
          <ng-template cwSplitterPanel><div style="padding: 0.75rem 1rem;">Body</div></ng-template>
          <ng-template cwSplitterPanel><div style="padding: 0.75rem 1rem;">Footer</div></ng-template>
        </cw-splitter>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class SplitterDocComponent {
  readonly apiProps = [
    { name: "layout", type: "CwSplitterLayout", default: "'horizontal'", description: "Orientation." },
    { name: "initialSizes", type: "readonly number[]", default: "[]", description: "Initial panel sizes as percentages (must sum to ~100)." },
    { name: "minSize", type: "number", default: "10", description: "Minimum panel size in percent." }
  ];
  readonly apiEvents = [
    { name: "resizeEnd", type: "number[]", description: "Emitted with the new size array when a drag ends." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-raised", description: "Raised/overlay background." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-divider", description: "Divider line colour." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." }
  ];

  hCode = `<cw-splitter [initialSizes]="[30, 70]">
  <ng-template cwSplitterPanel>Sidebar</ng-template>
  <ng-template cwSplitterPanel>Content</ng-template>
</cw-splitter>`;
  vCode = `<cw-splitter layout="vertical" [initialSizes]="[25, 50, 25]">…</cw-splitter>`;
}
