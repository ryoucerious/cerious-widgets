import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/**
 * Seams together addons and a control into one bordered group: prefix/suffix
 * text, icons or buttons around an `cwInput` / `cw-*` control.
 *
 * Styled with `--cw-*` tokens. Wrap addon content in `<span cwInputAddon>` or
 * drop buttons/inputs directly inside.
 *
 * @example
 * <cw-input-group>
 *   <span cwInputAddon>$</span>
 *   <input cwInput placeholder="0.00" />
 *   <button cwButton>Go</button>
 * </cw-input-group>
 */
@Component({
  selector: 'cw-input-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './input-group.component.scss',
  host: { 'class': 'cw-input-group', 'role': 'group' }
})
export class InputGroupComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ inputGroup: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('inputGroup', this.api);
  }
}
