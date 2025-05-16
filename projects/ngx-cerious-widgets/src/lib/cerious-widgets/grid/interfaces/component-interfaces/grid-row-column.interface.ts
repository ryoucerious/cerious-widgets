import { ElementRef, TemplateRef } from "@angular/core";
import { GridRow } from "../../models/grid-row";
import { ColumnDef } from "../column-def";

export interface IGridRowColumnComponent {
  column: ColumnDef;
  gridRow: GridRow
  templates: { [key: string]: TemplateRef<any> };
  el: ElementRef;
  getWidth(): string;
  getValue(gridRow: GridRow, column: ColumnDef): any;
}
