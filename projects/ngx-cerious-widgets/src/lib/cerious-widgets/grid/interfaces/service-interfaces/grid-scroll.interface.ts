import { GridOptions } from "../grid-options";
import { Subject } from "rxjs";
import { ScrollDelta } from "../scroll-delta";
import { IGridHeaderComponent } from "../component-interfaces/grid-header.interface";
import { IGridBodyComponent } from "../component-interfaces/grid-body.interface";
import { IGridScrollerComponent } from "../component-interfaces/grid-scroller.interface";
import { IGridFooterComponent } from "../component-interfaces/grid-footer.interface";

export interface IGridScrollService {
  afterScroll: Subject<boolean>;
  scrollDelta: ScrollDelta
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
  ): void;
}