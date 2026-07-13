import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwOrgNode, OrgChartComponent, OrgNodeDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-org-chart-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrgChartComponent, OrgNodeDirective, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="org-chart">
      <doc-tab label="Features">
        <doc-section title="Basic" description="Pass a hierarchical node model; connectors are drawn automatically." [code]="basicCode">
          <cw-org-chart [root]="company" (nodeSelect)="selected.set($event.label)" />
          @if (selected()) { <p class="hint">Selected: <strong>{{ selected() }}</strong></p> }
        </doc-section>

        <doc-section title="Custom node template" description="Render a rich card with [cwOrgNode]." [code]="templateCode">
          <cw-org-chart [root]="company">
            <ng-template cwOrgNode let-node>
              <span class="node__name">{{ node.label }}</span>
              @if (node.subtitle) { <span class="node__role">{{ node.subtitle }}</span> }
            </ng-template>
          </cw-org-chart>
        </doc-section>
      </doc-tab>

      <doc-tab label="API">
        <doc-api [props]="props" [events]="events" />
      </doc-tab>

      <doc-tab label="Theming">
        <doc-theming [tokens]="tokens" />
      </doc-tab>
    </doc-page>
  `,
  styles: [`
    .hint { margin-top: 0.75rem; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .node__name { font-weight: 600; color: var(--cw-text); }
    .node__role { display: block; font-size: 0.75rem; color: var(--cw-primary); }
  `]
})
export class OrgChartDocComponent {
  readonly selected = signal('');

  company: CwOrgNode = {
    label: 'Ada Lovelace', subtitle: 'CEO',
    children: [
      { label: 'Grace Hopper', subtitle: 'CTO', children: [{ label: 'Linus T.', subtitle: 'Eng Lead' }, { label: 'Margaret H.', subtitle: 'QA Lead' }] },
      { label: 'Katherine J.', subtitle: 'CFO', children: [{ label: 'Alan T.', subtitle: 'Controller' }] },
      { label: 'Radia P.', subtitle: 'COO' }
    ]
  };

  basicCode = `<cw-org-chart [root]="company" (nodeSelect)="open($event)" />

company: CwOrgNode = {
  label: 'CEO',
  children: [
    { label: 'CTO', children: [{ label: 'Engineer' }] },
    { label: 'CFO' }
  ]
};`;

  templateCode = `<cw-org-chart [root]="company">
  <ng-template cwOrgNode let-node>
    <span class="name">{{ node.label }}</span>
    <span class="role">{{ node.subtitle }}</span>
  </ng-template>
</cw-org-chart>`;

  props = [
    { name: 'root', type: 'CwOrgNode | null', default: 'null', description: 'The root node; children recurse via node.children.' }
  ];
  events = [
    { name: 'nodeSelect', type: 'CwOrgNode', description: 'Emitted when a node card is clicked.' }
  ];
  tokens = [
    { token: '--cw-border-strong', description: 'Connector line colour.' },
    { token: '--cw-surface', description: 'Node card background.' },
    { token: '--cw-primary', description: 'Selected-card border.' }
  ];
}
