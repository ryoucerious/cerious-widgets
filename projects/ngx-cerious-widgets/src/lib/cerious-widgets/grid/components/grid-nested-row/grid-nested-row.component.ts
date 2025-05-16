import { Component, ElementRef, Inject, Input, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { IGridNestedRowComponent } from '../../interfaces/component-interfaces/grid-nested-row.interface';
import { GridRow } from '../../models/grid-row';
import { GridNestedRowColumnComponent } from '../grid-nested-row-column/grid-nested-row-column.component';
import { IGridNestedRowColumnComponent } from '../../interfaces/component-interfaces/grid-nested-row-column.interface';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';

@Component({
  selector: 'cw-nested-row',
  templateUrl: './grid-nested-row.component.html',
      encapsulation: ViewEncapsulation.None
})
export class GridNestedRowComponent implements IGridNestedRowComponent {

  @Input() gridRow!: GridRow;

  @ViewChildren(GridNestedRowColumnComponent) columnComponents!: QueryList<IGridNestedRowColumnComponent>;

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
