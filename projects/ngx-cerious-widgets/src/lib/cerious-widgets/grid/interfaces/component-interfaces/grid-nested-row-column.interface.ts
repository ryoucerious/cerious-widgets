import { ElementRef, TemplateRef } from "@angular/core";
import { GridOptions } from "../grid-options";
import { GridRow } from "../../models/grid-row";

export interface IGridNestedRowColumnComponent {
  gridRow: GridRow;
  gridOptions: GridOptions;
  templates: { [key: string]: TemplateRef<any> };
  el: ElementRef;
}
