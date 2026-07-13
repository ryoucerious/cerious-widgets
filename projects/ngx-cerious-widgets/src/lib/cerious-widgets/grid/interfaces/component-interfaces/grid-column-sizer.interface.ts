import { ElementRef } from "@angular/core";
import { ColumnDef } from "../column-def";

export interface IGridColumnSizerComponent {
  column: ColumnDef;
  onPointerDown: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
  onPointerUp: (event: PointerEvent) => void;
  onClick: (event: MouseEvent) => void;
  el: ElementRef;
}
