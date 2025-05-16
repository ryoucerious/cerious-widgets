import { Injectable } from "@angular/core";
import { GridRow } from "../models/grid-row";
import { 
  ColumnDef,
  GridDataset,
  GridOptions,
  IGridBodyComponent,
  IGridColumnService,
  IGridFooterComponent,
  IGridHeaderComponent,
  ScrollDelta } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class GridColumnService implements IGridColumnService {

  /**
   * Recursively flattens a hierarchical array of column definitions into a single-level array.
   *
   * @param columns - An array of `ColumnDef` objects, which may include nested child columns.
   * @returns A flattened array of `ColumnDef` objects containing only the leaf nodes.
   */
  flattenColumns(columns: ColumnDef[]): ColumnDef[] {
    if (!Array.isArray(columns)) {
      console.error("Invalid input: 'columns' must be an array.");
      return [];
    }

    const result: ColumnDef[] = [];
    for (const column of columns) {
      if (column.children && Array.isArray(column.children)) {
        result.push(...this.flattenColumns(column.children));
      } else if (column) {
        result.push(column);
      } else {
        console.warn("Encountered an invalid column definition:", column);
      }
    }
    return result;
  }

  /**
   * Retrieves a column definition by its unique identifier from a list of column definitions.
   *
   * @param id - The unique identifier of the column to retrieve.
   * @param columnDefs - An array of column definitions to search through.
   * @returns The column definition matching the provided ID, or `null` if not found or if the ID is invalid.
   *
   * @throws Will log an error if the ID is not provided or if an unexpected error occurs during the search.
   * @throws Will log a warning if no column with the specified ID is found.
   */
  getColumnById(id: string, columnDefs: ColumnDef[],): ColumnDef | null {
    if (!id) {
      console.error("Invalid input: 'id' is required.");
      return null;
    }

    try {
      const column = this.flattenColumns(columnDefs).find(col => col.id === id);
      if (!column) {
        console.warn(`Column with id '${id}' not found.`);
        return null;
      }
      return column;
    } catch (error) {
      console.error("Error retrieving column by ID:", error);
      return null;
    }
  }

  /**
   * Determines the width of a grid column based on the provided column definition
   * and grid options. The method prioritizes the width in the following order:
   * 1. `column.dynamicWidth` if defined.
   * 2. `column.width` if defined.
   * 3. `gridOptions.columnWidth` if defined.
   * 4. Defaults to `'150px'` if none of the above are specified.
   *
   * @param column - The column definition object containing width properties.
   * @param gridOptions - The grid options object containing default column width.
   * @returns The width of the column as a string (e.g., `'150px'`).
   */
  getColumnWidth(column: ColumnDef, gridOptions: GridOptions): string {
    if (!column) {
      console.error("Invalid input: 'column' is required.");
      return '150px';
    }
    if (!gridOptions) {
      console.error("Invalid input: 'gridOptions' is required.");
      return '150px';
    }

    try {
      if (column.dynamicWidth) {
        return column.dynamicWidth;
      } else if (column.width) {
        return column.width;
      } else if (gridOptions.columnWidth) {
        return gridOptions.columnWidth;
      } else {
        return '150px';
      }
    } catch (error) {
      console.error("Error determining column width:", error);
      return '150px';
    }
  }

  /**
   * Calculates the total width of a feature column based on the number of features
   * and the grid options provided.
   *
   * @param featureCount - The number of features in the column.
   * @param gridOptions - The grid options used to determine the width of each feature.
   * @returns The total width of the feature column as a string with a 'px' suffix.
   */
  getFeatureColumnWidth(featureCount: number, gridOptions: GridOptions): string {
    return (featureCount * this.getFeatureWidth(gridOptions)) + featureCount + 'px';
  }

  /**
   * Retrieves the width of the feature column from the provided grid options.
   * If the `featureColumnWidth` property is not defined, a default value of 26 is used.
   *
   * @param gridOptions - The grid options containing configuration for the grid.
   * @returns The width of the feature column as a number.
   */
  getFeatureWidth(gridOptions: GridOptions): number {
    return parseInt(gridOptions.featureColumnWidth || '26');
  }

  /**
   * Retrieves the pinned columns from the provided row components.
   *
   * @param rowComponents - An optional array of row components. Each row component
   *                        is expected to have a `columnComponents` property that
   *                        can be converted to an array.
   * @returns An array of native HTML elements corresponding to the pinned columns.
   *          If no row components are provided, an empty array is returned.
   */
  getPinnedColumns(rowComponents?: Array<any>) {
    if (!rowComponents) {
      return [];
    }

    try {
      return rowComponents.flatMap(row => {
        if (!row || !row.columnComponents) {
          console.warn("Invalid row component encountered:", row);
          return [];
        }
        return row.columnComponents.toArray();
      })
      .filter(col => col && col.column?.pinned)
      .map(col => col.el.nativeElement);
    } catch (error) {
      console.error("Error retrieving pinned columns:", error);
      return [];
    }
  }

  /**
   * Retrieves the header and leaf pinned columns from the provided row components.
   *
   * @param rowComponents - An optional array of row components. Each row component is expected
   *                        to have an `el.nativeElement` property for DOM querying and an optional
   *                        `columnComponents` property for accessing column metadata.
   * @returns An array of `HTMLElement` objects representing the pinned columns, including both
   *          group headers and leaf columns.
   *
   * @remarks
   * - If no `rowComponents` are provided, the method logs a warning and returns an empty array.
   * - Group headers are identified by the CSS class `.group-header.table-col-pinned`.
   * - Leaf columns are filtered to exclude those whose IDs are part of the ignored group headers.
   * - Logs warnings for invalid row components and catches any errors during processing, returning
   *   an empty array in case of failure.
   *
   * @example
   * ```typescript
   * const pinnedColumns = gridColumnService.getHeaderPinnedColumns(rowComponents);
   * console.log(pinnedColumns); // Logs an array of pinned column HTMLElements
   * ```
   */
  getHeaderPinnedColumns(rowComponents?: Array<any>): HTMLElement[] {
    if (!rowComponents) {
      console.warn("No row components provided. Returning an empty array.");
      return [];
    }

    try {
      const groupHeaders = rowComponents.flatMap(row => {
        const headers = row.el.nativeElement.querySelectorAll('.group-header.table-col-pinned');
        return Array.from(headers) as HTMLElement[];
      });

      const ignoredLeafColumnIds = Array.from(new Set(groupHeaders.flatMap(header => {
        const collectColumnIds = (element: HTMLElement): string[] => {
          const columnId = element.getAttribute('data-column-id');
          const childColumnIds = Array.from(element.querySelectorAll('[data-column-id]'))
        .flatMap(child => collectColumnIds(child as HTMLElement));
          return columnId ? [columnId, ...childColumnIds] : childColumnIds;
        };
        return collectColumnIds(header);
      })));

      const leafColumns = rowComponents.flatMap(row => {
        if (!row || !row.columnComponents) {
          console.warn("Invalid row component encountered:", row);
          return [];
        }
        return row.columnComponents.toArray();
      })
      .filter(col => col && col.column?.pinned && !ignoredLeafColumnIds.includes(col.column.id))
      .map(col => col.el.nativeElement);

      return [groupHeaders[0]].concat(leafColumns);

    } catch (error) {
      console.error("Error retrieving pinned columns:", error);
      return [];
    }
  }

  /**
   * Processes the grid definitions by ensuring each column definition has a width,
   * and updates the `gridDataset` with header, footer, and filler rows based on the
   * provided column definitions.
   *
   * @param gridOptions - The grid options containing column definitions and optional default column width.
   * @param gridDataset - The dataset to be updated with header, footer, and filler rows.
   */
  processGridDefs(gridOptions: GridOptions, gridDataset: GridDataset): void {
    if (!gridOptions || !gridOptions.columnDefs) {
      console.error("Invalid input: 'gridOptions' and 'gridOptions.columnDefs' are required.");
      return;
    }
    if (!gridDataset) {
      console.error("Invalid input: 'gridDataset' is required.");
      return;
    }

    try {
      gridOptions.columnDefs.forEach(def => {
        if (!def.width) {
          def.width = gridOptions.columnWidth || '150px';
        }
      });

      gridDataset.headerRows = [new GridRow({ columnDefs: gridOptions.columnDefs })];
      gridDataset.footerRows = [new GridRow({ columnDefs: gridOptions.columnDefs })];
      gridDataset.fillerRows = [new GridRow({ columnDefs: gridOptions.columnDefs })];
    } catch (error) {
      console.error("Error processing grid definitions:", error);
    }
  }

  /**
   * Updates the position of pinned columns in the grid by adjusting their `left` style property
   * based on the provided scroll delta. This method handles pinned columns across various grid
   * sections, including the header, body, footer, filler rows, and nested rows.
   *
   * @param gridHeader - The grid header component containing row components.
   * @param gridBody - The grid body component containing row components, filler rows, and nested rows.
   * @param gridFooter - The grid footer component containing row components.
   * @param gridOptions - The grid options configuration, which may include the `pinNestedRowTemplate` flag.
   * @param scrollDelta - The scroll delta object containing the `left` value to adjust column positions.
   */
  updatePinnedColumnPos(
    gridHeader: IGridHeaderComponent,
    gridBody: IGridBodyComponent,
    gridFooter: IGridFooterComponent,
    gridOptions: GridOptions,
    scrollDelta: ScrollDelta,
  ): void {
    if (!gridHeader || !gridBody || !gridOptions || !scrollDelta) {
      console.error("Invalid input: All parameters are required for updating pinned column positions.");
      return;
    }

    try {
      const headerRows = gridHeader.rowComponents.toArray();
      const bodyRows = gridBody.rowComponents.toArray();
      const fillerRows = gridBody.fillerRowComponents.toArray();
      const footerRows = gridFooter?.rowComponents.toArray();
      const nestedRows = gridBody.nestedRowComponents.toArray();

      const groupByBreadcrumb = gridHeader.breadcrumb?.nativeElement;
      const groupByHeaders = gridBody.groupHeaders.toArray().map(header => header.nativeElement);

      const pinnedHeaderCols = this.getHeaderPinnedColumns(headerRows);
      const pinnedBodyCols = this.getPinnedColumns(bodyRows);
      const pinnedFooterCols = this.getPinnedColumns(footerRows);
      const pinnedFillerCols = this.getPinnedColumns(fillerRows);
      const pinnedNestedCols = this.getPinnedColumns(nestedRows);

      const pinnedHeaderFeatureCols = headerRows.flatMap(rows => rows.featureColumnComponent?.el.nativeElement);
      const pinnedBodyFeatureCols = bodyRows.flatMap(rows => rows.featureColumnComponent?.el.nativeElement);
      const pinnedFooterFeatureCols = footerRows?.flatMap(rows => rows.featureColumnComponent?.el.nativeElement);
      const pinnedFillerRowFeatureCols = fillerRows?.flatMap(rows => rows.featureColumnComponent?.el.nativeElement);
      
      let columns = pinnedHeaderCols
        .concat(pinnedBodyCols)
        .concat(pinnedFooterCols)
        .concat(pinnedHeaderFeatureCols)
        .concat(pinnedFillerCols)
        .concat(pinnedBodyFeatureCols)
        .concat(pinnedFooterFeatureCols)
        .concat(pinnedFillerRowFeatureCols)
        .concat(groupByBreadcrumb)
        .concat(groupByHeaders);

      if (gridOptions.pinNestedRowTemplate) {
        columns = columns.concat(pinnedNestedCols);
      }

      columns.filter(col => col).forEach(col => {
        col.style.left = scrollDelta.left + 'px';
      });
    } catch (error) {
      console.error("Error updating pinned column positions:", error);
    }
  }
}
