import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { GridColumnSizerComponent } from "./grid-column-sizer/grid-column-sizer.component";
import { GridHeaderComponent } from "./grid-header/grid-header.component";
import { GridBodyComponent } from "./grid-body/grid-body.component";
import { GridFooterComponent } from "./grid-footer/grid-footer.component";
import { GridPagerComponent } from "./grid-pager/grid-pager.component";
import { GridRowComponent } from "./grid-row/grid-row.component";
import { GridMenuBarComponent } from "./grid-menu-bar/grid-menu-bar.component";
import { GridScrollerComponent } from "./grid-scroller/grid-scroller.component";
import { GridRowColumnComponent } from "./grid-row-column/grid-row-column.component";
import { GridHeaderColumnComponent } from "./grid-header-column/grid-header-column.component";
import { GridHeaderRowComponent } from "./grid-header-row/grid-header-row.component";
import { GridRowFeatureColumnComponent } from "./grid-row-feature-column/grid-row-feature-column.component";
import { GridHeaderFeatureColumnComponent } from "./grid-header-feature-column/grid-header-feature-column.component";
import { GridFooterRowComponent } from "./grid-footer-row/grid-footer-row.component";
import { GridFooterColumnComponent } from "./grid-footer-column/grid-footer-column.component";
import { GridFooterFeatureColumnComponent } from "./grid-footer-feature-column/grid-footer-feature-column.component";
import { GridFillerRowComponent } from "./grid-filler-row/grid-filler-row.component";
import { GridFillerRowColumnComponent } from "./grid-filler-row-column/grid-filler-row-column.component";
import { GridFillerRowFeatureColumnComponent } from "./grid-filler-row-feature-column/grid-filler-row-feature-column.component";
import { GridNestedRowComponent } from "./grid-nested-row/grid-nested-row.component";
import { GridNestedRowColumnComponent } from "./grid-nested-row-column/grid-nested-row-column.component";
import { GRID_SERVICE } from "../tokens/grid-service.token";
import { GridService } from "../services/grid.service";
import { GRID_COLUMN_SERVICE } from "../tokens/grid-column-service.token";
import { GridColumnService } from "../services/grid-column.service";
import { GRID_SCROLL_SERVICE } from "../tokens/grid-scroll-services.token";
import { GridScrollService } from "../services/grid-scroll.service";

@NgModule({
  declarations: [
    GridColumnSizerComponent,
    GridHeaderComponent,
    GridBodyComponent,
    GridFooterComponent,
    GridPagerComponent,
    GridRowComponent,
    GridMenuBarComponent,
    GridScrollerComponent,
    GridRowColumnComponent,
    GridHeaderColumnComponent,
    GridHeaderRowComponent,
    GridRowFeatureColumnComponent,
    GridHeaderFeatureColumnComponent,
    GridFooterRowComponent,
    GridFooterColumnComponent,
    GridFooterFeatureColumnComponent,
    GridFillerRowComponent,
    GridFillerRowColumnComponent,
    GridFillerRowFeatureColumnComponent,
    GridNestedRowComponent,
    GridNestedRowColumnComponent
  ],
  imports: [
    CommonModule,
    DragDropModule
  ],
  providers: [
    { provide: GRID_SERVICE, useClass: GridService },
    { provide: GRID_COLUMN_SERVICE, useClass: GridColumnService },
    { provide: GRID_SCROLL_SERVICE, useClass: GridScrollService },
  ],
  exports: [
    GridColumnSizerComponent,
    GridHeaderComponent,
    GridBodyComponent,
    GridFooterComponent,
    GridPagerComponent,
    GridRowComponent,
    GridMenuBarComponent,
    GridScrollerComponent,
    GridRowColumnComponent,
    GridHeaderColumnComponent,
    GridHeaderRowComponent,
    GridRowFeatureColumnComponent,
    GridHeaderFeatureColumnComponent,
    GridFooterRowComponent,
    GridFooterColumnComponent,
    GridFooterFeatureColumnComponent,
    GridFillerRowComponent,
    GridFillerRowColumnComponent,
    GridFillerRowFeatureColumnComponent,
    GridNestedRowComponent,
    GridNestedRowColumnComponent
  ]
})
export class GridComponentsModule {
  constructor() { }
}
