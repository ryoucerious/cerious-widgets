import { ElementRef, QueryList, TemplateRef } from "@angular/core";
import { GridRow } from "../../models/grid-row";
import { IGridFillerRowComponent } from "./grid-filler-row.interface";
import { IGridRowComponent } from "./grid-row.interface";
import { IGridNestedRowComponent } from "./grid-nested-row.interface";
import { ScrollDelta } from "../scroll-delta";
import { GridOptions } from "../grid-options";

export interface IGridBodyComponent {
  tableBody: ElementRef;
  fillerRowComponents: QueryList<IGridFillerRowComponent>;
  rowComponents: QueryList<IGridRowComponent>;
  nestedRowComponents: QueryList<IGridNestedRowComponent>;
  fillerRowHeight: number;
  rowMinWidth: string;
  rows: GridRow[];
  fillerRows: GridRow[];
  scrollDelta: ScrollDelta;
  gridOptions: GridOptions;
  groupHeaders: QueryList<ElementRef>;
  templates: { [key: string]: TemplateRef<any> };

  onClick: (event: MouseEvent) => void;
  onKeypress: (event: KeyboardEvent) => void;
  onKeydown: (event: KeyboardEvent) => void;
  onKeyup: (event: KeyboardEvent) => void;
  toggleNestedRow: (row: GridRow) => void;
  el: ElementRef
}
