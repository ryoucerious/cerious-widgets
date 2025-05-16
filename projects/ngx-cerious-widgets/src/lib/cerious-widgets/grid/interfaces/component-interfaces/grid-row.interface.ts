import { ElementRef, EventEmitter, QueryList } from "@angular/core";
import { GridRow } from "../../models/grid-row";
import { IGridRowColumnComponent } from "./grid-row-column.interface";
import { IGridRowFeatureColumnComponent } from "./grid-row-feature-column.interface";

export interface IGridRowComponent {
  gridRow: GridRow;
  toggleNestedRow: EventEmitter<GridRow>;
  columnComponents: QueryList<IGridRowColumnComponent>;
  featureColumnComponent: IGridRowFeatureColumnComponent;
  featureColumnWidth: string;
  hasHorizontalScrollbar: boolean;
  hasRowFeatures: boolean;
  hasVerticalScrollbar: boolean;
  pinnedColumns: any[];
  getColumnWidth(column: any): string;
  toggleNestedRowValue(gridRow: GridRow): void;
  el: ElementRef;
}