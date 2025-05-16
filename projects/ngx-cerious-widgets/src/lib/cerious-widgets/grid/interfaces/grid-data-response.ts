/**
 * Represents the response structure for grid data.
 * 
 * @interface GridDataResponse
 * 
 * @property {any[]} data - An array containing the grid data items.
 * @property {number} totalCount - The total number of items available in the grid.
 */
export interface GridDataResponse {
  data: any[];
  totalCount: number;
}