import { ElementRef, QueryList } from "@angular/core";
import { IGridFooterRowComponent } from "./grid-footer-row.interface";
import { GridDataset } from "../grid-dataset";
import { GridOptions } from "../grid-options";
import { GridRow } from "../../models/grid-row";

export interface IGridFooterComponent {
  tableFooter: ElementRef;
  rowComponents: QueryList<IGridFooterRowComponent>
  gridDataset: GridDataset;
  gridOptions: GridOptions;
  headerWidth: string;
  rowMinWidth: string;
  rows: GridRow[];
  os: string;
  el: ElementRef;
}