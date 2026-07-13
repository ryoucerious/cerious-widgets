import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/**
 * A horizontal action bar with start / center / end slots
 * (`[cwToolbarStart]`, `[cwToolbarCenter]`, `[cwToolbarEnd]`).
 *
 * Styled with `--cw-*` tokens.
 *
 * @example
 * <cw-toolbar>
 *   <div cwToolbarStart><button cwButton>New</button></div>
 *   <div cwToolbarEnd><button cwButton severity="secondary" variant="outlined">Export</button></div>
 * </cw-toolbar>
 */
@Component({
  selector: 'cw-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cw-toolbar__section cw-toolbar__start"><ng-content select="[cwToolbarStart]" /></div>
    <div class="cw-toolbar__section cw-toolbar__center"><ng-content select="[cwToolbarCenter]" /></div>
    <div class="cw-toolbar__section cw-toolbar__end"><ng-content select="[cwToolbarEnd]" /></div>
  `,
  styleUrl: './toolbar.component.scss',
  host: { 'class': 'cw-toolbar', 'role': 'toolbar' }
})
export class ToolbarComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ toolbar: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('toolbar', this.api);
  }
}
