import { ElementRef, TemplateRef } from "@angular/core";
import { ColumnDef } from "../column-def";

export interface IGridFooterColumnComponent {
  column: ColumnDef;
  templates: { [key: string]: TemplateRef<any> };
  getWidth(): string;
  el: ElementRef
}
