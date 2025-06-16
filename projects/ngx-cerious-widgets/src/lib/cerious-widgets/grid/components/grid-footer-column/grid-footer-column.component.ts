import { Component, ElementRef, Inject, Input, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColumnDef } from '../../interfaces/column-def';
import { IGridFooterColumnComponent } from '../../interfaces/component-interfaces/grid-footer-column.interface';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';

import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { SectionClassConfig } from '../../interfaces';

@Component({
  selector: 'cw-grid-footer-column',
  standalone: true,
  templateUrl: './grid-footer-column.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class GridFooterColumnComponent implements IGridFooterColumnComponent {

  readonly columnSignal = signal<ColumnDef | undefined>(undefined);

  @Input()
  set column(value: ColumnDef) { this.columnSignal.set(value); }
  get column() { return this.columnSignal()!; }

  @Input() classes: SectionClassConfig = {};

  get templates() {
    return this.gridService.templates;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) { }

  /**
   * Retrieves the width of the grid column as a string.
   *
   * @returns {string} The width of the column, as determined by the grid column service
   *          and the grid options from the grid service.
   */
  getWidth(): string {
    return this.gridColumnService.getColumnWidth(this.column, this.gridService.gridOptions);
  }
}
