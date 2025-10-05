import { Component, ElementRef, Inject, Input, signal, ViewEncapsulation } from '@angular/core';
import { ZonelessCompatibleComponent } from '../../../components/base/zoneless-compatible.component';
import { CommonModule } from '@angular/common';

import { ColumnDef } from '../../interfaces/column-def';
import { IGridFillerRowFeatureColumnComponent } from '../../interfaces/component-interfaces/grid-filler-row-feature-column.interface';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';

import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';

@Component({
  selector: 'cw-grid-filler-row-feature-column',
  standalone: true,
  templateUrl: './grid-filler-row-feature-column.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class GridFillerRowFeatureColumnComponent extends ZonelessCompatibleComponent implements IGridFillerRowFeatureColumnComponent {

  readonly columnSignal = signal<ColumnDef | undefined>(undefined);

  @Input()
  set column(value: ColumnDef) { this.columnSignal.set(value); }
  get column() { return this.columnSignal()!; }

  get featureColumnWidth() {
    return this.gridColumnService.getFeatureColumnWidth(
      this.gridService.getFeatureCount(),
      this.gridService.gridOptions
    );
  }

  get fillerRowHeight() {
    return this.gridService.fillerRowHeight;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) {
    super();
  }
}
