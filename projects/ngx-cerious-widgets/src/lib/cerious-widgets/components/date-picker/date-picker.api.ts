import { WidgetPlugin } from '../../shared/interfaces/widget-plugin.interface';

/**
 * The DatePicker's public API surface — what plugins are given. Plugins must
 * never reach into component internals.
 */
export interface DatePickerApi {
  /** The currently selected date, if any. */
  getValue(): Date | null;
  /** Replace the selection (emits through the form control). */
  setValue(value: Date | null): void;
  /** Open the calendar panel. */
  open(): void;
  /** Close the calendar panel. */
  close(): void;
  /** Whether the panel is open. */
  isOpen(): boolean;
  /** Navigate the visible calendar to a month (0-based) and year. */
  navigateTo(month: number, year: number): void;
}

/**
 * Plugin contract for the DatePicker. Register plugin classes via the
 * `datePicker.plugins` block of `WidgetsConfig`.
 */
export interface DatePickerPlugin extends WidgetPlugin<DatePickerApi> {
  /** Called after the calendar panel opens. */
  onOpen?(): void;
  /** Called after the calendar panel closes. */
  onClose?(): void;
  /** Called when the visible month changes. */
  onMonthChange?(month: number, year: number): void;
}
