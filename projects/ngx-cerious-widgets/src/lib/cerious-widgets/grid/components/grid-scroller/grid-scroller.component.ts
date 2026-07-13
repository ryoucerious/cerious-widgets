// Angular imports
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, NgZone, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
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
export class GridScrollerComponent extends ZonelessCompatibleComponent implements IGridScrollerComponent, AfterViewInit, OnDestroy {

  @ViewChild('scroller', { static: true }) scroller!: ElementRef;

  private afterScrollSub: Subscription | null = null;
  private afterResizeSub: Subscription | null = null;
  private suppressEmit = false;
  private rafId: number | null = null;
  private pendingScrollLeft = 0;

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
    private zone: NgZone,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_SCROLL_SERVICE) private gridScrollService: IGridScrollService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    const el = this.scroller?.nativeElement as HTMLElement | undefined;
    if (!el) return;

    // Listen natively so horizontal scroll frames do not schedule Angular CD
    // (a template `(scroll)` binding would tick CD on every pixel and tank FPS
    // in zoneless mode).
    this.zone.runOutsideAngular(() => {
      el.addEventListener('scroll', this.onNativeScroll, { passive: true });
    });

    // Reflect external scroll-position updates back to the element only when
    // they did not originate here. Avoids the per-CD `[scrollLeft]` write the
    // template binding used to perform on every frame.
    this.afterScrollSub = this.gridScrollService.afterScroll.subscribe(() => {
      if (this.suppressEmit) return;
      const target = this.scrollDelta?.left ?? 0;
      if (el.scrollLeft !== target) {
        el.scrollLeft = target;
      }
    });

    // The horizontal scrollbar's height is bound to `getScrollHeight()`, which
    // reads the service's `scrollbarHeight`. That's a plain field updated during
    // `resize()`, so this OnPush component isn't marked dirty when it flips from
    // 0 → visible on a resize — leaving the scrollbar invisible until an
    // unrelated event (a click) happens to run CD here. Mark ourselves on every
    // resize so `resize()`'s tick actually re-renders the spacer.
    this.afterResizeSub = this.gridService.afterResize.subscribe(() => this.markForCheck());
  }

  override ngOnDestroy(): void {
    const el = this.scroller?.nativeElement as HTMLElement | undefined;
    el?.removeEventListener('scroll', this.onNativeScroll);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.afterScrollSub?.unsubscribe();
    this.afterResizeSub?.unsubscribe();
    super.ngOnDestroy();
  }

  // Native scroll events can fire many times per frame (especially with
  // trackpads). Capture the latest scrollLeft and dispatch one synchronisation
  // per animation frame, dropping any intermediate values the browser is going
  // to repaint past anyway.
  private onNativeScroll = (e: Event): void => {
    this.pendingScrollLeft = (e.target as HTMLElement).scrollLeft;
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.suppressEmit = true;
      try {
        this.dispatchScroll(this.pendingScrollLeft);
      } finally {
        this.suppressEmit = false;
      }
    });
  };

  private dispatchScroll(left: number): void {
    const delta = { left, top: this.scrollDelta.top };
    this.gridScrollService.scrollGrid(
      null as any,
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
