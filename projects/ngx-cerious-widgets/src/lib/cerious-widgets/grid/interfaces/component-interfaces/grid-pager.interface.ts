import { ElementRef } from "@angular/core";
import { PagerInfo } from "../pager-info";

export interface IGridPagerComponent {
  pagerInfo: PagerInfo;
  gridDataset: any;
  gridOptions: any;
  tablePager: ElementRef;
  el: ElementRef;
  gridPageClick(pageNumber: number): void;
}
