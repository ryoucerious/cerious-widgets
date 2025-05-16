import { ElementRef } from "@angular/core";
import { ColumnDef } from "../interfaces/column-def";

/**
 * Represents a row in the grid.
 */
export class GridRow {
    /**
     * A unique identifier for the grid row.
     */
    id: string;

    /**
     * The data associated with the row.
     */
    row: any;

    /**
     * The column definitions for the row.
     */
    columnDefs: ColumnDef[];

    /**
     * Indicates whether the nested row is expanded.
     * Optional.
     */
    nestedExpanded?: boolean;

    /**
     * Indicates whether the row is selected.
     * Optional.
     */
    selected?: boolean;

    /**
     * A reference to the DOM element associated with the row.
     * Optional.
     */
    elementRef?: ElementRef;

    /**
     * The nested HTML element associated with the row.
     * Optional.
     */
    nestedElement?: HTMLElement;

    /**
     * Creates an instance of GridRow.
     * 
     * @param data - The data used to initialize the grid row.
     */
    constructor(data: any) {
        this.id = Math.random().toString(36).substring(2, 9);
        this.row = data.row;
        this.columnDefs = data.columnDefs;
        this.nestedExpanded = data.nestedExpanded;
    }
}
