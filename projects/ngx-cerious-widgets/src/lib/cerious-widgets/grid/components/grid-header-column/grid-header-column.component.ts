import { Component, ContentChild, ElementRef, Inject, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { IGridHeaderColumnComponent } from '../../interfaces/component-interfaces/grid-header-column.interface';
import { GridRow } from '../../models/grid-row';
import { ColumnDef } from '../../interfaces/column-def';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';

@Component({
  selector: 'cw-grid-header-column',
  templateUrl: './grid-header-column.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GridHeaderColumnComponent implements IGridHeaderColumnComponent {

  @Input() column!: ColumnDef;
  @Input() gridRow!: GridRow;

  @ContentChild("cellTemplate") cellTemplate!: TemplateRef<any>;

  cellTemplates: any = {};

  get templates() {
    return this.gridService.templates;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) {}

  /**
   * Retrieves the width of the grid header column.
   * If a cell template is defined, the width is set to '100%'.
   * Otherwise, it calculates the width based on the column configuration
   * and grid options provided by the grid services.
   *
   * @returns {string} The width of the grid header column as a string.
   */
  getWidth(): string {
    return this.cellTemplate ? '100%' : this.gridColumnService.getColumnWidth(this.column, this.gridService.gridOptions);
  }

  /**
   * Determines whether the menu should be displayed for the current column.
   * 
   * @returns `true` if the column does not have a parent (indicating it is a top-level column),
   *          otherwise `false`.
   */
  shouldShowMenu(): boolean {
    return !(this.column.parent);
  }
}
