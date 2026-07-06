import { ColumnDef, ColumnType } from 'ngx-cerious-widgets';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  date: Date;
  status: string;
  stock: number;
  rating: number;
}

const CATEGORIES = ['Electronics', 'Apparel', 'Home', 'Toys', 'Books'];
const STATUSES = ['Active', 'Pending', 'Discontinued'];
const NAMES = ['Widget', 'Gadget', 'Gizmo', 'Doohickey', 'Contraption', 'Apparatus', 'Device', 'Module'];

export function makeProducts(n: number): Product[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `${NAMES[i % NAMES.length]} ${i + 1}`,
    category: CATEGORIES[i % CATEGORIES.length],
    price: Math.round((5 + ((i * 37) % 495)) * 100) / 100,
    date: new Date(2024, i % 12, (i % 27) + 1),
    status: STATUSES[i % STATUSES.length],
    stock: (i * 53) % 500,
    rating: 1 + (i % 5)
  }));
}

/** 60-row sample used by most feature demos. */
export const GRID_DATA: Product[] = makeProducts(60);

/**
 * Column defs with every capability turned on; each feature demo layers its
 * specifics (pinned / editable / cellTemplate) on top of a fresh copy.
 */
export function columns(): ColumnDef[] {
  const caps = { sortable: true, filterable: true, resizable: true, draggable: true, pinnable: true, groupable: true };
  return [
    { id: 'id', field: 'id', label: 'ID', type: ColumnType.Number, width: '70px', ...caps },
    { id: 'name', field: 'name', label: 'Name', type: ColumnType.String, ...caps },
    { id: 'category', field: 'category', label: 'Category', type: ColumnType.String, ...caps },
    { id: 'price', field: 'price', label: 'Price', type: ColumnType.Number, format: 'currency' as any, ...caps },
    { id: 'status', field: 'status', label: 'Status', type: ColumnType.String, ...caps },
    { id: 'stock', field: 'stock', label: 'Stock', type: ColumnType.Number, ...caps }
  ] as ColumnDef[];
}

export function statusSeverity(status: string): 'success' | 'warn' | 'danger' | 'neutral' {
  switch (status) {
    case 'Active': return 'success';
    case 'Pending': return 'warn';
    case 'Discontinued': return 'danger';
    default: return 'neutral';
  }
}

/** Mutate a column in place by id. */
export function withCol(cols: ColumnDef[], id: string, fn: (c: ColumnDef) => void): ColumnDef[] {
  const col = cols.find(c => c.id === id);
  if (col) {
    fn(col);
  }
  return cols;
}
