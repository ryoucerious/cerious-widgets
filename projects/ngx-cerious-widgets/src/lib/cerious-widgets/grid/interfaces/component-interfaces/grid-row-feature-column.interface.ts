import { ElementRef, EventEmitter, TemplateRef } from "@angular/core";
import { GridRow } from "../../models/grid-row";
import { GridOptions } from "../grid-options";

export interface IGridRowFeatureColumnComponent {
  toggleNestedRow: EventEmitter<GridRow>;
  gridRow: GridRow;
  featureColumnWidth: string;
  featureWidth: string;
  gridOptions: GridOptions;
  templates: { [key: string]: TemplateRef<any> };
  el: ElementRef;
  selectRow(): void;
  toggleNestedRowValue(gridRow: GridRow): void;
}
