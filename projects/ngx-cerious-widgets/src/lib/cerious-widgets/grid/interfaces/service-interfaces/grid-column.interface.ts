import { GridDataset } from "../grid-dataset";
import { ColumnDef } from "../column-def";
import { IGridBodyComponent } from "../component-interfaces/grid-body.interface";
import { IGridFooterComponent } from "../component-interfaces/grid-footer.interface";
import { IGridHeaderComponent } from "../component-interfaces/grid-header.interface";
import { GridOptions } from "../grid-options";
import { ScrollDelta } from "../scroll-delta";

export interface IGridColumnService {
  flattenColumns(columns: ColumnDef[]): ColumnDef[];
  getColumnById(id: string, columns: ColumnDef[]): ColumnDef | null;
  getColumnWidth(column: ColumnDef, gridOptions: GridOptions): string;
  getFeatureColumnWidth(featureCount: number, gridOptions: GridOptions): string;
  getFeatureWidth(gridOptions: GridOptions): number;
  processGridDefs(gridOptions: GridOptions, gridDataset: GridDataset): void;
  getPinnedColumns(rowComponents?: Array<any>): Array<any>;
  updatePinnedColumnPos(
    gridHeader: IGridHeaderComponent,
    gridBody: IGridBodyComponent,
    gridFooter: IGridFooterComponent,
    gridOptions: GridOptions,
    scrollDelta: ScrollDelta
  ): void;
}