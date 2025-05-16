import { ElementRef } from "@angular/core";
import { ColumnDef } from "../column-def";

export interface IGridColumnSizerComponent {
  column: ColumnDef;
  onMouseDown: (event: MouseEvent) => void;
  onMouseUp: (event: MouseEvent) => void;
  el: ElementRef;
}
