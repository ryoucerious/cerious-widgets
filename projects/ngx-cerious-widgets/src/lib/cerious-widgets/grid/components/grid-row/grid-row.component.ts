import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, Output, QueryList, Signal, signal, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';

import { IGridRowComponent } from '../../interfaces/component-interfaces/grid-row.interface';
import { IGridRowColumnComponent } from '../../interfaces/component-interfaces/grid-row-column.interface';
import { IGridRowFeatureColumnComponent } from '../../interfaces/component-interfaces/grid-row-feature-column.interface';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { ColumnDef } from '../../interfaces/column-def';

import { GridRow } from '../../models/grid-row';
import { GridRowColumnComponent } from '../grid-row-column/grid-row-column.component';
import { GridRowFeatureColumnComponent } from '../grid-row-feature-column/grid-row-feature-column.component';
import { SignalHelperService } from '../../../shared/services/signal-helper.services';

@Component({
  selector: 'cw-grid-row',
  standalone: true,
  templateUrl: './grid-row.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, GridRowColumnComponent, GridRowFeatureColumnComponent]
})
export class GridRowComponent implements IGridRowComponent, AfterViewInit {
  
  readonly gridRowSignal = signal<GridRow | undefined>(undefined);

  @Input()
  set gridRow(value: GridRow) { this.gridRowSignal.set(value); }
  get gridRow() { return this.gridRowSignal()!; }

  readonly toggleNestedRowSignal = signal<GridRow>(undefined as unknown as GridRow);
  @Output() toggleNestedRow = this.sh.toEventEmitter(this.toggleNestedRowSignal as Signal<GridRow>);

  @ViewChildren(GridRowColumnComponent) columnComponents!: QueryList<IGridRowColumnComponent>;
  @ViewChild(GridRowFeatureColumnComponent) featureColumnComponent!: IGridRowFeatureColumnComponent;

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
    private sh: SignalHelperService,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) { }

  ngAfterViewInit() {
    this.gridRow.elementRef = this.el;
  }

  /**
   * Retrieves the width of a specified column based on its definition and the grid's options.
   *
   * @param column - The column definition object for which the width is to be determined.
   * @returns The calculated width of the column as a number or string, depending on the grid's configuration.
   */
  getColumnWidth(column: ColumnDef) {
    return this.gridColumnService.getColumnWidth(column, this.gridService.gridOptions);
  }

  /**
   * Toggles the nested row value for the specified grid row.
   * Emits the `toggleNestedRow` event with the provided `gridRow` as its payload.
   *
   * @param gridRow - The grid row for which the nested row value should be toggled.
   */
  toggleNestedRowValue(gridRow: GridRow) {
    this.toggleNestedRow.emit(gridRow);
  }
}
