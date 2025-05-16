import { ColumnDef } from './column-def';

/**
 * Represents the state of sorting for a grid or table.
 * 
 * @interface SortState
 * 
 * @property {ColumnDef} column - The column definition that is currently being sorted.
 * @property {'asc' | 'desc' | null} direction - The direction of sorting:
 *   - `'asc'` for ascending order.
 *   - `'desc'` for descending order.
 *   - `null` if no sorting is applied.
 */
export interface SortState {
    column: ColumnDef;
    direction: 'asc' | 'desc' | null;
}