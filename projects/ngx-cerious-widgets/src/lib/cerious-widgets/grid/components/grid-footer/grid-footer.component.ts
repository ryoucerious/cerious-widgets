import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { IGridFooterComponent } from '../../interfaces/component-interfaces/grid-footer.interface';
import { Subscription } from 'rxjs';
import { GridFooterRowComponent } from '../grid-footer-row/grid-footer-row.component';
import { IGridFooterRowComponent } from '../../interfaces/component-interfaces/grid-footer-row.interface';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';

@Component({
  selector: 'cw-grid-footer',
  templateUrl: './grid-footer.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GridFooterComponent implements IGridFooterComponent, AfterViewInit, OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];

  @ViewChild('tableFooter') tableFooter!: ElementRef;
  @ViewChildren(GridFooterRowComponent) rowComponents!: QueryList<IGridFooterRowComponent>;

  get gridDataset() {
    return this.gridService.gridDataset;
  }

  get gridOptions() {
    return this.gridService.gridOptions;
  }

  get headerWidth() {
    return this.gridService.headerWidth;
  }

  get rowMinWidth() {
    return parseInt(this.gridService.rowMinWidth) + (this.gridService.hasVerticalScrollbar ? this.gridService.scrollbarWidth : 0) + 'px';
  }

  get rows() {
    return this.gridService.gridDataset.footerRows;
  }

  get os() {
    return this.gridService.os;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.gridService.afterRender.subscribe(() => this.flattenColumnsForRows()));
  }

  ngAfterViewInit(): void {
    setTimeout(() => setTimeout(() => this.flattenColumnsForRows()));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Flatten nested columns for all rows
  private flattenColumnsForRows(): void {
    if (!this.rows) {
      return;
    }
    // Flatten columns for each row
    this.rows.forEach(row => {
      row.columnDefs = this.gridColumnService.flattenColumns(row.columnDefs);
    });
  }
}
