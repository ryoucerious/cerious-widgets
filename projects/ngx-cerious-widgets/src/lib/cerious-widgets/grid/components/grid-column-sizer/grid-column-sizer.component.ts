import { Component, ElementRef, Inject, Input, ViewEncapsulation } from '@angular/core';
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
export class GridColumnSizerComponent implements IGridColumnSizerComponent {

  @Input() column!: ColumnDef;

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
  ) { }

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
