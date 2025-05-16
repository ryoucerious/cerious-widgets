import { ElementRef } from "@angular/core";

/**
 * Represents an event occurring on a grid cell.
 *
 * @template T - The type of the event.
 *
 * @property elementRef - An optional reference to the DOM element associated with the cell.
 * @property event - The event object of type `T` that triggered the cell event.
 * @property field - An optional string representing the field or column key associated with the cell.
 * @property row - An optional object representing the row data associated with the cell.
 * @property value - An optional value representing the content or data of the cell.
 */
export interface CellEvent<T> {
    elementRef?: ElementRef
    event: T;
    field?: string;
    row?: any,
    value?: any
}
