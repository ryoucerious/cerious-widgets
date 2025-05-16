import { ElementRef, QueryList, TemplateRef } from "@angular/core";
import { GridRow } from "../../models/grid-row";
import { GridOptions } from "../grid-options";
import { IGridNestedRowColumnComponent } from "./grid-nested-row-column.interface";

export interface IGridNestedRowComponent {
  gridRow: GridRow;
  columnComponents: QueryList<IGridNestedRowColumnComponent>;
  gridOptions: GridOptions;
  templates: { [key: string]: TemplateRef<any> };
  el: ElementRef;
}
