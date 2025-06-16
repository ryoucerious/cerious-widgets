import { AfterViewInit, Component, ElementRef, Inject, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IGridPagerComponent } from '../../interfaces/component-interfaces/grid-pager.interface';

import { PagerInfo } from '../../interfaces/pager-info';

import { IGridScrollService, IGridService } from '../../interfaces';

import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_SCROLL_SERVICE } from '../../tokens/grid-scroll-services.token';

@Component({
  selector: 'cw-grid-pager',
  standalone: true,
  templateUrl: './grid-pager.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class GridPagerComponent implements IGridPagerComponent, AfterViewInit {

  pagerInfo!: PagerInfo;

  @ViewChild('tablePager') tablePager!: ElementRef;

  @Input() pagerClasses: string = '';

  get gridDataset() {
    return this.gridService.gridDataset;
  }

  get gridOptions() {
    return this.gridService.gridOptions;
  }

  get hasGroupBy() {
    return this.gridService.gridDataset?.groupByColumns?.length > 0;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_SCROLL_SERVICE) private gridScrollService: IGridScrollService
  ) {
    this.pagerInfo = {
      start: 0,
      end: 0,
      total: 0
    }
  }

  ngAfterViewInit(): void {
    this.gridService.pageChange.subscribe(() => {
      setTimeout(() => {
        if (this.gridDataset.pageData?.length) {
          const start = ((this.gridDataset.pageNumber - 1) * (this.gridService.gridOptions.pageSize || 1)) + 1;
          const end = (start + this.gridDataset.pageData.length - 1);
          const total = this.gridDataset.totalRowCount;

          this.pagerInfo = {
            start: start,
            end: end,
            total: total
          }
        }
      });
    });
  }

  /**
   * Handles the grid page click event and selects the specified page.
   *
   * @param pageNumber - The number of the page to select.
   */
  gridPageClick(pageNumber: number) {
    this.gridService.selectPage(pageNumber);
    this.gridScrollService.scrollGrid(
      new Event('scroll'),
      { top: 0, left: 0 },
      this.gridService.gridOptions,
      this.gridService.gridHeader,
      this.gridService.gridBody,
      this.gridService.gridScroller,
      this.gridService.gridFooter,
      this.gridService.hasVerticalScrollbar,
      this.gridService.scrollbarWidth
    );
  }

}
