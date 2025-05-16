import { Inject, Injectable, NgZone } from "@angular/core";
import { Subject } from "rxjs";
import { GRID_COLUMN_SERVICE } from "../tokens/grid-column-service.token";
import {
  GridOptions,
  IGridBodyComponent,
  IGridColumnService,
  IGridFooterComponent,
  IGridHeaderComponent,
  IGridScrollerComponent,
  IGridScrollService,
  ScrollDelta,
} from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class GridScrollService implements IGridScrollService {
  afterScroll: Subject<boolean> = new Subject<boolean>();
  scrollDelta: ScrollDelta = { top: 0, left: 0 };

  constructor(
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService,
    private zone: NgZone
  ) {}

  /**
   * Handles the scrolling behavior of the grid, synchronizing the scroll positions
   * of the grid body, header, footer, and scroller components, while ensuring
   * proper bounds and preventing scroll jumps.
   *
   * @param e - The scroll event triggering the grid scroll.
   * @param delta - The scroll delta containing the desired scroll positions for top and left.
   * @param gridOptions - The grid options configuration object.
   * @param gridHeader - The grid header component.
   * @param gridBody - The grid body component.
   * @param gridScroller - The grid scroller component.
   * @param gridFooter - The grid footer component.
   * @param hasVerticalScrollbar - A boolean indicating if the grid has a vertical scrollbar.
   * @param scrollbarWidth - The width of the scrollbar in pixels.
   *
   * @returns void
   */
  scrollGrid(
    e: Event,
    delta: ScrollDelta,
    gridOptions: GridOptions,
    gridHeader: IGridHeaderComponent,
    gridBody: IGridBodyComponent,
    gridScroller: IGridScrollerComponent,
    gridFooter: IGridFooterComponent,
    hasVerticalScrollbar: boolean,
    scrollbarWidth: number
  ): void {
    try {
      const gridBodyElement = gridBody?.tableBody?.nativeElement;
      const gridHeaderElement = gridHeader?.tableHead?.nativeElement;
      const gridScrollerElement = gridScroller?.el?.nativeElement;
      const gridFooterElement = gridFooter?.tableFooter?.nativeElement;

      // Check if grid body element is available
      if (!gridBodyElement) {
        return;
      }

      // Store delta value for later use
      this.scrollDelta = delta;

      // Calculate the maximum scrollable dimensions
      const verticalScrollbarWidth = hasVerticalScrollbar ? scrollbarWidth : 0;
      const maxScrollTop = Math.max(gridBodyElement.scrollHeight - gridBodyElement.clientHeight, 0);
      const maxScrollLeft = Math.max(
        gridBodyElement.scrollWidth - (gridBodyElement.clientWidth + verticalScrollbarWidth),
        0
      );

      // Clamp the scrollDelta values to the valid range
      this.scrollDelta.top = Math.min(Math.max(this.scrollDelta.top, 0), maxScrollTop);
      this.scrollDelta.left = Math.min(Math.max(this.scrollDelta.left, 0), maxScrollLeft);

      // Prevent scroll jumps by clamping scrollTop within valid bounds
      if (gridBodyElement.scrollTop > maxScrollTop) {
        gridBodyElement.scrollTop = maxScrollTop;
      }

      // Run scroll actions outside of Angular zone
      this.zone.runOutsideAngular(() => {
        try {
          if (e?.target !== gridBodyElement) {
            // If source element is not grid body, scroll left
            gridBodyElement.scrollLeft = this.scrollDelta.left;
          }
          if (e?.target !== gridScrollerElement) {
            // If source element is not grid scroller, scroll top
            gridBodyElement.scrollTop = this.scrollDelta.top;
          }

          // Always scroll header and footer left
          if (gridHeaderElement) {
            gridHeaderElement.scrollLeft = this.scrollDelta.left;
          }
          if (gridFooterElement) {
            gridFooterElement.scrollLeft = this.scrollDelta.left;
          }

          // Update the pinned columns position
          this.gridColumnService.updatePinnedColumnPos(
            gridHeader,
            gridBody,
            gridFooter,
            gridOptions,
            delta
          );

          // Notify subscribers after scroll
          this.afterScroll.next(true);
        } catch (innerError) {
          console.error("Error during scroll synchronization:", innerError);
        }
      });
    } catch (error) {
      console.error("Error handling grid scroll:", error);
    }
  }
}