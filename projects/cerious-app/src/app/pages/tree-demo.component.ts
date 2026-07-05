import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwTreeNode, TreeComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-tree-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TreeComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Tree" description="A hierarchical tree — expanded nodes are flattened and virtualized with ngx-cerious-scroll for large data.">
      <app-demo-section title="Basic" [code]="basicCode">
        <div style="width: 100%; max-width: 24rem;">
          <cw-tree [nodes]="files" (nodeSelect)="selected.set($event.label)" />
          <p style="color: var(--cw-text-muted); font-size: 0.875rem; margin-top: 0.75rem;">Selected: {{ selected() }}</p>
        </div>
      </app-demo-section>

      <app-demo-section title="5,000 nodes — virtualized" description="A flat tree of 5,000 children renders only the visible rows." [code]="virtualCode">
        <div style="width: 100%; max-width: 24rem;">
          <cw-tree [nodes]="big" treeHeight="280px" />
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class TreeDemoComponent {
  readonly selected = signal('—');

  files: CwTreeNode[] = [
    {
      key: 'src', label: 'src', icon: 'cw-icon-folder', expanded: true, children: [
        { key: 'app', label: 'app', children: [
          { key: 'main', label: 'main.ts' },
          { key: 'app.cmp', label: 'app.component.ts' }
        ] },
        { key: 'assets', label: 'assets', children: [{ key: 'logo', label: 'logo.svg' }] },
        { key: 'index', label: 'index.html' }
      ]
    },
    { key: 'pkg', label: 'package.json' },
    { key: 'readme', label: 'README.md' }
  ];

  big: CwTreeNode[] = [{
    key: 'root', label: 'All items', expanded: true,
    children: Array.from({ length: 5000 }, (_, i) => ({ key: `n${i}`, label: `Item ${i + 1}` }))
  }];

  basicCode = `<cw-tree [nodes]="files" (nodeSelect)="open($event)" />`;
  virtualCode = `// a large flattened tree is virtualized with ngx-cerious-scroll
<cw-tree [nodes]="big" treeHeight="280px" />`;
}
