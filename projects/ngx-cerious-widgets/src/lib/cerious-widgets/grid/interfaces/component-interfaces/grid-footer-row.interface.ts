import { ElementRef, QueryList } from "@angular/core";
import { GridRow } from "../../models/grid-row";
import { IGridFooterColumnComponent } from "./grid-footer-column.interface";
import { IGridFooterFeatureColumnComponent } from "./grid-footer-feature-column.interface";
import { ColumnDef } from "../column-def";

export interface IGridFooterRowComponent {
  gridRow: GridRow;
  columnComponents: QueryList<IGridFooterColumnComponent>;
  featureColumnComponent: IGridFooterFeatureColumnComponent;
  featureColumnWidth: string;
  hasHorizontalScrollbar: boolean;
  hasRowFeatures: boolean;
  hasVerticalScrollbar: boolean;
  pinnedColumns: ColumnDef[];
  getColumnWidth(column: any): string;
  el: ElementRef;
}
