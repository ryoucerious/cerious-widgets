import { booleanAttribute, ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

/**
 * A compact element for an input, attribute or filter value — like a Tag but
 * interactive: optionally removable (✕ button emits `remove` and hides the
 * chip) and able to carry a leading image or icon.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-chip label="Angular" />
 * <cw-chip label="Amy Adams" image="amy.png" removable (remove)="onRemove()" />
 */
@Component({
  selector: 'cw-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  host: {
    'class': 'cw-chip',
    '[class.cw-chip--hidden]': 'hidden()'
  }
})
export class ChipComponent {
  /** The chip text. */
  readonly label = input<string>('');
  /** Optional leading image URL (rendered as a small round avatar). */
  readonly image = input<string>('');
  /** Optional leading icon class (used when no image is set). */
  readonly icon = input<string>('');
  /** Show a ✕ button that removes the chip. */
  readonly removable = input(false, { transform: booleanAttribute });

  /** Emitted when the ✕ button is clicked. */
  readonly remove = output<void>();

  readonly hidden = signal(false);

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.hidden.set(true);
    this.remove.emit();
  }
}
