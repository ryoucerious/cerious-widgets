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

  // Cached lookups for the scroll hot path. Reset when the body element changes.
  private cachedBodyEl: HTMLElement | null = null;
  private cachedContentEl: HTMLElement | null = null;

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
      const gridBodyElement = gridBody?.tableBody?.nativeElement as HTMLElement | undefined;
      const gridHeaderElement = gridHeader?.tableHead?.nativeElement as HTMLElement | undefined;
      const gridFooterElement = gridFooter?.tableFooter?.nativeElement as HTMLElement | undefined;

      if (!gridBodyElement) {
        return;
      }

      // Cache the engine content element across frames; querySelector on every
      // scroll event was a measurable cost on long scroll bursts.
      if (this.cachedBodyEl !== gridBodyElement) {
        this.cachedBodyEl = gridBodyElement;
        this.cachedContentEl = gridBodyElement.querySelector(
          "[data-cerious-scroll-content]"
        ) as HTMLElement | null;
      }
      const contentElement = this.cachedContentEl;

      // Clamp the desired horizontal scroll to the valid range.
      const horizontalExtent = contentElement?.scrollWidth ?? gridBodyElement.scrollWidth;
      const maxScrollLeft = Math.max(horizontalExtent - gridBodyElement.clientWidth, 0);
      const nextLeft = Math.min(Math.max(delta.left, 0), maxScrollLeft);

      // No-op when nothing changed (scroll-wheel/keyboard often dispatch many
      // events at the same offset — skip the DOM writes entirely).
      if (nextLeft === this.scrollDelta.left) {
        return;
      }

      this.scrollDelta.left = nextLeft;

      this.zone.runOutsideAngular(() => {
        try {
          const offsetPx = `${nextLeft}px`;

          if (contentElement) {
            contentElement.style.transform = nextLeft
              ? `translateX(${-nextLeft}px)`
              : "";
          }

          if (gridHeaderElement) {
            gridHeaderElement.scrollLeft = nextLeft;
            gridHeaderElement.style.setProperty('--cw-pin-offset', offsetPx);
          }
          if (gridFooterElement) {
            gridFooterElement.scrollLeft = nextLeft;
            gridFooterElement.style.setProperty('--cw-pin-offset', offsetPx);
          }
          gridBodyElement.style.setProperty('--cw-pin-offset', offsetPx);

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