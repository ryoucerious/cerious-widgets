import { ColumnDef, ColumnType } from "ngx-cerious-widgets";

const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Garden', 'Toys', 'Sports', 'Automotive'];
const statuses = ['Active', 'Inactive', 'Pending', 'Discontinued'];
const descriptions = [
  'High quality product.',
  'Limited edition.',
  'Best seller.',
  'Customer favorite.',
  'Eco-friendly material.',
  'Imported item.',
  'On sale.',
  'New arrival.'
];

function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split('T')[0];
}

export const MOCK_DATA = Array.from({ length: 1000000 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: categories[i % categories.length],
  price: Math.floor(Math.random() * 5000) + 10,
  date: randomDate(new Date(2020, 0, 1), new Date(2025, 0, 1)),
  status: statuses[Math.floor(Math.random() * statuses.length)],
  description: descriptions[Math.floor(Math.random() * descriptions.length)],
  stock: Math.floor(Math.random() * 1000),
  rating: +(Math.random() * 5).toFixed(2),
  sku: `SKU-${100000 + i}`,
  supplier: `Supplier ${1 + (i % 50)}`,
  weight: +(Math.random() * 10).toFixed(2),
  dimensions: `${Math.floor(Math.random() * 100)}x${Math.floor(Math.random() * 100)}x${Math.floor(Math.random() * 100)} cm`
}));

const categoryOptions = categories.map(c => ({ id: c, value: c }));
const statusOptions = statuses.map(s => ({ id: s, value: s }));

export const MOCK_COLUMN_DEFS = [
  { id: 'id', field: 'id', label: 'ID', type: ColumnType.Number },
  { id: 'name', field: 'name', label: 'Name (text)', type: ColumnType.String, editable: true },
  { id: 'category', field: 'category', label: 'Category (dropdown)', type: ColumnType.Dropdown, editable: true, valueOptions: categoryOptions },
  { id: 'price', field: 'price', label: 'Price (number)', type: ColumnType.Number, editable: true, format: 'currency' },
  { id: 'date', field: 'date', label: 'Date', type: ColumnType.Date },
  { id: 'status', field: 'status', label: 'Status (dropdown)', type: ColumnType.Dropdown, editable: true, valueOptions: statusOptions },
  { id: 'description', field: 'description', label: 'Description (text)', type: ColumnType.String, editable: true },
  { id: 'stock', field: 'stock', label: 'Stock (number)', type: ColumnType.Number, editable: true },
  { id: 'rating', field: 'rating', label: 'Rating', type: ColumnType.Number, format: 'stars' },
  { id: 'sku', field: 'sku', label: 'SKU', type: ColumnType.String },
  { id: 'supplier', field: 'supplier', label: 'Supplier', type: ColumnType.String },
  { id: 'weight', field: 'weight', label: 'Weight (number)', type: ColumnType.Number, editable: true },
  { id: 'dimensions', field: 'dimensions', label: 'Dimensions', type: ColumnType.String }
] as ColumnDef[];