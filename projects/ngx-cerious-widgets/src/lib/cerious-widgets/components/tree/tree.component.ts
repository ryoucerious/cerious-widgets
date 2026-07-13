import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  viewChildren
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';
import { WidgetPlugin } from '../../shared/interfaces/widget-plugin.interface';
import { CeriousScrollComponent, CeriousScrollDirective, CeriousScrollItemTemplateDirective } from '@ceriousdevtech/ngx-cerious-scroll';

/** A tree node; `children` makes it a branch. */
export interface CwTreeNode {
  /** Stable key for selection/expansion. */
  key: string;
  label: string;
  /** Optional leading icon class. */
  icon?: string;
  children?: CwTreeNode[];
  /** Start expanded. */
  expanded?: boolean;
  /** Prevent selecting this node. */
  selectable?: boolean;
}

/** A node flattened for rendering, carrying its depth. */
interface CwFlatNode {
  node: CwTreeNode;
  depth: number;
  hasChildren: boolean;
}

/**
 * A hierarchical tree. Expanded nodes are flattened to a single list that is
 * **virtualized with cerious-scroll**, so a tree with thousands of visible
 * nodes stays smooth.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-tree [nodes]="fileTree" (nodeSelect)="open($event)" />
 */
/** Public API the Tree exposes to its plugins. */
export interface TreeApi extends CwWidgetApi {
  /** The key of the selected node, if any. */
  getSelectedKey(): string | null;
  /** Select a node by key. */
  setSelectedKey(key: string | null): void;
  /** The root nodes. */
  getNodes(): readonly CwTreeNode[];
}
/** Plugin contract for the Tree (`{ tree: { plugins: [...] } }`). */
export type TreePlugin = WidgetPlugin<TreeApi>;

@Component({
  selector: 'cw-tree',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, CeriousScrollComponent, CeriousScrollItemTemplateDirective],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
  host: { 'class': 'cw-tree', 'role': 'tree' }
})
export class TreeComponent {
  private readonly scrollDirs = viewChildren(CeriousScrollDirective);

  /** The root nodes. */
  readonly nodes = input<readonly CwTreeNode[]>([]);
  /** Height of the scroll viewport (any CSS length). */
  readonly treeHeight = input<string>('320px');
  /** Virtualize once the flattened list reaches this size. */
  readonly virtualThreshold = input(100, { transform: numberAttribute });
  /** Show a connecting guide line at each indent level. */
  readonly showGuides = input(true, { transform: booleanAttribute });

  /** Emitted when a node is selected. */
  readonly nodeSelect = output<CwTreeNode>();
  /** Emitted when a node expands or collapses. */
  readonly nodeToggle = output<CwTreeNode>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins. */
  readonly api: TreeApi = {
    getHost: () => this.host.nativeElement,
    getSelectedKey: () => this.selectedKey(),
    setSelectedKey: (key: string | null) => this.selectedKey.set(key),
    getNodes: () => this.nodes()
  };

  constructor() {
    providePluginHost('tree', this.api);
  }

  /** Keys of the currently expanded nodes (seeded from `expanded` flags). */
  private readonly expandedKeys = signal<Set<string> | null>(null);
  readonly selectedKey = signal<string | null>(null);

  private readonly effectiveExpanded = computed(() => {
    const explicit = this.expandedKeys();
    if (explicit) {
      return explicit;
    }
    const seed = new Set<string>();
    const walk = (list: readonly CwTreeNode[]) => {
      for (const node of list) {
        if (node.expanded && node.children?.length) {
          seed.add(node.key);
        }
        if (node.children) {
          walk(node.children);
        }
      }
    };
    walk(this.nodes());
    return seed;
  });

  /** The visible nodes, flattened depth-first with their indent level. */
  readonly flatNodes = computed<CwFlatNode[]>(() => {
    const expanded = this.effectiveExpanded();
    const out: CwFlatNode[] = [];
    const walk = (list: readonly CwTreeNode[], depth: number) => {
      for (const node of list) {
        const hasChildren = !!node.children?.length;
        out.push({ node, depth, hasChildren });
        if (hasChildren && expanded.has(node.key)) {
          walk(node.children!, depth + 1);
        }
      }
    };
    walk(this.nodes(), 0);
    return out;
  });

  readonly useVirtual = computed(() => this.flatNodes().length >= this.virtualThreshold());

  isExpanded(node: CwTreeNode): boolean {
    return this.effectiveExpanded().has(node.key);
  }

  toggle(flat: CwFlatNode, event?: Event): void {
    event?.stopPropagation();
    if (!flat.hasChildren) {
      return;
    }
    const next = new Set(this.effectiveExpanded());
    next.has(flat.node.key) ? next.delete(flat.node.key) : next.add(flat.node.key);
    this.expandedKeys.set(next);
    this.nodeToggle.emit(flat.node);
    requestAnimationFrame(() => this.scrollDirs().forEach(dir => dir.render()));
  }

  select(flat: CwFlatNode): void {
    if (flat.node.selectable === false) {
      return;
    }
    this.selectedKey.set(flat.node.key);
    this.nodeSelect.emit(flat.node);
  }

  /** Left padding for a node at the given depth. */
  indent(depth: number): string {
    return `${depth * 1.25 + 0.5}rem`;
  }
}
