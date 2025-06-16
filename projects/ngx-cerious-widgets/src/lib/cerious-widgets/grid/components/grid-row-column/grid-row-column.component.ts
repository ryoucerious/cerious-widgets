import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Input, signal, ViewEncapsulation } from '@angular/core';

import { ColumnFormat, ColumnType } from '../../enums';
import { ColumnDef } from '../../interfaces/column-def';
import { IGridRowColumnComponent } from '../../interfaces/component-interfaces/grid-row-column.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';

import { GridRow } from '../../models/grid-row';

import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { SectionClassConfig } from '../../interfaces';

@Component({
  selector: 'cw-grid-row-column',
  standalone: true,
  templateUrl: './grid-row-column.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class GridRowColumnComponent implements IGridRowColumnComponent {

  readonly columnSignal = signal<ColumnDef | undefined>(undefined);
  readonly gridRowSignal = signal<GridRow | undefined>(undefined);

  @Input()
  set column(value: ColumnDef) { this.columnSignal.set(value); }
  get column() { return this.columnSignal()!; }

  @Input()
  set gridRow(value: GridRow) { this.gridRowSignal.set(value); }
  get gridRow() { return this.gridRowSignal()!; }
  
  @Input() classes: SectionClassConfig = {};

  // Expose enums to the template
  ColumnType = ColumnType;
  ColumnFormat = ColumnFormat;
  
  get templates() {
    return this.gridService.templates;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) { }

  /**
   * TrackBy function for dropdown options to optimize rendering in Angular templates.
   * This function determines the unique identifier for each item in the dropdown list.
   *
   * @param index - The index of the item in the dropdown list.
   * @param item - The current item in the dropdown list.
   * @returns The unique identifier for the item, which is either the `id` property of the item
   *          or the index if the `id` is not available.
   */
  dropdownTrackBy(index: number, item: any): any {
    // Track by function for dropdown options
    return item.id || index;
  }

  /**
   * Determines the text alignment for a grid column based on its type and format.
   *
   * - For columns of type `Number` or with a format of `currency` or `percentage`,
   *   the default alignment is `'right'` unless a specific alignment is provided.
   * - For all other columns, the default alignment is `'left'` unless a specific alignment is provided.
   *
   * @returns {string} The alignment for the column, either `'right'` or `'left'`.
   */
  getAlignment(): string {
    // Default alignment for numbers is 'right', otherwise use the column's alignment or default to 'left'
    if (this.column.type === ColumnType.Number || this.column.format === 'currency' || this.column.format === 'percentage') {
      return this.column.alignment || 'right';
    }
    return this.column.alignment || 'left';
  }

  /**
   * Retrieves the width of the current grid column as a string.
   *
   * @returns {string} The width of the column, typically in a CSS-compatible format (e.g., '100px', '20%').
   */
  getWidth(): string {
    return this.gridColumnService.getColumnWidth(this.column, this.gridService.gridOptions);
  }

  /**
   * Formats the value of a grid cell based on the column's specified format.
   *
   * Supported formats include:
   * - `Currency`: Formats the value as a currency string in USD.
   * - `Percentage`: Appends a percentage symbol (`%`) to the value.
   * - `Stars`: Rounds the value to the nearest integer.
   * - `Date`: Converts the value to a localized date string.
   * - `DateTime`: Converts the value to a localized date and time string.
   * - `Time`: Converts the value to a localized time string.
   * - Default: Returns the raw value without formatting.
   *
   * @returns The formatted value based on the column's format.
   */
  getFormattedValue(): any {
    const value = this.getValue();

    // Apply formatting based on column format
    switch (this.column.format) {
      case ColumnFormat.Currency:
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case ColumnFormat.Percentage:
        return `${value}%`;
      case ColumnFormat.Stars:
        return Math.round(value); // Return rounded value for stars
      case ColumnFormat.Date:
        return new Date(value).toLocaleDateString();
      case ColumnFormat.DateTime:
        return new Date(value).toLocaleString();
      case ColumnFormat.Time:
        return new Date(value).toLocaleTimeString();
      default:
        return value;
    }
  }

  /**
   * Generates an array representing star ratings based on the given value.
   * Each element in the array corresponds to a star.
   *
   * @param value - The numeric value used to determine the number of stars.
   *                The value is rounded to the nearest integer.
   * @returns An array of zeros with a length equal to the rounded value.
   */
  getStars(value: number): number[] {
    // Generate an array for star ratings
    return Array(Math.round(value)).fill(0);
  }

  /**
   * Retrieves the value of the grid row's column field.
   *
   * @returns The value of the column field from the grid row if the column field is defined;
   *          otherwise, returns `null`.
   */
  getValue(): any {
    return this.column.field ? this.gridRow.row[this.column.field] : null;
  }

  /**
   * Handles the value change event for a grid row column.
   * Updates the corresponding field in the grid row with the new value.
   *
   * @param event - The event object containing the new value.
   *                The value is expected to be accessible via `event.target.value`.
   */
  onValueChange(event: any): void {
    if (this.column.field) {
      this.gridRow.row[this.column.field] = event.target.value;
    }
  }
}
