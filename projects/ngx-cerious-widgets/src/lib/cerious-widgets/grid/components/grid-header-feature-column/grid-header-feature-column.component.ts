import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { IGridHeaderFeatureColumnComponent } from '../../interfaces/component-interfaces/grid-header-feature-column.interface';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cw-grid-header-feature-column',
  templateUrl: './grid-header-feature-column.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GridHeaderFeatureColumnComponent implements IGridHeaderFeatureColumnComponent, OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  selected = false;

  get featureWidth() {
    return this.gridColumnService.getFeatureWidth(this.gridService.gridOptions) + 'px';
  }

  get gridOptions() {
    return this.gridService.gridOptions;
  }

  get templates() {
    return this.gridService.templates;
  }

  constructor (
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.gridService.rowSelect.subscribe(() => {
      this.selected = !this.gridService.gridDataset?.dataset?.some(row => !row.selected);
    }));

    this.subscriptions.push(this.gridService.selectedRowsChange.subscribe(() => {
      this.selected = !this.gridService.gridDataset?.dataset?.some(row => !row.selected);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Toggles the selection state of all rows in the grid dataset.
   * If the current selection state is `true`, it will deselect all rows.
   * If the current selection state is `false`, it will select all rows.
   *
   * This method updates the `selected` property of each row in the grid dataset
   * to match the toggled selection state.
   */
  selectAll(): void {
    this.selected = !this.selected;
    this.gridService.gridDataset?.dataset?.forEach(row => row.selected = this.selected);
    this.gridService.gridDataset.selectedRows = this.gridService.gridDataset?.dataset?.filter(row => row.selected);
    this.gridService.render();
  }

}
