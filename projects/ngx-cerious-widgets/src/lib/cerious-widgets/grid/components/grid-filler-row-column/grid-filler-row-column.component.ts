import { Component, ElementRef, Inject, Input, signal, ViewEncapsulation } from '@angular/core';
import { ZonelessCompatibleComponent } from '../../../components/base/zoneless-compatible.component';
import { CommonModule } from '@angular/common';

import { ColumnDef } from '../../interfaces/column-def';
import { GridRow } from '../../models/grid-row';

import { IGridFillerRowColumnComponent } from '../../interfaces/component-interfaces/grid-filler-row-column.interface';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';

import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';

@Component({
  selector: 'cw-grid-filler-row-column',
  standalone: true,
  templateUrl: './grid-filler-row-column.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class GridFillerRowColumnComponent extends ZonelessCompatibleComponent implements IGridFillerRowColumnComponent {
  
  readonly columnSignal = signal<ColumnDef | undefined>(undefined);
  readonly gridRowSignal = signal<GridRow | undefined>(undefined);

  @Input()
  set column(value: ColumnDef) { this.columnSignal.set(value); }
  get column() { return this.columnSignal()!; }

  @Input()
  set gridRow(value: GridRow) { this.gridRowSignal.set(value); }
  get gridRow() { return this.gridRowSignal()!; }

  get fillerRowHeight() {
    return this.gridService.fillerRowHeight;
  }

  get templates() {
    return this.gridService.templates;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) {
    super();
  }

  getWidth(): string {
    return this.gridColumnService.getColumnWidth(this.column, this.gridService.gridOptions);
  }
}
