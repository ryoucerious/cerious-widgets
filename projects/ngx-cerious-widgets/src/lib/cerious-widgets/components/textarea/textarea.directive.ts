import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  numberAttribute
} from '@angular/core';

/**
 * Token-styles a native `<textarea>` (via the shared `.cw-input` class) and,
 * with `autoResize`, grows it to fit its content up to `maxRows`.
 *
 * @example
 * <textarea cwTextarea autoResize rows="2" [(ngModel)]="notes"></textarea>
 */
@Directive({
  selector: 'textarea[cwTextarea]',
  standalone: true,
  host: { 'class': 'cw-input cw-textarea' }
})
export class TextareaDirective implements AfterViewInit {
  private readonly el = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);

  /** Grow the textarea to fit its content. */
  readonly autoResize = input(false, { transform: booleanAttribute });
  /** Maximum rows before the textarea scrolls (0 = unbounded). */
  readonly maxRows = input(0, { transform: numberAttribute });

  ngAfterViewInit(): void {
    if (this.autoResize()) {
      // Defer so bound initial content is measured.
      queueMicrotask(() => this.resize());
    }
  }

  @HostListener('input')
  onInput(): void {
    if (this.autoResize()) {
      this.resize();
    }
  }

  private resize(): void {
    const ta = this.el.nativeElement;
    ta.style.height = 'auto';
    let height = ta.scrollHeight;
    const max = this.maxRows();
    if (max > 0) {
      const style = getComputedStyle(ta);
      const lineHeight = parseFloat(style.lineHeight) || 20;
      const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      const cap = lineHeight * max + padding + border;
      if (height > cap) {
        height = cap;
        ta.style.overflowY = 'auto';
      } else {
        ta.style.overflowY = 'hidden';
      }
    } else {
      ta.style.overflowY = 'hidden';
    }
    ta.style.height = `${height}px`;
  }
}
