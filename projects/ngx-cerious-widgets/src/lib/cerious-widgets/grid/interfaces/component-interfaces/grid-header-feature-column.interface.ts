import { ElementRef, TemplateRef } from "@angular/core";
import { GridOptions } from "../grid-options";

export interface IGridHeaderFeatureColumnComponent {
  selected: boolean;
  featureWidth: string;
  gridOptions: GridOptions;
  templates: { [key: string]: TemplateRef<any> };
  el: ElementRef;
  selectAll(): void;
}