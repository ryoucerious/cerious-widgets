import { booleanAttribute, ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

/**
 * Click-to-edit: shows a compact display until activated, then reveals the
 * editable content (`[cwInplaceEditor]`). Emits on open/close.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-inplace>
 *   <span cwInplaceDisplay>Click to edit</span>
 *   <input cwInplaceEditor cwInput />
 * </cw-inplace>
 */
@Component({
  selector: 'cw-inplace',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!active()) {
      <button type="button" class="cw-inplace__display" (click)="open()">
        <ng-content select="[cwInplaceDisplay]" />
      </button>
    } @else {
      <div class="cw-inplace__editor">
        <ng-content select="[cwInplaceEditor]" />
        @if (closable()) {
          <button type="button" class="cw-inplace__close" aria-label="Close" (click)="close()">
            <span class="cw-inplace__close-x" aria-hidden="true"></span>
          </button>
        }
      </div>
    }
  `,
  styleUrl: './inplace.component.scss',
  host: { 'class': 'cw-inplace' }
})
export class InplaceComponent {
  /** Prevent activation. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Show a close (✕) button in editor mode. */
  readonly closable = input(true, { transform: booleanAttribute });

  /** Emitted when the editor opens. */
  readonly opened = output<void>();
  /** Emitted when the editor closes. */
  readonly closed = output<void>();

  readonly active = signal(false);

  open(): void {
    if (this.disabled() || this.active()) {
      return;
    }
    this.active.set(true);
    this.opened.emit();
  }

  close(): void {
    if (!this.active()) {
      return;
    }
    this.active.set(false);
    this.closed.emit();
  }
}
