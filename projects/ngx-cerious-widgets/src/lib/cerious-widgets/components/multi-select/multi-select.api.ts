import { WidgetPlugin } from '../../shared/interfaces/widget-plugin.interface';

/**
 * The MultiSelect's public API surface — what plugins are given. Plugins must
 * never reach into component internals.
 */
export interface MultiSelectApi {
  /** The currently selected values. */
  getValue(): unknown[];
  /** Replace the selection (emits through the form control). */
  setValue(value: unknown[]): void;
  /** Open the options panel. */
  open(): void;
  /** Close the options panel. */
  close(): void;
  /** Whether the panel is open. */
  isOpen(): boolean;
  /** The raw options list. */
  getOptions(): readonly unknown[];
  /** Set the filter term (as if typed into the filter box). */
  setFilter(term: string): void;
}

/**
 * Plugin contract for the MultiSelect. Register plugin classes via the
 * `multiSelect.plugins` block of `WidgetsConfig`.
 */
export interface MultiSelectPlugin extends WidgetPlugin<MultiSelectApi> {
  /** Called after the options panel opens. */
  onOpen?(): void;
  /** Called after the options panel closes. */
  onClose?(): void;
}
