import { WidgetPlugin } from '../../shared/interfaces/widget-plugin.interface';

/**
 * The Select's public API surface — what plugins are given on init. Plugins must
 * interact with the component only through this contract, never its internals.
 */
export interface SelectApi {
  /** The current value. */
  getValue(): unknown;
  /** Set the value (emits through the form control). */
  setValue(value: unknown): void;
  /** The raw options list. */
  getOptions(): readonly unknown[];
  /** Open the options panel. */
  open(): void;
  /** Close the options panel. */
  close(): void;
  /** Whether the panel is open. */
  isOpen(): boolean;
  /** The component's host element (for decorating/observing the DOM). */
  getHost(): HTMLElement;
}

/**
 * Plugin contract for the Select. Register plugin classes via the `select` block
 * of `WidgetsConfig` (`CeriousWidgetsModule.forRoot({ select: { plugins: [...] } })`).
 */
export type SelectPlugin = WidgetPlugin<SelectApi>;
