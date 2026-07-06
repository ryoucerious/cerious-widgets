import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwTreeNode, TreeComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-tree-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TreeComponent, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="tree">
      <doc-tab label="Features">
        <doc-section title="Basic" description="A hierarchical tree; click a row to select, the chevron to expand/collapse." [code]="basicCode">
          <cw-tree [nodes]="files" (nodeSelect)="selected.set($event.label)" />
          @if (selected()) { <p class="hint">Selected: <strong>{{ selected() }}</strong></p> }
        </doc-section>

        <doc-section title="5,000 nodes — virtualized"
          description="The visible (expanded) nodes are flattened and rendered through ngx-cerious-scroll, so large trees scroll smoothly."
          [code]="virtualCode">
          <cw-tree [nodes]="bigTree" treeHeight="280px" />
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
  styles: [`.hint { margin-top: 0.75rem; color: var(--cw-text-muted, var(--cw-text-secondary)); }`]
})
export class TreeDocComponent {
  readonly selected = signal('');

  readonly files: CwTreeNode[] = [
    {
      key: 'src', label: 'src', expanded: true, children: [
        { key: 'app', label: 'app', expanded: true, children: [
          { key: 'app.ts', label: 'app.component.ts' },
          { key: 'app.html', label: 'app.component.html' }
        ] },
        { key: 'assets', label: 'assets', children: [{ key: 'logo', label: 'logo.svg' }] }
      ]
    },
    { key: 'pkg', label: 'package.json' }
  ];

  readonly bigTree: CwTreeNode[] = Array.from({ length: 100 }, (_, g) => ({
    key: `g${g}`, label: `Group ${g + 1}`, expanded: true,
    children: Array.from({ length: 50 }, (_, i) => ({ key: `g${g}-${i}`, label: `Node ${g + 1}.${i + 1}` }))
  }));

  basicCode = `<cw-tree [nodes]="files" (nodeSelect)="open($event)" />

files: CwTreeNode[] = [
  { key: 'src', label: 'src', expanded: true, children: [
    { key: 'app', label: 'app.component.ts' }
  ] }
];`;
  virtualCode = `// 5,000 nodes — visible nodes flattened + virtualized with ngx-cerious-scroll
<cw-tree [nodes]="bigTree" treeHeight="280px" />`;

  props = [
    { name: 'nodes', type: 'CwTreeNode[]', default: '[]', description: 'Root nodes; children recurse via node.children.' },
    { name: 'treeHeight', type: 'string', default: `'320px'`, description: 'Viewport height for the (virtualized) list.' },
    { name: 'virtualThreshold', type: 'number', default: '100', description: 'Visible-node count above which the tree virtualizes.' },
    { name: 'showGuides', type: 'boolean', default: 'true', description: 'Show indentation guide lines.' }
  ];
  events = [
    { name: 'nodeSelect', type: 'CwTreeNode', description: 'Emitted when a node row is clicked.' },
    { name: 'nodeToggle', type: 'CwTreeNode', description: 'Emitted when a node is expanded/collapsed.' }
  ];
  tokens = [
    { token: '--cw-primary', description: 'Selected-row accent.' },
    { token: '--cw-surface-hover', description: 'Row hover.' },
    { token: '--cw-border', description: 'Guide lines.' }
  ];
}
