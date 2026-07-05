import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal
} from '@angular/core';

/**
 * A collapsible panel: a header button that toggles its projected content.
 * Place panels inside `cw-accordion` to get single-open (exclusive) behaviour;
 * standalone panels toggle independently.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-accordion>
 *   <cw-accordion-panel header="Section 1" expanded>…</cw-accordion-panel>
 *   <cw-accordion-panel header="Section 2">…</cw-accordion-panel>
 * </cw-accordion>
 */
@Component({
  selector: 'cw-accordion-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accordion-panel.component.html',
  styleUrl: './accordion-panel.component.scss',
  host: {
    'class': 'cw-accordion-panel',
    '[class.cw-accordion-panel--expanded]': 'isExpanded()'
  }
})
export class AccordionPanelComponent {
  private readonly accordion = inject(AccordionComponent, { optional: true });

  constructor() {
    this.accordion?.registerPanel(this);
    inject(DestroyRef).onDestroy(() => this.accordion?.unregisterPanel(this));
  }

  /** The header label. */
  readonly header = input<string>('');
  /** Start expanded. */
  readonly expanded = input(false, { transform: booleanAttribute });
  /** Disable toggling. */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Emitted with the new state whenever the panel is toggled. */
  readonly expandedChange = output<boolean>();

  private readonly userExpanded = signal<boolean | undefined>(undefined);

  readonly isExpanded = (): boolean => this.userExpanded() ?? this.expanded();

  toggle(): void {
    if (this.disabled()) {
      return;
    }
    const next = !this.isExpanded();
    if (next) {
      this.accordion?.notifyOpened(this);
    }
    this.userExpanded.set(next);
    this.expandedChange.emit(next);
  }

  /** Collapse without emitting a user toggle (parent exclusivity). */
  collapse(): void {
    if (this.isExpanded()) {
      this.userExpanded.set(false);
      this.expandedChange.emit(false);
    }
  }
}

/**
 * Groups {@link AccordionPanelComponent}s; unless `multiple` is set, opening
 * one panel collapses its siblings.
 */
@Component({
  selector: 'cw-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: `:host { display: flex; flex-direction: column; gap: 0.75rem; }`,
  host: { 'class': 'cw-accordion' }
})
export class AccordionComponent {
  /** Allow several panels to be open at once. */
  readonly multiple = input(false, { transform: booleanAttribute });

  private readonly panels = new Set<AccordionPanelComponent>();

  registerPanel(panel: AccordionPanelComponent): void {
    this.panels.add(panel);
  }

  unregisterPanel(panel: AccordionPanelComponent): void {
    this.panels.delete(panel);
  }

  notifyOpened(opened: AccordionPanelComponent): void {
    if (this.multiple()) {
      return;
    }
    for (const panel of this.panels) {
      if (panel !== opened) {
        panel.collapse();
      }
    }
  }
}
