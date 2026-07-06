import { Directive, ElementRef, HostListener, inject, input, Renderer2 } from '@angular/core';

/**
 * Declaratively toggles a CSS class on a target element when the host is
 * clicked — handy for menus, accordions, and show/hide without a component.
 *
 * The target is resolved from `cwStyleClass`:
 * - `'@next'` — the host's next element sibling
 * - `'@prev'` — the host's previous element sibling
 * - `'@parent'` — the host's parent element
 * - `'@grandparent'` — the host's parent's parent
 * - any CSS selector — the first document match
 *
 * @example
 * <button [cwStyleClass]="'@next'" toggleClass="cw-open">Menu</button>
 * <ul class="menu">…</ul>
 */
@Directive({
  selector: '[cwStyleClass]',
  standalone: true
})
export class StyleClassDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  /** Target selector or relative keyword (see class docs). */
  readonly cwStyleClass = input.required<string>();
  /** Class to toggle on the resolved target. */
  readonly toggleClass = input<string>('');
  /** Class to add on click (paired with `leaveClass` for one-way transitions). */
  readonly enterClass = input<string>('');
  /** Class to add on a second click / when leaving. */
  readonly leaveClass = input<string>('');

  private entered = false;

  @HostListener('click')
  onClick(): void {
    const target = this.resolveTarget();
    if (!target) {
      return;
    }

    const toggle = this.toggleClass();
    if (toggle) {
      target.classList.toggle(toggle);
      return;
    }

    const enter = this.enterClass();
    const leave = this.leaveClass();
    if (this.entered) {
      if (enter) this.renderer.removeClass(target, enter);
      if (leave) this.renderer.addClass(target, leave);
    } else {
      if (leave) this.renderer.removeClass(target, leave);
      if (enter) this.renderer.addClass(target, enter);
    }
    this.entered = !this.entered;
  }

  private resolveTarget(): HTMLElement | null {
    const selector = this.cwStyleClass();
    const el = this.host.nativeElement;
    switch (selector) {
      case '@next':
        return el.nextElementSibling as HTMLElement | null;
      case '@prev':
        return el.previousElementSibling as HTMLElement | null;
      case '@parent':
        return el.parentElement;
      case '@grandparent':
        return el.parentElement?.parentElement ?? null;
      default:
        return document.querySelector<HTMLElement>(selector);
    }
  }
}
