import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input
} from '@angular/core';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
  'textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';

/**
 * Keeps keyboard focus cycling within the host element — Tab past the last
 * focusable wraps to the first, Shift+Tab before the first wraps to the last.
 * A dependency-free trap for custom overlays, popovers, and inline panels.
 *
 * @example
 * <div cwFocusTrap>
 *   <input /> <button>OK</button>
 * </div>
 */
@Directive({
  selector: '[cwFocusTrap]',
  standalone: true
})
export class FocusTrapDirective implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Disable the trap without removing the directive. */
  readonly disabled = input(false, { transform: booleanAttribute, alias: 'cwFocusTrapDisabled' });
  /** Move focus to the first focusable element on init. */
  readonly autoFocus = input(true, { transform: booleanAttribute, alias: 'cwFocusTrapAutoFocus' });

  ngAfterViewInit(): void {
    if (!this.disabled() && this.autoFocus()) {
      this.focusable()[0]?.focus();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || this.disabled()) {
      return;
    }
    const items = this.focusable();
    if (items.length === 0) {
      event.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !this.host.nativeElement.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /** Currently visible, focusable descendants in DOM order. */
  focusable(): HTMLElement[] {
    return Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el.getClientRects().length > 0
    );
  }
}
