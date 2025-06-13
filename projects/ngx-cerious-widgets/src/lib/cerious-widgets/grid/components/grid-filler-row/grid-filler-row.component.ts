import { Component, ElementRef, Inject, Input, QueryList, signal, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridFillerRowColumnComponent } from '../grid-filler-row-column/grid-filler-row-column.component';
import { GridFillerRowFeatureColumnComponent } from '../grid-filler-row-feature-column/grid-filler-row-feature-column.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { GridRow } from '../../models';
import {
  ColumnDef,
  IGridColumnService,
  IGridFillerRowColumnComponent,
  IGridFillerRowComponent,
  IGridFillerRowFeatureColumnComponent,
  IGridService
} from '../../interfaces';

@Component({
  selector: 'cw-grid-filler-row',
  standalone: true,
  templateUrl: './grid-filler-row.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, GridFillerRowColumnComponent, GridFillerRowFeatureColumnComponent]
})
export class GridFillerRowComponent implements IGridFillerRowComponent {

  readonly gridRowSignal = signal<GridRow | undefined>(undefined);

  @Input()
  set gridRow(value: GridRow) { this.gridRowSignal.set(value); }
  get gridRow() { return this.gridRowSignal()!; }

  @ViewChildren(GridFillerRowColumnComponent) columnComponents!: QueryList<IGridFillerRowColumnComponent>;
  @ViewChild(GridFillerRowFeatureColumnComponent) featureColumnComponent!: IGridFillerRowFeatureColumnComponent;

  get featureColumnWidth() {
    return this.gridColumnService.getFeatureColumnWidth(
      this.gridService.getFeatureCount(),
      this.gridService.gridOptions
    );
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

  get gridDataset() {
    return this.gridService.gridDataset;
  }

  get pinnedColumns() {
    return this.gridService.pinnedColumns;
  }

  get gridOptions() {
    return this.gridService.gridOptions;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) { }

  /**
   * Retrieves the width of a specified column as a string.
   *
   * @param column - The column definition object for which the width is to be determined.
   * @returns The width of the column as a string, typically in a CSS-compatible format (e.g., '100px', '20%').
   */
  getColumnWidth(column: ColumnDef): string {
    return this.gridColumnService.getColumnWidth(column, this.gridService.gridOptions);
  }

}
