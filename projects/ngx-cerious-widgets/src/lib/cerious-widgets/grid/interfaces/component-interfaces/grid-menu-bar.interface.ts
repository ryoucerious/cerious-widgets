import { ElementRef, EventEmitter, TemplateRef } from "@angular/core";
import { GridOptions } from "../grid-options";

export interface IGridMenuBarComponent {
  afterApplyFavoritesView: EventEmitter<boolean>;
  menuBar: ElementRef | undefined;
  pluginBar: ElementRef | undefined;
  gridOptions: GridOptions;
  templates: { [key: string]: TemplateRef<any> };
  el: ElementRef;
}
