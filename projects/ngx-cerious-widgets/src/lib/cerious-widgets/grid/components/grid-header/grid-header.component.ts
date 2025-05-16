import { Component, ElementRef, Inject, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { IGridHeaderComponent } from '../../interfaces/component-interfaces/grid-header.interface';
import { GridHeaderRowComponent } from '../grid-header-row/grid-header-row.component';
import { IGridHeaderRowComponent } from '../../interfaces/component-interfaces/grid-header-row.interface';
import { GridOptions } from '../../interfaces/grid-options';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { GRID_SCROLL_SERVICE } from '../../tokens/grid-scroll-services.token';
import { ColumnDef, IGridScrollService } from '../../interfaces';

@Component({
  selector: 'cw-grid-header',
  templateUrl: './grid-header.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GridHeaderComponent implements IGridHeaderComponent {
  
  @ViewChild('breadcrumb', { static: false }) breadcrumb!: ElementRef | undefined;
  @ViewChild('tableHead', { static: true }) tableHead!: ElementRef;
  @ViewChildren(GridHeaderRowComponent) rowComponents!: QueryList<IGridHeaderRowComponent>;
  
  get headerWidth(): string {
    return this.gridService.headerWidth;
  }

  get rowMinWidth(): string {
    return parseInt(this.gridService.rowMinWidth) + (this.gridService.hasVerticalScrollbar ? this.gridService.scrollbarWidth : 0) + 'px';
  }

  get rows() {
    return this.gridService.gridDataset.headerRows;
  }

  get gridOptions(): GridOptions {
    return this.gridService.gridOptions;
  }

  get os(): string {
    return this.gridService.os;
  }

  get tableScrollWidth(): number {
    return this.gridService.tableScrollWidth;
  }

  get groupByColumns(): ColumnDef[] {
    return this.gridService.gridDataset.groupByColumns;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_SCROLL_SERVICE) private gridScrollService: IGridScrollService
  ) { }

  
  /**
   * Handles the `keydown` event for the grid header component.
   * Specifically, it listens for the 'Tab' key press to manage grid scrolling behavior.
   *
   * @param event - The keyboard event triggered by the user.
   *
   * When the 'Tab' key is pressed:
   * - Updates the horizontal scroll position (`scrollDelta.left`) of the grid header.
   * - Invokes the `scrollGrid` method of the `gridScrollService` to handle synchronized scrolling
   *   across grid sections (header, body, footer, etc.).
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      setTimeout(() => {
        const scrollDelta = this.gridScrollService.scrollDelta;
        scrollDelta.left = this.tableHead.nativeElement.scrollLeft;

        this.gridScrollService.scrollGrid(
          event,
          scrollDelta,
          this.gridService.gridOptions,
          this.gridService.gridHeader,
          this.gridService.gridBody,
          this.gridService.gridScroller,
          this.gridService.gridFooter,
          this.gridService.hasVerticalScrollbar,
          this.gridService.scrollbarWidth
        );
      });
    }
  }

  /**
   * Removes a column from the group-by configuration of the grid.
   * 
   * @param column - The column definition to be removed from the group-by configuration.
   */
  removeGroupByColumn(column: ColumnDef): void {
    this.gridService.removeGroupByColumn(column);
  }
}
