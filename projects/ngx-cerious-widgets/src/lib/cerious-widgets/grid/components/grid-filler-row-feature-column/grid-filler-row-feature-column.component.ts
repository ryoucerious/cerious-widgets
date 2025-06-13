import { Component, ElementRef, Inject, Input, ViewEncapsulation } from '@angular/core';
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
export class GridFillerRowFeatureColumnComponent implements IGridFillerRowFeatureColumnComponent {

  @Input() column!: ColumnDef

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
  ) { }
}
