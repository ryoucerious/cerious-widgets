import { ColumnDef, ColumnType } from 'ngx-cerious-widgets';
import { MOCK_DATA } from '../../testing/mock-data';

/** Full 1,000,000-row dataset (used by the Virtual Scroll page). */
export const GRID_DATA_LARGE = MOCK_DATA;

/** Small sample used by the feature demos. */
export const GRID_DATA = MOCK_DATA.slice(0, 200);

const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Garden', 'Toys', 'Sports', 'Automotive'];
const statuses = ['Active', 'Inactive', 'Pending', 'Discontinued'];

export const categoryOptions = categories.map(c => ({ id: c, value: c }));
export const statusOptions = statuses.map(s => ({ id: s, value: s }));

/**
 * Fresh, clean, read-only column set. Returns new objects each call so a
 * feature page can safely tweak (pin / make editable / attach a template)
 * without mutating another page's columns.
 */
export function baseColumns(): ColumnDef[] {
  // Capabilities enabled so sorting / filtering / grouping / pinning / reorder
  // all work; individual feature pages layer their specifics on top.
  const caps = { sortable: true, filterable: true, resizable: true, draggable: true, pinnable: true, groupable: true, alignment: 'left' };
  return [
    { id: 'id', field: 'id', label: 'ID', type: ColumnType.Number, width: '80px', ...caps },
    { id: 'name', field: 'name', label: 'Name', type: ColumnType.String, ...caps },
    { id: 'category', field: 'category', label: 'Category', type: ColumnType.String, ...caps },
    { id: 'price', field: 'price', label: 'Price', type: ColumnType.Number, format: 'currency' as any, ...caps },
    { id: 'date', field: 'date', label: 'Created', type: ColumnType.Date, ...caps },
    { id: 'status', field: 'status', label: 'Status', type: ColumnType.String, ...caps },
    { id: 'stock', field: 'stock', label: 'Stock', type: ColumnType.Number, ...caps },
    { id: 'rating', field: 'rating', label: 'Rating', type: ColumnType.Number, format: 'stars' as any, ...caps }
  ] as ColumnDef[];
}

/** Severity for a status value (drives the status Tag in the templates demo). */
export function statusSeverity(status: string): 'success' | 'warn' | 'danger' | 'neutral' {
  switch (status) {
    case 'Active': return 'success';
    case 'Pending': return 'warn';
    case 'Discontinued': return 'danger';
    default: return 'neutral';
  }
}
