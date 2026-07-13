import { WidgetPlugin } from './widget-plugin.interface';

/**
 * The minimal public API every cerious-widgets component exposes to its plugins.
 * Even purely presentational components provide this, so a plugin can always at
 * least observe/decorate the host element. Richer components extend it (see
 * {@link CwFormControlApi}) or define their own bespoke API.
 */
export interface CwWidgetApi {
  /** The component's host element, for decorating or observing the DOM. */
  getHost(): HTMLElement;
}

/**
 * Public API shared by value-bearing (ControlValueAccessor) components — inputs,
 * toggles, sliders, etc. Plugins can read and set the value through the same
 * path the form control uses.
 *
 * @typeParam T - The component's value type.
 */
export interface CwFormControlApi<T = unknown> extends CwWidgetApi {
  /** The current value. */
  getValue(): T;
  /** Set the value (emits through the form control). */
  setValue(value: T): void;
  /** Whether the control is currently disabled. */
  isDisabled(): boolean;
}

/** Convenience plugin contract for a component exposing {@link CwWidgetApi}. */
export type CwWidgetPlugin = WidgetPlugin<CwWidgetApi>;
/** Convenience plugin contract for a value-bearing component. */
export type CwFormControlPlugin<T = unknown> = WidgetPlugin<CwFormControlApi<T>>;
