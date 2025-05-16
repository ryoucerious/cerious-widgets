import { QueryList } from "@angular/core";
import { GridRow } from "../../models/grid-row";
import { IGridFillerRowColumnComponent } from "./grid-filler-row-column.interface";
import { IGridFillerRowFeatureColumnComponent } from "./grid-filler-row-feature-column.interface";
import { GridDataset } from "../grid-dataset";
import { ColumnDef } from "../column-def";
import { GridOptions } from "../grid-options";

export interface IGridFillerRowComponent {
  gridRow: GridRow;
  columnComponents: QueryList<IGridFillerRowColumnComponent>;
  featureColumnComponent: IGridFillerRowFeatureColumnComponent;
  featureColumnWidth: string;
  hasHorizontalScrollbar: boolean;
  hasRowFeatures: boolean;
  hasVerticalScrollbar: boolean;
  gridDataset: GridDataset;
  pinnedColumns: ColumnDef[];
  gridOptions: GridOptions;
  getColumnWidth(column: ColumnDef): string;
}
