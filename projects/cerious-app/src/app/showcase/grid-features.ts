export interface GridFeature {
  feature: string;
  path: string;
  name: string;
  title: string;
  description: string;
}

/** Single source of truth for the Grid sub-pages (nav children + routes). */
export const GRID_FEATURES: GridFeature[] = [
  { feature: 'basic', path: 'grid/basic', name: 'Basic', title: 'Basic Grid', description: 'A clean data grid with formatted columns (currency, star ratings) rendered over virtualized rows.' },
  { feature: 'selection', path: 'grid/selection', name: 'Selection', title: 'Row Selection', description: 'Multi-row selection with checkboxes in the feature column.' },
  { feature: 'sorting', path: 'grid/sorting', name: 'Sorting', title: 'Sorting', description: 'Click a column header to sort. Multi-column sorting is provided by the MultiSort plugin.' },
  { feature: 'filtering', path: 'grid/filtering', name: 'Filtering', title: 'Filtering', description: 'A global text filter that searches across every column, via the GlobalTextFilter plugin.' },
  { feature: 'grouping', path: 'grid/grouping', name: 'Grouping', title: 'Grouping', description: 'Group rows by a column. Use the column menu (☰) to group by Category or Status.' },
  { feature: 'pinning', path: 'grid/pinning', name: 'Column Pinning', title: 'Column Pinning', description: 'Pin columns to the left so they stay in view while scrolling horizontally. ID and Name are pinned here.' },
  { feature: 'column-menu', path: 'grid/column-menu', name: 'Column Menu', title: 'Column Menu', description: 'A per-column menu for pinning, grouping, and toggling column visibility.' },
  { feature: 'editing', path: 'grid/editing', name: 'Inline Editing', title: 'Inline Editing', description: 'Editable cells with text, number, and dropdown editors.' },
  { feature: 'templates', path: 'grid/templates', name: 'Cell Templates', title: 'Cell Templates', description: 'Render custom cell content with a template — here the Status column renders a colored Tag badge.' },
  { feature: 'pagination', path: 'grid/pagination', name: 'Pagination', title: 'Pagination', description: 'Client-side paging with a page-size selector and pager controls.' },
  { feature: 'export', path: 'grid/export', name: 'Excel Export', title: 'Excel Export', description: 'Export the grid contents to an Excel file via the ExportToExcel plugin.' },
  { feature: 'virtual-scroll', path: 'grid/virtual-scroll', name: 'Virtual Scroll', title: 'Virtual Scroll — 1M Rows', description: 'One million rows rendered smoothly through the cerious-scroll virtualization engine.' }
];
