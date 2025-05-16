import { Component, ElementRef, Inject, Input, ViewEncapsulation } from '@angular/core';
import { IGridNestedRowColumnComponent } from '../../interfaces/component-interfaces/grid-nested-row-column.interface';
import { GridRow } from '../../models/grid-row';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';

@Component({
  selector: 'cw-nested-row-column',
  templateUrl: './grid-nested-row-column.component.html',
      encapsulation: ViewEncapsulation.None
})
export class GridNestedRowColumnComponent implements IGridNestedRowColumnComponent {

  @Input() gridRow!: GridRow;

  get gridOptions() {
    return this.gridService.gridOptions;
  }

  get templates() {
    return this.gridService.templates;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService
  ) { }

}
