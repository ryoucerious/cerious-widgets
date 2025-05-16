import { ElementRef } from "@angular/core";
import { Observable } from "rxjs";
import { ColumnDef } from "./column-def";
import { PluginOptions } from "./plugin-options";
import { SortState } from "./sort-state";
import { GridDataRequest } from "./grid-data-request";
import { GridDataResponse } from "./grid-data-response";
import { FilterState } from "./filter-state";
import { GridOptions } from "./grid-options";

/**
 * Interface representing the API for interacting with a grid component.
 */
export interface GridApi {
  // === Grouping ===

  /**
   * Adds a column to the group-by configuration.
   * @param column The column definition to group by.
   */
  addGroupByColumn(column: ColumnDef): void;

  /**
   * Removes a column from the group-by configuration.
   * @param column The column definition to remove from grouping.
   */
  removeGroupByColumn(column: ColumnDef): void;

  /**
   * Retrieves the list of columns currently used for grouping.
   * @returns An array of columns.
   */
  getGroupByColumns(): ColumnDef[];

  /**
   * Registers a callback to be executed after grouping is applied.
   * @param callback The callback function to execute after grouping is applied.
   * @returns 
   */
  afterGroupBy: (callback: () => void) => () => void;

  // === Sorting ===

  /**
   * Applies sorting to the grid based on the provided sort state.
   * @param sortState An array of sort state objects.
   */
  applySorting(sortState: SortState[]): void;

  /**
   * Retrieves the current sort state of the grid.
   * @returns An array of sort state objects.
   */
  getSortState(): SortState[];
  
  /**
   * Sets a custom sorting function for the grid.
   * @param fn The custom sorting function to set.
   */
  setSortFunction(fn: (data: any[], sortState: SortState[]) => any[]): void;

  /**
   * Registers a callback to be executed after sorting is applied.
   * @param callback The callback function to execute.
   * @returns A function to unregister the callback.
   */
  afterApplySorting(callback: () => void): () => void;

  // === Filtering ===

  /**
   * Applies a filter to the grid based on the provided filter state.
   * @param filterState The filter state to apply.
   */
  applyFilter(filterState: FilterState): void;

  /**
   * Retrieves the current filter state of the grid.
   * @returns The current filter state or an empty object.
   */
  getFilterState(): FilterState | {};

  /**
   * Sets a custom filtering function for the grid.
   * @param fn The custom filtering function to set.
   */
  setFilterFunction(fn: (data: any[], filterState: FilterState) => any[]): void;

  /**
   * Registers a callback to be executed after filtering is applied.
   * @param callback The callback function to execute.
   * @returns A function to unregister the callback.
   */
  afterApplyFilter(callback: () => void): () => void;

  // === Column Management ===

  /**
   * Retrieves the column definitions for the grid.
   * @returns An array of column definitions.
   */
  getColumnDefs(): ColumnDef[];

  /**
   * Sets the column definitions for the grid.
   * @param columnDefs An array of column definitions to set.
   */
  setColumnDefs(columnDefs: ColumnDef[]): void;

  /**
   * Registers a callback to be executed after the column definitions are set.
   * @param callback The callback function to execute.
   * @returns A function to unregister the callback.
   */
  afterSetColumnDefs: (callback: () => void) => () => void;

  /**
   * Retrieves the flattened column definitions for the grid.
   * @returns An array of flattened column definitions.
   */
  getFlattenedColumnDefs(): ColumnDef[];

  // === Column Headers ===

  /**
   * Retrieves the HTML elements representing the column headers.
   * @returns An array of HTML elements for the column headers.
   */
  getColumnHeaders(): HTMLElement[];

  /**
   * Retrieves the reference to a specific column header by its ID.
   * @param id The ID of the column header.
   * @returns The ElementRef of the column header or null if not found.
   */
  getColumnHeader(id: string): ElementRef | null;

  // === Column Visibility ===

  /**
   * Hides a column by its ID.
   * @param id The ID of the column to hide.
   */
  hideColumn(id: string): void;

  /**
   * Shows a column by its ID.
   * @param id The ID of the column to show.
   */
  showColumn(id: string): void;

  /**
   * Checks if a column is visible by its ID.
   * @param id The ID of the column.
   * @returns True if the column is visible, otherwise false.
   */
  isColumnVisible(id: string): boolean;

  // === Row Management ===

  /**
   * Expands a row by its ID.
   * @param id The ID of the row to expand.
   */
  expandRow(id: string | number): void;

  /**
   * Collapses a row by its ID.
   * @param id The ID of the row to collapse.
   */
  collapseRow(id: string | number): void;

  /**
   * Checks if a row is expanded by its ID.
   * @param id The ID of the row.
   * @returns True if the row is expanded, otherwise false.
   */
  isRowExpanded(id: string | number): boolean;

  // === Selection Management ===

  /**
   * Retrieves the currently selected rows.
   * @returns An array of selected rows.
   */
  getSelectedRows(): any[];

  /**
   * Selects a row by its ID.
   * @param id The ID of the row to select.
   */
  selectRow(id: string | number): void;

