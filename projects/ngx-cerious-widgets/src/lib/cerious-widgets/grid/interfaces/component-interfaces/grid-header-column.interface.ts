import { ElementRef, TemplateRef } from "@angular/core";
import { GridRow } from "../../models/grid-row";
import { ColumnDef } from "../column-def";

export interface IGridHeaderColumnComponent {
  column: ColumnDef;
  gridRow: GridRow;
  templates: { [key: string]: TemplateRef<any> };
  el: ElementRef;
  cellTemplate: TemplateRef<any>;
  cellTemplates: any;
  getWidth(): string;
}
