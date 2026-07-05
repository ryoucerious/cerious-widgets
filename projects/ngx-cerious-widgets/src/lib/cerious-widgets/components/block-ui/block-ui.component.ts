import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

/**
 * Overlays its projected content with a scrim (and optional spinner) while
 * `blocked` is true — for loading or disabled regions. The host must be a
 * positioned context; the component sets `position: relative` on itself.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-block-ui [blocked]="saving">
 *   <form>…</form>
 * </cw-block-ui>
 */
@Component({
  selector: 'cw-block-ui',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpinnerComponent],
  template: `
    <ng-content />
    @if (blocked()) {
      <div class="cw-block-ui__mask" [attr.aria-busy]="true">
        @if (showSpinner()) {
          <cw-spinner />
        }
        <ng-content select="[cwBlockUiContent]" />
      </div>
    }
  `,
  styleUrl: './block-ui.component.scss',
  host: { 'class': 'cw-block-ui' }
})
export class BlockUiComponent {
  /** Block (overlay) the content. */
  readonly blocked = input(false, { transform: booleanAttribute });
  /** Show a spinner in the centre of the mask. */
  readonly showSpinner = input(true, { transform: booleanAttribute });
}
