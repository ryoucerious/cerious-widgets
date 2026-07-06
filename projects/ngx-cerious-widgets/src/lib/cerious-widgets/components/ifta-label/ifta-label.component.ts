import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * "In-Filled Top-Aligned" label: a small label pinned to the top of the field,
 * with the control sitting below it inside the same bordered box. Unlike
 * {@link FloatLabelComponent} the label does not move — it is always shown.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-ifta-label label="Email">
 *   <input cwInput [(ngModel)]="email" />
 * </cw-ifta-label>
 */
@Component({
  selector: 'cw-ifta-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="cw-ifta-label__label">{{ label() }}</label>
    <ng-content />
  `,
  styleUrl: './ifta-label.component.scss',
  host: { 'class': 'cw-ifta-label' }
})
export class IftaLabelComponent {
  /** The label text. */
  readonly label = input<string>('');
}
