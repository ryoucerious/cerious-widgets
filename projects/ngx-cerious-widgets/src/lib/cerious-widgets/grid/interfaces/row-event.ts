import { ElementRef } from "@angular/core";

/**
 * Represents an event associated with a specific row in a grid.
 *
 * @template T - The type of the event object.
 *
 * @property event - The event object of type `T` associated with the row.
 * @property row - (Optional) The data object representing the row.
 * @property elementRef - (Optional) A reference to the DOM element associated with the row.
 */
export interface RowEvent<T> {
    event: T;
    row?: any,
    elementRef?: ElementRef
}
