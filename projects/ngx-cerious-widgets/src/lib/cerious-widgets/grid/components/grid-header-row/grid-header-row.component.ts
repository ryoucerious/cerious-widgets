import { Component, ElementRef, Inject, Input, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

import { GridHeaderColumnComponent } from '../grid-header-column/grid-header-column.component';
import { GridHeaderFeatureColumnComponent } from '../grid-header-feature-column/grid-header-feature-column.component';

import { IGridHeaderRowComponent } from '../../interfaces/component-interfaces/grid-header-row.interface';
import { IGridHeaderColumnComponent } from '../../interfaces/component-interfaces/grid-header-column.interface';
import { IGridHeaderFeatureColumnComponent } from '../../interfaces/component-interfaces/grid-header-feature-column.interface';

import { GridRow } from '../../models/grid-row';
import { ColumnDef } from '../../interfaces/column-def';

import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';

import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';

@Component({
  selector: 'cw-grid-header-row',
  standalone: true,
  templateUrl: './grid-header-row.component.html',
  imports: [CommonModule, CdkDrag, CdkDropList, GridHeaderColumnComponent, GridHeaderFeatureColumnComponent],
})
export class GridHeaderRowComponent implements IGridHeaderRowComponent {

  dropId: string = `${Math.random().toString(36).substring(2, 9)}`
  moveItemInArray = moveItemInArray;
  
  readonly gridRowSignal = signal<GridRow | undefined>(undefined);
  readonly isChildRowSignal = signal<boolean>(false);

  @Input()
  set gridRow(value: GridRow) { this.gridRowSignal.set(value); }
  get gridRow() { return this.gridRowSignal()!; }

  @Input()
  set isChildRow(value: boolean) { this.isChildRowSignal.set(value); }
  get isChildRow() { return this.isChildRowSignal(); }

  @ViewChildren(GridHeaderColumnComponent) columnComponents!: QueryList<IGridHeaderColumnComponent>;
  @ViewChildren(GridHeaderRowComponent) childRowComponents!: QueryList<IGridHeaderRowComponent>;
  @ViewChild(GridHeaderFeatureColumnComponent) featureColumnComponent!: IGridHeaderFeatureColumnComponent;

  get featureColumnWidth() {
    return this.gridColumnService.getFeatureColumnWidth(
      this.gridService.getFeatureCount(),
      this.gridService.gridOptions
    );
  }

  get gridOptions() {
    return this.gridService.gridOptions;
  }

  get hasHorizontalScrollbar() {
    return this.gridService.hasHorizontalScrollbar;
  }

  get hasRowFeatures() {
    return this.gridService.getFeatureCount() > 0;
  }

  get hasVerticalScrollbar() {
    return this.gridService.hasVerticalScrollbar;
  }

  get rowMinWidth() {
    const padding = this.hasRowFeatures ? parseInt(this.featureColumnWidth) : 0;
    return parseInt(this.gridService.rowMinWidth) + (this.gridService.hasVerticalScrollbar ? this.gridService.scrollbarWidth : 0) - padding + 'px';
  }

  get pinnedColumns() {
    return this.gridService.pinnedColumns;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) { }

  /**
   * Handles the drop event for drag-and-drop functionality within the grid header row.
   * 
   * @param event - The drag-and-drop event containing information about the 
   *                previous and current container, as well as the indices of the items.
   * 
   * If the dragged item is dropped within the same container, this method:
   * - Reorders the items in the container based on the drag-and-drop indices.
   * - Updates the order of the columns in the grid service to reflect the new arrangement.
   */
  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      // Reorder items within the same container
      this.moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  
      // Update the order of the columns in the grid service
      this.gridService.updateHeaderOrder(this.gridOptions.columnDefs);
    }
  }

  /**
   * Retrieves the width of a specified column based on the column definition
   * and the grid's configuration options.
   *
   * @param column - The column definition object for which the width is to be determined.
   * @returns The calculated width of the column as a string or number, depending on the grid's configuration.
   */
  getColumnWidth(column: ColumnDef) {
    return this.gridColumnService.getColumnWidth(column, this.gridService.gridOptions);
  }

  /**
   * Calculates the colspan for a given column definition.
   * 
   * If the column has no children, it is considered a leaf column and the colspan is 1.
   * Otherwise, the colspan is determined by recursively summing the colspans of its child columns.
   * 
   * @param column - The column definition for which to calculate the colspan.
   * @returns The total colspan for the column.
   */
  getColspan(column: ColumnDef): number {
    if (!column.children || column.children.length === 0) {
      return 1; // Leaf column
    }
    return column.children.reduce((colspan, child) => colspan + this.getColspan(child), 0);
  }

  /**
   * Creates a new instance of a `GridRow` based on the provided column definition.
   *
   * @param column - The column definition used to initialize the new row. 
   *                 If the column has child columns, they will be assigned to the new row.
   * @returns A new `GridRow` object with the specified column definitions and default properties.
   */
  getNewRow(column: ColumnDef): GridRow {
    return new GridRow({
      row: {},
      columnDefs: column.children,
      nestedExpanded: false
    });
  }

  /**
   * Calculates the total width of a column, including its child columns if applicable.
   * 
   * If the column has no children, the width is determined using the `getColumnWidth` method.
   * For columns with children, the method recursively sums up the widths of all visible child columns.
   * 
   * @param column - The column definition object for which the width is being calculated.
   * @returns The total width of the column (and its children, if any) as a string with a "px" suffix.
   */
  getParentWidth(column: ColumnDef): string {
    if (!column.children || column.children.length === 0) {
      return this.getColumnWidth(column); // Use getColumnWidth for leaf columns
    }
  
    // Recursively sum up the widths of all child columns
    const totalWidth = column.children
      .filter(child => child.visible !== false)
      .reduce((width, child) => {
        const childWidth = parseInt(this.getParentWidth(child).replace('px', ''), 10);
        return width + (isNaN(childWidth) ? 100 : childWidth); // Default to 100px if width is invalid
      }, 0);
  
    return `${totalWidth}px`;
  }

  /**
   * Calculates the rowspan for a given column in the grid header row.
   * 
   * @param column - The column definition object to determine the rowspan for.
   * @returns The number of rows the column spans. Returns `1` for both leaf columns 
   *          (columns without children) and group columns (columns with children).
   */
  getRowspan(column: ColumnDef): number {
    if (!column.children || column.children.length === 0) {
      return 1; // Leaf column
    }
    return 1; // Groups only occupy one row
  }

  /**
   * Determines whether a column should be displayed based on its visibility
   * and the visibility of its child columns (if any).
   *
   * @param column - The column definition to evaluate.
   * @returns `true` if the column is visible or has at least one visible child column; otherwise, `false`.
   */
  shouldShowColumn(column: ColumnDef): boolean {
    if (column.children && column.children.length > 0) {
      return (column.visible !== false && column.children.some((child) => child.visible !== false ));
    } else {
      // Check if the column is a leaf column and visible
      return (column.visible !== false);
    }
  }

  /**
   * Determines whether the menu should be displayed for a given column.
   *
   * @param column - The column definition to evaluate.
   * @returns `true` if the menu should be shown (i.e., the column has no parent); otherwise, `false`.
   */
  shouldShowMenu(column: ColumnDef): boolean {
    return !column.parent;
  }
}
