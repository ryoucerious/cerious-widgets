import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, ToolbarComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-toolbar-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToolbarComponent, ButtonComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="toolbar"><doc-tab label="Features">
      <doc-section title="Start / end" description="Project content into the [cwToolbarStart] and [cwToolbarEnd] slots for a spaced action bar." [code]="basicCode">
        <cw-toolbar>
          <div cwToolbarStart style="display:flex; gap:0.5rem;">
            <button cwButton>New</button>
            <button cwButton severity="secondary" variant="outlined">Import</button>
          </div>
          <div cwToolbarEnd>
            <button cwButton severity="secondary" variant="outlined">Export</button>
          </div>
        </cw-toolbar>
      </doc-section>

      <doc-section title="Three slots" description="Add [cwToolbarCenter] for a centred title or search between the two ends." [code]="centerCode">
        <cw-toolbar>
          <div cwToolbarStart><button cwButton size="small">Back</button></div>
          <div cwToolbarCenter style="font-weight:600;">Invoice #1042</div>
          <div cwToolbarEnd style="display:flex; gap:0.5rem;">
            <button cwButton size="small" severity="secondary" variant="outlined">Print</button>
            <button cwButton size="small">Save</button>
          </div>
        </cw-toolbar>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class ToolbarDocComponent {
  readonly apiProps = [
    { name: '[cwToolbarStart]', type: 'content slot', default: ', ', description: 'Content aligned to the start (left).' },
    { name: '[cwToolbarCenter]', type: 'content slot', default: ', ', description: 'Content aligned to the centre.' },
    { name: '[cwToolbarEnd]', type: 'content slot', default: ', ', description: 'Content aligned to the end (right).' }
  ];
  readonly apiEvents = [];
  readonly themeTokens = [
    { token: '--cw-surface', description: 'Toolbar background.' },
    { token: '--cw-border', description: 'Toolbar border.' },
    { token: '--cw-radius', description: 'Corner radius.' },
    { token: '--cw-font', description: 'Font family.' }
  ];

  basicCode = `<cw-toolbar>
  <div cwToolbarStart>
    <button cwButton>New</button>
    <button cwButton severity="secondary" variant="outlined">Import</button>
  </div>
  <div cwToolbarEnd>
    <button cwButton severity="secondary" variant="outlined">Export</button>
  </div>
</cw-toolbar>`;
  centerCode = `<cw-toolbar>
  <div cwToolbarStart><button cwButton size="small">Back</button></div>
  <div cwToolbarCenter>Invoice #1042</div>
  <div cwToolbarEnd>
    <button cwButton size="small" severity="secondary" variant="outlined">Print</button>
    <button cwButton size="small">Save</button>
  </div>
</cw-toolbar>`;
}
