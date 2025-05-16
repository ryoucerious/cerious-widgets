import { FilterState } from "./filter-state";
import { SortState } from "./sort-state";

/**
 * Represents a request for grid data, including pagination, sorting, filtering, and grouping information.
 */
export interface GridDataRequest {
  /**
   * The starting row index for the data request.
   */
  startRow: number;

  /**
   * The ending row index for the data request (optional).
   */
  endRow?: number;

  /**
   * The current state of sorting applied to the grid.
   */
  sortState: SortState[];

  /**
   * The current state of filtering applied to the grid.
   */
  filterState: FilterState;

  /**
   * The list of column names to group the data by (optional).
   */
  groupBy?: string[];

  /**
   * The keys representing the current group hierarchy (optional).
   */
  groupKeys?: string[];
}