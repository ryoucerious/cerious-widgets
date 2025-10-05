// Angular imports
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { ZonelessCompatibleComponent } from '../../../components/base/zoneless-compatible.component';

// Interface imports
import { IGridScrollerComponent } from '../../interfaces/component-interfaces/grid-scroller.interface';
import { ScrollDelta } from '../../interfaces/scroll-delta';
import { IGridScrollService } from '../../interfaces/service-interfaces/grid-scroll.interface';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';

// Token imports
import { GRID_SCROLL_SERVICE } from '../../tokens/grid-scroll-services.token';
import { GRID_SERVICE } from '../../tokens/grid-service.token';

@Component({
  selector: 'cw-grid-scroller',
  standalone: true,
  templateUrl: './grid-scroller.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class GridScrollerComponent extends ZonelessCompatibleComponent implements IGridScrollerComponent {

  @ViewChild('scroller', { static: true }) scroller!: ElementRef;
  
  get hasHorizontalScrollbar() {
    return this.gridService.hasHorizontalScrollbar;
  }

  get hasVerticalScrollbar() {
    return this.gridService.hasVerticalScrollbar;
  }
  
  get moddedColumnWidth() {
    return this.gridService.moddedColumnWidth;
  }

  get pinnedColumnWidth() {
    return this.gridService.pinnedColumnWidth;
  }

  get tableScrollHeight(): number {
    return this.gridService.tableScrollHeight;
  }

  get tableScrollWidth(): number {
    return this.gridService.tableScrollWidth;
  }

  get scrollDelta(): ScrollDelta {
    return this.gridScrollService.scrollDelta;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_SCROLL_SERVICE) private gridScrollService: IGridScrollService
  ) {
    super();
  }
  
  /**
   * Calculates and returns the scroll height for the grid scroller.
   *
   * @returns {number} The height of the scrollbar if it is greater than 0; otherwise, returns 0.
   */
  getScrollHeight(): number {
    return this.gridService.scrollbarHeight > 0 ? this.gridService.scrollbarSize : 0;
  }

  /**
   * Calculates and returns the width adjustment based on the presence of a vertical scrollbar.
   *
   * @returns {number} The width adjustment. Returns the scrollbar size if a vertical scrollbar is present, otherwise 0.
   */
  getWidth(): number {
    return this.hasVerticalScrollbar ? this.gridService.scrollbarSize : 0;
  }

  /**
   * Handles the grid scrolling event and updates the scroll position accordingly.
   *
   * @param e - The scroll event object containing details about the scroll action.
   *
   * This method calculates the new scroll delta based on the horizontal scroll position
   * and invokes the `gridScrollService.scrollGrid` method to update the grid's scroll state.
   * It passes various grid-related parameters to ensure proper synchronization of the grid's
   * components, such as the header, body, scroller, and footer.
   */
  scrollGrid(e: any): void {
    const delta = {
      left: e.target.scrollLeft,
      top: this.scrollDelta.top
    };
    this.gridScrollService.scrollGrid(
      e,
      delta,
      this.gridService.gridOptions,
      this.gridService.gridHeader,
      this.gridService.gridBody,
      this.gridService.gridScroller,
      this.gridService.gridFooter,
      this.hasVerticalScrollbar,
      this.gridService.scrollbarWidth
    );
  }

}
