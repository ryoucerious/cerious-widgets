import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, PanelComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-panel-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PanelComponent, ButtonComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="panel"><doc-tab label="Features">
      <doc-section title="Basic" description="A bordered surface with a header and projected body content." [code]="basicCode">
        <cw-panel header="Shipping address" style="max-width: 420px;">
          <p style="margin: 0;">1 Infinite Loop, Cupertino, CA 95014</p>
        </cw-panel>
      </doc-section>

      <doc-section title="Toggleable" description="Add 'toggleable' for a collapsible body with a chevron in the header." [code]="toggleCode">
        <cw-panel header="Advanced options" toggleable style="max-width: 420px;">
          <p style="margin: 0;">Collapse me by clicking the header or the chevron.</p>
        </cw-panel>
      </doc-section>

      <doc-section title="Start collapsed" description="Combine 'toggleable' with 'collapsed' to render collapsed initially." [code]="collapsedCode">
        <cw-panel header="Change log" toggleable collapsed style="max-width: 420px;">
          <p style="margin: 0;">Hidden until expanded.</p>
        </cw-panel>
      </doc-section>

      <doc-section title="Header actions" description="Project buttons or controls into the header with the [cwPanelActions] slot." [code]="actionsCode">
        <cw-panel header="Team" style="max-width: 420px;">
          <button cwButton size="small" variant="outlined" cwPanelActions>Invite</button>
          <p style="margin: 0;">3 members</p>
        </cw-panel>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class PanelDocComponent {
  readonly apiProps = [
    { name: 'header', type: 'string', default: "''", description: 'The header label.' },
    { name: 'toggleable', type: 'boolean', default: 'false', description: 'Allow collapsing the body from the header (adds a chevron).' },
    { name: 'collapsed', type: 'boolean', default: 'false', description: 'Start collapsed (requires toggleable).' }
  ];
  readonly apiEvents = [
    { name: 'collapsedChange', type: 'EventEmitter<boolean>', description: 'Emitted with the new collapsed state on every toggle.' }
  ];
  readonly themeTokens = [
    { token: '--cw-surface', description: 'Panel background.' },
    { token: '--cw-border', description: 'Panel border colour.' },
    { token: '--cw-radius', description: 'Corner radius.' },
    { token: '--cw-text', description: 'Header and body text colour.' },
    { token: '--cw-font', description: 'Font family.' }
  ];

  basicCode = `<cw-panel header="Shipping address">
  <p>1 Infinite Loop, Cupertino, CA 95014</p>
</cw-panel>`;
  toggleCode = `<cw-panel header="Advanced options" toggleable>
  <p>Collapse me by clicking the header.</p>
</cw-panel>`;
  collapsedCode = `<cw-panel header="Change log" toggleable collapsed>
  <p>Hidden until expanded.</p>
</cw-panel>`;
  actionsCode = `<cw-panel header="Team">
  <button cwButton size="small" variant="outlined" cwPanelActions>Invite</button>
  <p>3 members</p>
</cw-panel>`;
}
