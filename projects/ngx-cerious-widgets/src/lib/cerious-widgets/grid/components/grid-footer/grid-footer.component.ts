import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ZonelessCompatibleComponent } from '../../../components/base/zoneless-compatible.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';

import { IGridFooterComponent } from '../../interfaces/component-interfaces/grid-footer.interface';
import { IGridFooterRowComponent } from '../../interfaces/component-interfaces/grid-footer-row.interface';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';

import { GridFooterRowComponent } from '../grid-footer-row/grid-footer-row.component';
import { SectionClassConfig } from '../../interfaces/section-class-config-interface';

@Component({
  selector: 'cw-grid-footer',
  standalone: true,
  templateUrl: './grid-footer.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, GridFooterRowComponent]
})
export class GridFooterComponent extends ZonelessCompatibleComponent implements IGridFooterComponent, AfterViewInit, OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];

  @ViewChild('tableFooter') tableFooter!: ElementRef;
  @ViewChildren(GridFooterRowComponent) rowComponents!: QueryList<IGridFooterRowComponent>;

  @Input() classes: SectionClassConfig = {};

  get gridDataset() {
    return this.gridService.gridDataset;
  }

  get gridOptions() {
    return this.gridService.gridOptions;
  }

  get headerWidth() {
    return this.gridService.headerWidth;
  }

  get rowMinWidth() {
    return parseInt(this.gridService.rowMinWidth) + (this.gridService.hasVerticalScrollbar ? this.gridService.scrollbarWidth : 0) + 'px';
  }

  get rows() {
    return this.gridService.gridDataset.footerRows;
  }

  get os() {
    return this.gridService.os;
  }

  constructor(
    public el: ElementRef,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(this.gridService.afterRender.subscribe(() => this.flattenColumnsForRows()));
  }

  ngAfterViewInit(): void {
    setTimeout(() => setTimeout(() => this.flattenColumnsForRows()));
  }

  override ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    super.ngOnDestroy();
  }

  // Flatten nested columns for all rows
  private flattenColumnsForRows(): void {
    if (!this.rows) {
      return;
    }
    // Flatten columns for each row
    this.rows.forEach(row => {
      row.columnDefs = this.gridColumnService.flattenColumns(row.columnDefs);
    });
  }
}
