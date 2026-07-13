import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  Directive,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/** A node in the org chart. */
export interface CwOrgNode {
  /** Stable key for selection. */
  key?: string;
  label: string;
  /** Optional secondary line. */
  subtitle?: string;
  children?: CwOrgNode[];
}

/**
 * Marks a custom node template for {@link OrgChartComponent}:
 * `<ng-template cwOrgNode let-node>…</ng-template>`.
 */
@Directive({ selector: '[cwOrgNode]', standalone: true })
export class OrgNodeDirective {
  readonly template = inject(TemplateRef<unknown>);
}

/**
 * A top-down hierarchical organisation chart: each node is a card connected to
 * its children by lines. Provide a custom card via `[cwOrgNode]` or use the
 * default label / subtitle rendering.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-org-chart [root]="ceo" (nodeSelect)="open($event)" />
 */
@Component({
  selector: 'cw-org-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './org-chart.component.html',
  styleUrl: './org-chart.component.scss',
  host: { 'class': 'cw-org-chart' }
})
export class OrgChartComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ orgChart: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('orgChart', this.api);
  }

  readonly nodeTemplate = contentChild(OrgNodeDirective);

  /** The root node of the hierarchy. */
  readonly root = input<CwOrgNode | null>(null);

  /** Emitted when a node card is clicked. */
  readonly nodeSelect = output<CwOrgNode>();

  readonly selectedKey = signal<string | null>(null);

  nodeId(node: CwOrgNode): string {
    return node.key ?? node.label;
  }

  select(node: CwOrgNode): void {
    this.selectedKey.set(this.nodeId(node));
    this.nodeSelect.emit(node);
  }

  isSelected(node: CwOrgNode): boolean {
    return this.selectedKey() === this.nodeId(node);
  }
}
