import { Component, ElementRef, Inject, Input, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridFooterColumnComponent } from '../grid-footer-column/grid-footer-column.component';
import { GridFooterFeatureColumnComponent } from '../grid-footer-feature-column/grid-footer-feature-column.component';

import { GridRow } from '../../models/grid-row';
import { ColumnDef } from '../../interfaces/column-def';

import { IGridFooterRowComponent } from '../../interfaces/component-interfaces/grid-footer-row.interface';
import { IGridFooterColumnComponent } from '../../interfaces/component-interfaces/grid-footer-column.interface';
import { IGridFooterFeatureColumnComponent } from '../../interfaces/component-interfaces/grid-footer-feature-column.interface';

import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';

import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';

@Component({
  selector: 'cw-grid-footer-row',
  standalone: true,
  templateUrl: './grid-footer-row.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, GridFooterColumnComponent, GridFooterFeatureColumnComponent]
})
export class GridFooterRowComponent implements IGridFooterRowComponent {
  
  @Input() gridRow!: GridRow;

  @ViewChildren(GridFooterColumnComponent) columnComponents!: QueryList<IGridFooterColumnComponent>;
  @ViewChild(GridFooterFeatureColumnComponent) featureColumnComponent!: IGridFooterFeatureColumnComponent;

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

  get pinnedColumns() {
    return this.gridService.pinnedColumns;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) { }

  /**
   * Retrieves the width of a specified column as a string.
   *
   * @param column - The column definition object for which the width is being retrieved.
   * @returns The width of the column as a string, typically in a CSS-compatible format (e.g., '100px', '20%').
   */
  getColumnWidth(column: ColumnDef): string {
    return this.gridColumnService.getColumnWidth(column, this.gridService.gridOptions);
  }
}
