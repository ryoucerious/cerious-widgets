import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent } from '../dialog/dialog.component';
import { CwConfirmService } from './confirm.service';

/**
 * The confirmation outlet: renders {@link CwConfirmService} prompts as a
 * modal dialog. Place ONE outlet in the app shell.
 *
 * @example
 * <cw-confirm-dialog />                                       <!-- shell -->
 * const ok = await confirmService.confirm({ message: '…' });  <!-- anywhere -->
 */
@Component({
  selector: 'cw-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogComponent, ButtonComponent],
  template: `
    <cw-dialog
      [header]="request()?.options?.header ?? ''"
      [visible]="isVisible()"
      (visibleChange)="!$event && service.settle(false)"
    >
      {{ request()?.options?.message }}
      <div cwDialogFooter>
        <button cwButton severity="secondary" variant="outlined" (click)="service.settle(false)">
          {{ request()?.options?.rejectLabel }}
        </button>
        <button cwButton [severity]="request()?.options?.danger ? 'danger' : 'primary'" (click)="service.settle(true)">
          {{ request()?.options?.acceptLabel }}
        </button>
      </div>
    </cw-dialog>
  `,
  host: { 'class': 'cw-confirm-dialog' }
})
export class ConfirmDialogComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ confirmDialog: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('confirmDialog', this.api);
  }

  readonly service = inject(CwConfirmService);
  readonly request = this.service.request;
  readonly isVisible = computed(() => this.request() !== null);
}
