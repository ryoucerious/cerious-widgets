import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';
import { AlertComponent } from '../alert/alert.component';
import { CwToastService } from './toast.service';

/** Screen corner the toast stack anchors to. */
export type CwToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/**
 * The toast outlet: renders the {@link CwToastService} queue as floating
 * severity-tinted messages. Place ONE outlet in the app shell.
 *
 * @example
 * <cw-toast />                    <!-- in the shell template -->
 * toast.show({ summary: 'Saved' }) <!-- from anywhere -->
 */
@Component({
  selector: 'cw-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent],
  template: `
    @for (toast of service.toasts(); track toast.id) {
      <cw-alert class="cw-toast__item" [severity]="toast.severity ?? 'info'" closable (closed)="service.dismiss(toast.id)">
        <span class="cw-toast__summary">{{ toast.summary }}</span>
        @if (toast.detail) { <span class="cw-toast__detail">{{ toast.detail }}</span> }
      </cw-alert>
    }
  `,
  styleUrl: './toast.component.scss',
  host: {
    'class': 'cw-toast',
    '[attr.data-position]': 'position()',
    'aria-live': 'polite'
  }
})
export class ToastComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ toast: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('toast', this.api);
  }

  readonly service = inject(CwToastService);

  /** Which screen corner the stack anchors to. */
  readonly position = input<CwToastPosition>('top-right');
}
