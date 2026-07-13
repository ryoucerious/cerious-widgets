import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/** One breadcrumb entry; items with a `url` render as links. */
export interface CwBreadcrumbItem {
  label: string;
  url?: string;
}

/**
 * A breadcrumb trail with chevron separators. Items with a `url` render as
 * primary-coloured links; the last item is the current page.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-breadcrumb [items]="[
 *   { label: 'Home', url: '/' },
 *   { label: 'Products', url: '/products' },
 *   { label: 'Item' }
 * ]" />
 */
@Component({
  selector: 'cw-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  host: {
    'class': 'cw-breadcrumb',
    'role': 'navigation',
    'aria-label': 'breadcrumb'
  }
})
export class BreadcrumbComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ breadcrumb: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('breadcrumb', this.api);
  }

  /** The trail, in order; the last item is the current page. */
  readonly items = input<readonly CwBreadcrumbItem[]>([]);
}
