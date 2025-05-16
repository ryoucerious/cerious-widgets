import { ElementRef, QueryList } from "@angular/core";
import { IGridHeaderRowComponent } from "./grid-header-row.interface";
import { GridRow } from "../../models/grid-row";
import { ColumnDef } from "../column-def";

export interface IGridHeaderComponent {
  tableHead: ElementRef;
  rowComponents: QueryList<IGridHeaderRowComponent>;
  headerWidth: string;
  rowMinWidth: string;
  rows: GridRow[];
  gridOptions: any;
  os: string;
  tableScrollWidth: number;
  el: ElementRef;
  breadcrumb: ElementRef | undefined;

  onKeyDown(event: KeyboardEvent): void;
  removeGroupByColumn(column: ColumnDef): void;
}