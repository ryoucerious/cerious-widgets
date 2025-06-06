import { Component, ElementRef, EventEmitter, Inject, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { IGridRowFeatureColumnComponent } from '../../interfaces/component-interfaces/grid-row-feature-column.interface';
import { GridRow } from '../../models/grid-row';
import { GridOptions } from '../../interfaces/grid-options';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';

@Component({
  selector: 'cw-grid-row-feature-column',
  templateUrl: './grid-row-feature-column.component.html',
      encapsulation: ViewEncapsulation.None
})
export class GridRowFeatureColumnComponent implements IGridRowFeatureColumnComponent {

  @Output() toggleNestedRow: EventEmitter<GridRow> = new EventEmitter<GridRow>();
  
  @Input() gridRow!: GridRow;

  get featureColumnWidth(): string {
    return this.gridColumnService.getFeatureColumnWidth(
      this.gridService.getFeatureCount(),
      this.gridService.gridOptions
    );
  }

  get featureWidth(): string {
    return this.gridColumnService.getFeatureWidth(this.gridOptions) + 'px';
  }

  get gridOptions(): GridOptions {
    return this.gridService.gridOptions;
  }

  get templates(): { [key: string]: TemplateRef<any> } {
    return this.gridService.templates;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) {}

  /**
   * Toggles the selection state of a grid row based on the grid's selection mode.
   *
   * - If multi-select is enabled (`enableMultiselect`), the method toggles the `selected` state
   *   of the current row and emits the updated row through the `rowSelect` observable.
   * - If single-select is enabled (`enableSingleselect`), the method clears the selection
   *   state of all rows in the dataset, selects the current row, and emits the updated row
   *   through the `rowSelect` observable.
   *
   * @remarks
   * This method relies on the `gridService` to access grid options and dataset, and to emit
   * selection changes.
   */
  selectRow(): void {
    if (this.gridService.gridOptions.enableMultiselect) {
      this.gridRow.selected = !this.gridRow.selected;
    } else if (this.gridService.gridOptions.enableSingleselect) {
      this.gridService.gridDataset.dataset.forEach(row => row.selected = false);
      this.gridRow.selected = true;
    }
    this.gridService.gridDataset.selectedRows = this.gridService.gridDataset?.dataset?.filter(row => row.selected);
    this.gridService.rowSelect.next(this.gridRow);
  }

  /**
   * Toggles the `nestedExpanded` property of the provided `GridRow` object
   * and emits the `toggleNestedRow` event after a delay.
   *
   * This method first inverts the `nestedExpanded` state of the `gridRow`.
   * It then uses a nested `setTimeout` to introduce a delay before emitting
   * the `toggleNestedRow` event with the updated `gridRow` as its payload.
   *
   * @param gridRow - The `GridRow` object whose `nestedExpanded` property
   *                  will be toggled and emitted.
   */
  toggleNestedRowValue(gridRow: GridRow): void {
    gridRow.nestedExpanded = !gridRow.nestedExpanded;
    setTimeout(() => {
      setTimeout(() => {
        this.toggleNestedRow.emit(gridRow);
      });
    });
  }
}
