import { booleanAttribute, ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

/**
 * A bordered content panel with a header. Set `toggleable` for a collapsible
 * body (chevron in the header).
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-panel header="Details" toggleable>…</cw-panel>
 */
@Component({
  selector: 'cw-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cw-panel__header" [class.cw-panel__header--toggleable]="toggleable()" (click)="toggleable() && toggle()">
      <span class="cw-panel__title">{{ header() }}</span>
      <ng-content select="[cwPanelActions]" />
      @if (toggleable()) {
        <button
          type="button"
          class="cw-panel__toggle"
          [attr.aria-expanded]="!isCollapsed()"
          aria-label="Toggle panel"
          (click)="$event.stopPropagation(); toggle()"
        >
          <span class="cw-panel__chevron" [class.cw-panel__chevron--collapsed]="isCollapsed()"></span>
        </button>
      }
    </div>
    @if (!isCollapsed()) {
      <div class="cw-panel__body"><ng-content /></div>
    }
  `,
  styleUrl: './panel.component.scss',
  host: { 'class': 'cw-panel' }
})
export class PanelComponent {
  /** The header label. */
  readonly header = input<string>('');
  /** Allow collapsing the body from the header. */
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
