import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { IGridMenuBarComponent } from '../../interfaces/component-interfaces/grid-menu-bar.interface';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cw-grid-menu-bar',
  standalone: true,
  templateUrl: './grid-menu-bar.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class GridMenuBarComponent implements IGridMenuBarComponent {

  @Output() afterApplyFavoritesView: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('menuBar') menuBar: ElementRef | undefined;
  @ViewChild('pluginBar') pluginBar: ElementRef | undefined;

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
