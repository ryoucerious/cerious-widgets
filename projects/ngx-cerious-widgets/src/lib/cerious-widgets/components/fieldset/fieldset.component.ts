import { booleanAttribute, ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

/**
 * A bordered content group with a legend, optionally collapsible.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-fieldset legend="Billing" toggleable>…</cw-fieldset>
 */
@Component({
  selector: 'cw-fieldset',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cw-fieldset__legend" [class.cw-fieldset__legend--toggleable]="toggleable()">
      @if (toggleable()) {
        <button
          type="button"
          class="cw-fieldset__toggle"
          [attr.aria-expanded]="!isCollapsed()"
          (click)="toggle()"
        >
          <span class="cw-fieldset__chevron" [class.cw-fieldset__chevron--collapsed]="isCollapsed()" aria-hidden="true"></span>
          <span class="cw-fieldset__legend-text">{{ legend() }}</span>
        </button>
      } @else {
        <span class="cw-fieldset__legend-text">{{ legend() }}</span>
      }
    </div>
    @if (!isCollapsed()) {
      <div class="cw-fieldset__content"><ng-content /></div>
    }
  `,
  styleUrl: './fieldset.component.scss',
  host: { 'class': 'cw-fieldset' }
})
export class FieldsetComponent {
  /** The legend label. */
  readonly legend = input<string>('');
  /** Allow collapsing the content from the legend. */
  readonly toggleable = input(false, { transform: booleanAttribute });
  /** Start collapsed (requires `toggleable`). */
  readonly collapsed = input(false, { transform: booleanAttribute });

  /** Emitted with the new collapsed state on every toggle. */
  readonly collapsedChange = output<boolean>();

  private readonly userCollapsed = signal<boolean | undefined>(undefined);
  readonly isCollapsed = (): boolean => this.userCollapsed() ?? this.collapsed();

  toggle(): void {
    const next = !this.isCollapsed();
    this.userCollapsed.set(next);
    this.collapsedChange.emit(next);
  }
}
