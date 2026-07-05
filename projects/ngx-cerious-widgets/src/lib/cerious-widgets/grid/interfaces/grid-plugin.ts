import { WidgetPlugin } from "../../shared/interfaces/widget-plugin.interface";
import { GridApi } from "./grid-api";

/**
 * Interface representing a plugin for a grid component.
 * Provides lifecycle hooks and event handlers for interacting with the grid.
 *
 * Extends the generic {@link WidgetPlugin} contract (shared across all
 * cerious-widgets components) with grid-specific row, cell, and data hooks.
 * The `onInit`, `afterInit`, and `onDestroy` lifecycle hooks are inherited.
 */
export interface GridPlugin extends WidgetPlugin<GridApi> {
    /**
     * Optional handler triggered when a row is clicked.
     * @param row - The data of the clicked row.
     */
    onRowClick?(row: any): void;

    /**
     * Optional handler triggered when a cell is clicked.
     * @param cell - The data of the clicked cell.
     */
    onCellClick?(cell: any): void;

    /**
     * Optional handler triggered when a row is double-clicked.
     * @param row - The data of the double-clicked row.
     */
    onRowDoubleClick?(row: any): void;

    /**
     * Optional handler triggered when a cell is double-clicked.
     * @param cell - The data of the double-clicked cell.
     */
    onCellDoubleClick?(cell: any): void;

    /**
     * Optional handler triggered when data is loaded into the grid.
     * @param data - The loaded data.
     */
    onDataLoad?(data: any): void;

    /**
     * Optional handler triggered when data in the grid is updated.
     * @param data - The updated data.
     */
    onDataUpdate?(data: any): void;

    /**
     * Optional handler triggered when data is deleted from the grid.
     * @param data - The deleted data.
     */
    onDataDelete?(data: any): void;

    /**
     * Optional handler triggered when new data is added to the grid.
     * @param data - The added data.
     */
    onDataAdd?(data: any): void;

    /**
     * Optional handler triggered when the grid data is refreshed.
     * @param data - The refreshed data.
     */
    onDataRefresh?(data: any): void;
}