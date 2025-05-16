import { ElementRef, QueryList } from "@angular/core";
import { GridRow } from "../../models/grid-row";
import { IGridHeaderColumnComponent } from "./grid-header-column.interface";
import { IGridHeaderFeatureColumnComponent } from "./grid-header-feature-column.interface";
import { GridOptions } from "../grid-options";
import { ColumnDef } from "../column-def";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

export interface IGridHeaderRowComponent {
  dropId: string;
  gridRow: GridRow;
  isChildRow: boolean;
  columnComponents: QueryList<IGridHeaderColumnComponent>;
  childRowComponents: QueryList<IGridHeaderRowComponent>;
  featureColumnComponent: IGridHeaderFeatureColumnComponent;
  featureColumnWidth: string;
  gridOptions: GridOptions;
  hasHorizontalScrollbar: boolean;
  hasRowFeatures: boolean;
  hasVerticalScrollbar: boolean;
  rowMinWidth: string;
  pinnedColumns: ColumnDef[];
  el: ElementRef;
  drop: (event: CdkDragDrop<any[]>) => void;
  getColumnWidth: (column: ColumnDef) => string;
  getColspan: (column: ColumnDef) => number;
  getParentWidth: (column: ColumnDef) => string;
  getRowspan: (column: ColumnDef) => number;
  getNewRow: (column: ColumnDef) => GridRow;
  shouldShowColumn: (column: ColumnDef) => boolean;
  shouldShowMenu: (column: ColumnDef) => boolean;
}
