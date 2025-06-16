import { Component, ElementRef, EventEmitter, Inject, Input, Output, signal, Signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { IGridMenuBarComponent } from '../../interfaces/component-interfaces/grid-menu-bar.interface';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { CommonModule } from '@angular/common';
import { SignalHelperService } from '../../../shared/services/signal-helper.services';

@Component({
  selector: 'cw-grid-menu-bar',
  standalone: true,
  templateUrl: './grid-menu-bar.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class GridMenuBarComponent implements IGridMenuBarComponent {

  readonly afterApplyFavoritesViewSignal = signal<boolean>(true);
  @Output() afterApplyFavoritesView = this.sh.toEventEmitter(this.afterApplyFavoritesViewSignal);

  @ViewChild('menuBar') menuBar: ElementRef | undefined;
  @ViewChild('pluginBar') pluginBar: ElementRef | undefined;

  @Input() menuBarClasses: string = '';

  get gridOptions() {
    return this.gridService.gridOptions;
  }

  get templates() {
    return this.gridService.templates;
  }
  
  constructor(
    public el: ElementRef,
    private sh: SignalHelperService,
    @Inject(GRID_SERVICE) private gridService: IGridService
  ) { }

}
