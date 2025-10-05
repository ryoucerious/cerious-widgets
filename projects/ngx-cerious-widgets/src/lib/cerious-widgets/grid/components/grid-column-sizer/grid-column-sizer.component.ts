import { Component, ElementRef, Inject, Input, signal, ViewEncapsulation } from '@angular/core';
import { ZonelessCompatibleComponent } from '../../../components/base/zoneless-compatible.component';
import { CommonModule } from '@angular/common';
import { ColumnDef } from '../../interfaces/column-def';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnSizerComponent } from '../../interfaces/component-interfaces/grid-column-sizer.interface';
import { GRID_SERVICE } from '../../tokens/grid-service.token';

@Component({
  selector: 'cw-grid-column-sizer',
  standalone: true,
  templateUrl: './grid-column-sizer.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class GridColumnSizerComponent extends ZonelessCompatibleComponent implements IGridColumnSizerComponent {

  readonly columnSignal = signal<ColumnDef | undefined>(undefined);

  @Input()
  set column(value: ColumnDef) { this.columnSignal.set(value); }
  get column() { return this.columnSignal()!; }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
  ) {
    super();
  }

  onMouseDown(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.gridService.initColumnResizing(this.column, e);
  }

  onMouseUp(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.gridService.endColumnResizing();
  }
}
