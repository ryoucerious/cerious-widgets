import { Component, ElementRef, Inject, Input, signal, ViewEncapsulation } from '@angular/core';
import { ZonelessCompatibleComponent } from '../../../components/base/zoneless-compatible.component';
import { CommonModule } from '@angular/common';

import { IGridNestedRowColumnComponent } from '../../interfaces/component-interfaces/grid-nested-row-column.interface';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { GridRow } from '../../models/grid-row';
import { GRID_SERVICE } from '../../tokens/grid-service.token';

@Component({
  selector: 'cw-nested-row-column',
  standalone: true,
  templateUrl: './grid-nested-row-column.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class GridNestedRowColumnComponent extends ZonelessCompatibleComponent implements IGridNestedRowColumnComponent {

  readonly gridRowSignal = signal<GridRow | undefined>(undefined);

  @Input()
  set gridRow(value: GridRow) { this.gridRowSignal.set(value); }
  get gridRow() { return this.gridRowSignal()!; }

  get gridOptions() {
    return this.gridService.gridOptions;
  }

  get templates() {
    return this.gridService.templates;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService
  ) {
    super();
  }

}
