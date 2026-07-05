import { Directive } from '@angular/core';

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
export class InputTextDirective {}
