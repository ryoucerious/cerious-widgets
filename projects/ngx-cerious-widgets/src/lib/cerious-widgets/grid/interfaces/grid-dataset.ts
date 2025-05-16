import { ColumnDef } from "./column-def";
import { GridRow } from "../models/grid-row";

/**
 * Represents the dataset structure for a grid component.
 */
export interface GridDataset {
    /**
     * Optional aggregated data for the grid.
     */
    aggregateData?: Array<any>;

    /**
     * Rows displayed in the body of the grid.
     */
    bodyRows: GridRow[];

    /**
     * The main dataset for the grid.
     */
    dataset: Array<any>;

    /**
     * Rows displayed in the header of the grid.
     */
    headerRows: GridRow[];

    /**
     * Rows displayed in the footer of the grid.
     */
    footerRows: GridRow[];

    /**
     * Rows used as fillers in the grid.
     */
    fillerRows: GridRow[];

    /**
     * Data for the current page of the grid.
     */
    pageData: Array<any>;

    /**
     * The current page number in the grid.
     */
    pageNumber: number;

    /**
     * List of all pages in the grid.
     */
    pages: Array<any>;

    /**
     * Definitions of columns that are pinned in the grid.
     */
    pinnedColumns: ColumnDef[];

    /**
     * Rows that are currently selected in the grid.
     */
    selectedRows: GridRow[];

    /**
     * Definitions of columns used for sorting the grid.
     */
    sort: ColumnDef[];

    /**
     * Total number of rows in the dataset.
     */
    totalRowCount: number;

    /**
     * List of columns used for grouping the grid data.
     */
    groupByColumns: ColumnDef[];

    /**
     * Data resulting from grouping the grid dataset.
     */
    groupByData: Array<any>;
}