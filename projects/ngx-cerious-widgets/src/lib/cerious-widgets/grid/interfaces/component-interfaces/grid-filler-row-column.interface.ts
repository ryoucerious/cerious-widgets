import { ElementRef, TemplateRef } from "@angular/core";
import { GridRow } from "../../models/grid-row";
import { ColumnDef } from "../column-def";

export interface IGridFillerRowColumnComponent {
  column: ColumnDef;
  gridRow: GridRow;
  fillerRowHeight: number;
  templates: { [key: string]: TemplateRef<any> };
  getWidth(): string;
  el: ElementRef;
}
