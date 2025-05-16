import { ElementRef } from "@angular/core";
import { ColumnDef } from "../column-def";

export interface IGridFillerRowFeatureColumnComponent {
  column: ColumnDef;
  featureColumnWidth: string;
  fillerRowHeight: number;
  el: ElementRef
}
