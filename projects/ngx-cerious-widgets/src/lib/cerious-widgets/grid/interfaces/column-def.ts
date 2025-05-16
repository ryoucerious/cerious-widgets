import { ColumnFormat } from "../enums/column-format.enum";
import { ColumnType } from "../enums/column-type.enum";

/**
 * Represents the definition of a column in a grid.
 */
export interface ColumnDef {
    /**
     * Unique identifier for the column.
     */
    id: string;

    /**
     * The field name associated with the column. Optional for grouped columns.
     */
    field?: string;

    /**
     * The display label for the column.
     */
    label: string;

    /**
     * The header text for the column. Optional.
     */
    header?: string;

    /**
     * The width of the column. Optional for grouped columns.
     */
    width?: string;

    /**
     * The dynamic width of the column, typically used for responsive layouts.
     */
    dynamicWidth?: string;

    /**
     * Indicates whether the column is visible. Defaults to `true` if not specified.
     */
    visible?: boolean;

    /**
     * The alignment of the column content (e.g., left, center, right).
     */
    alignment?: string;

    /**
     * Indicates whether the column is pinned (fixed to the start or end of the grid).
     */
    pinned?: boolean;

    /**
     * Indicates whether the column is the last pinned column in the grid.
     */
    lastPinned?: boolean;

    /**
     * Indicates whether the column is used for grouping.
     */
    groupBy?: boolean;

    /**
     * The parent column definition, used for hierarchical or grouped columns.
     */
    parent?: ColumnDef;

    /**
     * The child column definitions, used for hierarchical or grouped columns.
     */
    children?: ColumnDef[];

    /**
     * The template used for rendering the cell content.
     */
    cellTemplate?: string;

    /**
     * The template used for rendering the footer cell content.
     */
    footerCellTemplate?: string;

    /**
     * The template used for rendering the header cell content.
     */
    headerCellTemplate?: string;

    /**
     * Indicates whether the column is editable.
     */
    editable?: boolean;

    /**
     * Indicates whether the column supports filtering.
     */
    filterable?: boolean;

    /**
     * Indicates whether the column supports sorting.
     */
    sortable?: boolean;

    /**
     * Indicates whether the column can be resized.
     */
    resizable?: boolean;

    /**
     * Indicates whether the column can be dragged to reorder.
     */
    draggable?: boolean;

    /**
     * Indicates whether the column can be pinned.
     */
    pinnable?: boolean;

    /**
     * Indicates whether the column can be grouped.
     */
    groupable?: boolean;

    /**
     * Options for select or dropdown values in the column.
     */
    valueOptions?: any;

    /**
     * The type of data represented by the column (e.g., string, number, date, boolean).
     */
    type?: ColumnType;

    /**
     * The format applied to the column data (e.g., currency, percentage, stars).
     */
    format?: ColumnFormat;

    /**
     * Additional options for formatting the column data.
     */
    formatOptions?: any;
}