import { Directive, ElementRef, inject } from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/**
 * Token-styles a native text input (or textarea) — border, focus ring,
 * placeholder and disabled state all follow the active theme. Being a
 * directive on the real element keeps forms, keyboard and a11y native.
 *
 * @example
 * <input cwInput placeholder="Enter text..." [(ngModel)]="name" />
 * <textarea cwInput rows="4"></textarea>
 */
@Directive({
  selector: 'input[cwInput], textarea[cwInput]',
  standalone: true,
  host: { 'class': 'cw-input' }
})
export class InputTextDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ inputText: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('inputText', this.api);
  }
}
