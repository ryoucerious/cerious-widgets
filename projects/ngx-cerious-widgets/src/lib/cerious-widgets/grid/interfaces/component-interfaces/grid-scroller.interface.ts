import { ElementRef } from "@angular/core";
import { ScrollDelta } from "../scroll-delta";

export interface IGridScrollerComponent {
  scroller: ElementRef;
  hasHorizontalScrollbar: boolean;
  hasVerticalScrollbar: boolean;
  moddedColumnWidth: number;
  pinnedColumnWidth: number;
  tableScrollHeight: number;
  tableScrollWidth: number;
  scrollDelta: ScrollDelta;
  el: ElementRef;
  getScrollHeight(): number;
  getWidth(): number;
  scrollGrid(e: any): void;
}