  /**
   * Deselects a row by its ID.
   * @param id The ID of the row to deselect.
   */
  deselectRow(id: string | number): void;

  /**
   * Selects all rows in the grid.
   */
  selectAllRows(): void;

  /**
   * Deselects all rows in the grid.
   */
  deselectAllRows(): void;

  // === Pagination ===

  /**
   * Retrieves the current page number.
   * @returns The current page number.
   */
  getCurrentPage(): number;

  /**
   * Sets the current page number.
   * @param page The page number to set.
   */
  setCurrentPage(page: number): void;

  /**
   * Retrieves the total number of pages.
   * @returns The total number of pages or null if not available.
   */
  getTotalPages(): number | null;

  /**
   * Sets the page size for pagination.
   * @param size The number of rows per page.
   */
  setPageSize(size: number): void;

  /**
   * Retrieves the current page size.
   * @returns The page size or null if not available.
   */
  getPageSize(): number | null;

  // === Grid Options ===

  /**
   * Retrieves the grid options.
   * @returns The grid options object.
   */
  getGridOptions(): GridOptions;

  // === Data Management ===

  /**
   * Retrieves the current data displayed in the grid.
   * @returns An array of data rows.
   */
  getData(): any[];

  /**
   * Sets the data to be displayed in the grid.
   * @param data The data array to set.
   * @param totalRowCount Optional total row count for pagination.
   */
  setData(data: any[], totalRowCount?: number): void;

  /**
   * Retrieves the original data before any modifications.
   * @returns An array of the original data rows.
   */
  getOriginalData(): any[];

  /**
   * Resets the grid data to the original data.
   */
  resetToOriginalData(): void;

  /**
   * Sets the total count of data rows.
   * @param totalCount The total count of rows.
   */
  setDataTotalCount(totalCount: number): void;

  // === State Management ===

  /**
   * Retrieves the current state of the grid.
   * @returns The current state object.
   */
  getState(): any;

  /**
   * Sets the state of the grid.
   * @param state The state object to set.
   */
  setState(state: any): void;

  // === Rendering and Resizing ===

  /**
   * Refreshes the grid rendering.
   */
  refresh(): void;

  
  /**
   * Resests the scroll position of the grid to the top.
   */
  resetScrollPosition(): void;

  /**
   * Resizes the grid to fit its container.
   */
  resize(): void;

  // === Plugin Management ===

  /**
   * Retrieves the plugin options for the grid.
   * @returns The plugin options object.
   */
  getPluginOptions(): PluginOptions;

  /**
   * Retrieves the reference to the plugin bar element.
   * @returns The ElementRef of the plugin bar.
   */
  getPluginBar(): ElementRef | null;

  // === Event Hooks ===

  /**
   * Registers a callback to be executed after a column reorder.
   * @param callback The callback function to execute.
   * @returns A function to unregister the callback.
   */
  afterColumnReorder(callback: () => void): () => void;

  /**
   * Registers a callback to be executed after pinned columns are updated.
   * @param callback The callback function to execute.
   * @returns A function to unregister the callback.
   */
  afterPinnedColumnsUpdated(callback: () => void): () => void;

  /**
   * Registers a callback to be executed after the grid is rendered.
   * @param callback The callback function to execute.
   * @returns A function to unregister the callback.
   */
  afterRender(callback: () => void): () => void;

  /**
   * Registers a callback to be executed after the grid is resized.
   * @param callback The callback function to execute.
   * @returns A function to unregister the callback.
   */
  afterResize(callback: () => void): () => void;

  /**
   * Registers a callback to be executed after the grid is scrolled.
   * @param callback The callback function to execute.
   * @returns A function to unregister the callback.
   */
  afterScroll(callback: () => void): () => void;

  // === Pinned Columns ===

  /**
   * Updates the toggled pinned columns in the grid.
   */
  updateToggledPinnedCols(): void;

  // === Grid Container ===

  /**
   * Retrieves the reference to the grid container element.
   * @returns The ElementRef of the grid container.
   */
  getContainer(): ElementRef;

  // === Data Request (Optional) ===

  /**
   * Optional method to request data for the grid.
   * @param request The data request object.
   * @returns An observable of the data response.
   */
  requestData?: (request: GridDataRequest) => Observable<GridDataResponse>;

  // === Custom Events ===

  /**
   * Registers a callback for the row click event.
   * @param callback The callback function to execute.
   */
  onRowClick?: (callback: Function) => void;

  /**
   * Registers a callback for the cell click event.
   * @param callback The callback function to execute.
   */
  onCellClick?: (callback: Function) => void;

  /**
   * Registers a callback for the row double-click event.
   * @param callback The callback function to execute.
   */
  onRowDoubleClick?: (callback: Function) => void;

  /**
   * Registers a callback for the cell double-click event.
   * @param callback The callback function to execute.
   */
  onCellDoubleClick?: (callback: Function) => void;

  /**
   * Registers a callback for the column resize event.
   * @param callback The callback function to execute.
   */
  onColumnResize?: (callback: Function) => void;

  /**
   * Registers a callback for the column visibility change event.
   * @param callback The callback function to execute.
   */
  onColumnVisibilityChange: (callback: Function) => void;
}