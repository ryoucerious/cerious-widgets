import { Component, ContentChild, ElementRef, Inject, Input, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ZonelessCompatibleComponent } from '../../../components/base/zoneless-compatible.component';
import { CommonModule } from '@angular/common';
import { GridColumnSizerComponent } from '../grid-column-sizer/grid-column-sizer.component';

import { IGridHeaderColumnComponent } from '../../interfaces/component-interfaces/grid-header-column.interface';
import { ColumnDef } from '../../interfaces/column-def';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';

import { GridRow } from '../../models/grid-row';

import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { SectionClassConfig } from '../../interfaces';

@Component({
  selector: 'cw-grid-header-column',
  standalone: true,
  templateUrl: './grid-header-column.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, GridColumnSizerComponent]
})
export class GridHeaderColumnComponent extends ZonelessCompatibleComponent implements IGridHeaderColumnComponent {

  readonly columnSignal = signal<ColumnDef | undefined>(undefined);
  readonly gridRowSignal = signal<GridRow | undefined>(undefined);

  @Input()
  set column(value: ColumnDef) { this.columnSignal.set(value); }
  get column() { return this.columnSignal()!; }

  @Input()
  set gridRow(value: GridRow) { this.gridRowSignal.set(value); }
  get gridRow() { return this.gridRowSignal()!; }

  @Input() classes: SectionClassConfig = {};

  @ContentChild("cellTemplate") cellTemplate!: TemplateRef<any>;

  cellTemplates: any = {};

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
}
