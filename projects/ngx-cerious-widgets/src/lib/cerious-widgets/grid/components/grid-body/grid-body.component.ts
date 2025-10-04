import { AfterViewInit, Component, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { GridFillerRowComponent } from '../grid-filler-row/grid-filler-row.component';
import { GridRowComponent } from '../grid-row/grid-row.component';
import { GridNestedRowComponent } from '../grid-nested-row/grid-nested-row.component';
import { ZonelessCompatibleComponent } from '../../../components/base/zoneless-compatible.component';

import { IGridBodyComponent } from '../../interfaces/component-interfaces/grid-body.interface';
import { IGridFillerRowComponent } from '../../interfaces/component-interfaces/grid-filler-row.interface';
import { IGridRowComponent } from '../../interfaces/component-interfaces/grid-row.interface';
import { IGridNestedRowComponent } from '../../interfaces/component-interfaces/grid-nested-row.interface';

import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { IGridScrollService } from '../../interfaces/service-interfaces/grid-scroll.interface';

import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { GRID_SCROLL_SERVICE } from '../../tokens/grid-scroll-services.token';

import { GridRow } from '../../models/grid-row';
import { GridDataset } from '../../interfaces/grid-dataset';
import { GridOptions } from '../../interfaces/grid-options';
import { ScrollDelta } from '../../interfaces/scroll-delta';
import { SectionClassConfig } from '../../interfaces/section-class-config-interface';

@Component({
  selector: 'cw-grid-body',
  standalone: true,
  templateUrl: './grid-body.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, GridFillerRowComponent, GridRowComponent, GridNestedRowComponent]
})
export class GridBodyComponent extends ZonelessCompatibleComponent implements IGridBodyComponent, AfterViewInit, OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];
  private rowHeight = 30;
  private buffer = 10;
  private resizeObservers: ResizeObserver[] = [];
  private flattenedRows: any[] = [];
  private scrollTimeout: any = null;
  private isWheelScrolling = false;

  expandedGroups: { [key: string]: boolean } = {};
  expandedGroupData: { [key: string]: any[] } = {};
  visibleRows: any[] = [];
  startIndex = 0;
  endIndex = 0;
  rowHeights: Map<number | string, number> = new Map();
  totalHeight = 0; // Total height of all rows
  topOffset = '0px'; // Top offset for the grid body
  bottomOffset = '0px'; // Bottom offset for the grid body

  @Input() classes: SectionClassConfig = {};
  
  @ViewChild('tableBody', { static: true }) tableBody!: ElementRef;
  @ViewChildren(GridFillerRowComponent) fillerRowComponents!: QueryList<IGridFillerRowComponent>;
  @ViewChildren(GridRowComponent) rowComponents!: QueryList<IGridRowComponent>;
  @ViewChildren(GridNestedRowComponent) nestedRowComponents!: QueryList<IGridNestedRowComponent>;
  @ViewChildren('groupHeader') groupHeaders!: QueryList<ElementRef>;

  get fillerRowHeight(): number {
    return this.gridService.fillerRowHeight;
  }
  
  get rowMinWidth(): string {
    return this.gridService.rowMinWidth;
  }

  get rows(): GridRow[] {
    return this.gridService.gridDataset.bodyRows;
  }

  get fillerRows(): GridRow[] {
    return this.gridService.gridDataset.fillerRows;
  }

  get scrollDelta(): ScrollDelta {
    return this.gridScrollService.scrollDelta;
  }

  get gridOptions(): GridOptions {
    return this.gridService.gridOptions;
  }

  get gridDataset(): GridDataset {
    return this.gridService.gridDataset;
  }

  get templates(): { [key: string]: TemplateRef<any> } {
    return this.gridService.templates;
  }

  constructor(
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService,
    @Inject(GRID_SCROLL_SERVICE) private gridScrollService: IGridScrollService,
    public el: ElementRef,
    private zone: NgZone
  ) {
    super();
  }

  ngOnInit(): void {
    try {
      this.subscriptions.push(this.gridScrollService.afterScroll.subscribe(() => {
        this.calculateTotalHeight();
        this.updateVisibleRows();
        setTimeout(() => this.measureRowHeightsAndCorrect());
      }));
      this.subscriptions.push(this.gridService.afterResize.subscribe(() => {
        this.calculateTotalHeight();
        this.updateVisibleRows();
        setTimeout(() => this.measureRowHeightsAndCorrect());
      }));
      this.subscriptions.push(this.gridService.afterGroupBy.subscribe(() => {
        setTimeout(() => {
          this.flattenData();
          this.calculateTotalHeight();
          this.updateVisibleRows();
          setTimeout(() => this.measureRowHeightsAndCorrect());
        });
      }));
      this.subscriptions.push(this.gridService.afterRender.subscribe(() => {
        this.flattenData();
        setTimeout(() => this.measureRowHeightsAndCorrect());
      }));
    } catch (error) {
      console.error('Error during initialization in GridBodyComponent:', error);
    }
  }

  ngAfterViewInit(): void {
    try {
      setTimeout(() => {
        this.gridService.updateGridHeight();
        this.flattenData();
        this.calculateTotalHeight();
        this.updateVisibleRows();
        this.measureRowHeightsAndCorrect();
      });
    } catch (error) {
      console.error('Error in ngAfterViewInit in GridBodyComponent:', error);
    }
  }

  override ngOnDestroy(): void {
    try {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.resizeObservers.forEach(observer => observer.disconnect());
      
      // Clean up scroll timeout to prevent memory leaks
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = null;
      }
    } catch (error) {
      console.error('Error during destruction in GridBodyComponent:', error);
    }
    
    // Call parent cleanup
    super.ngOnDestroy();
  }

  /**
   * Retrieves the label for a grouped column at a specified group level.
   *
   * @param groupLevel - The level of the group for which the column label is being retrieved.
   * @returns The label of the grouped column. If the column definition is not found,
   *          or if no label or field is specified, it defaults to 'Group'.
   */
  getGroupColumnLabel(groupLevel: number): string {
    const groupByColumns = this.gridDataset.groupByColumns || [];
    const column = groupByColumns[groupLevel];

    return column ? (column.label || column.field || 'Group') : 'Group';
  }


  /**
   * Handles the click event on the grid body.
   * 
   * This method determines the cell and row associated with the click event
   * and emits the appropriate events (`cellClick` and `rowClick`) through the
   * `gridService`.
   * 
   * - If a cell is clicked, the `cellClick` event is emitted with details about
   *   the event, the row data, the cell value, the field name, and the cell's
   *   element reference.
   * - If a row is clicked, the `rowClick` event is emitted with details about
   *   the event, the row data, and the row's element reference.
   * 
   * @param e - The mouse event triggered by the click.
   */
  onClick(e: MouseEvent): void {
    const cell = this.getCellFromEvent(e);
    const row = this.getRowFromEvent(e);
    if (cell) {
      this.gridService.grid.cellClick.emit({event: e, row: row?.row, value: row?.row[cell.column.field], field: cell.column.field, elementRef: cell.el});
    }
    if (row) {
      this.gridService.grid.rowClick.emit({event: e, row: row.row, elementRef: row.elementRef});
    }
  }

  /**
   * Handles the double-click event on the grid body.
   * 
   * This method determines the cell and row associated with the double-click event
   * and emits the appropriate events (`cellDoubleClick` and `rowDoubleClick`) through
   * the `gridService`.
   * 
   * @param e - The mouse event triggered by the double-click action.
   * 
   * Emits:
   * - `cellDoubleClick`: If a cell is identified from the event, this emits an object containing:
   *   - `event`: The original mouse event.
   *   - `row`: The data of the row associated with the cell.
   *   - `value`: The value of the cell in the row.
   *   - `field`: The field name of the column associated with the cell.
   *   - `elementRef`: The reference to the cell's DOM element.
   * - `rowDoubleClick`: If a row is identified from the event, this emits an object containing:
   *   - `event`: The original mouse event.
   *   - `row`: The data of the row.
   *   - `elementRef`: The reference to the row's DOM element.
   */
  onDoubleClick(e: MouseEvent): void {
    const cell = this.getCellFromEvent(e);
    const row = this.getRowFromEvent(e);
    if (cell) {
      this.gridService.grid.cellDoubleClick.emit({event: e, row: row?.row, value: row?.row[cell.column.field], field: cell.column.field, elementRef: cell.el});
    }
    if (row) {
      this.gridService.grid.rowDoubleClick.emit({event: e, row: row.row, elementRef: row.elementRef});
    }
  }


  /**
   * Handles the `keydown` event for the grid component.
   *
   * This method is triggered when a key is pressed while the grid is focused.
   * It determines the cell and row associated with the event and emits the
   * appropriate events (`cellKeydown` or `rowKeydown`) through the `gridService`.
   *
   * @param e - The keyboard event triggered by the key press.
   *
   * Emits:
   * - `grid.cellKeydown`: If a cell is identified from the event, this emits an
   *   object containing the event, the row data, the cell value, the field name,
   *   and the cell's element reference.
   * - `grid.rowKeydown`: If a row is identified from the event, this emits an
   *   object containing the event, the row data, and the row's element reference.
   */
  onKeydown(e: KeyboardEvent): void {
    const cell = this.getCellFromEvent(e);
    const row = this.getRowFromEvent(e);
    if (cell) {
      this.gridService.grid.cellKeydown.emit({event: e, row: row?.row, value: row?.row[cell.column.field], field: cell.column.field, elementRef: cell.el});
    }

    if (row) {
      this.gridService.grid.rowKeydown.emit({event: e, row: row.row, elementRef: row.elementRef});
    }
  }

  /**
   * Handles the `keypress` event on the grid body.
   * 
   * This method determines the cell and row associated with the event and emits
   * corresponding events through the `gridService` for both the cell and row.
   * 
   * - If a cell is identified, it emits the `cellKeypress` event with details
   *   such as the event, row data, cell value, field name, and the cell's element reference.
   * - If a row is identified, it emits the `rowKeypress` event with details
   *   such as the event, row data, and the row's element reference.
   * 
   * @param e - The keyboard event triggered by the user interaction.
   */
  onKeypress(e: KeyboardEvent): void {
    const cell = this.getCellFromEvent(e);
    const row = this.getRowFromEvent(e);
    if (cell) {
      this.gridService.grid.cellKeypress.emit({event: e, row: row?.row, value: row?.row[cell.column.field], field: cell.column.field, elementRef: cell.el});
    }
    if (row) {
      this.gridService.grid.rowKeypress.emit({event: e, row: row.row, elementRef: row.elementRef});
    }
  }

  /**
   * Handles the `keyup` event on the grid body.
   * 
   * This method is triggered when a key is released while focusing on a grid cell or row.
   * It emits two events:
   * - `cellKeyup`: If the event is associated with a specific cell, this event is emitted with details about the cell, 
   *   including the row data, cell value, field, and the cell's element reference.
   * - `rowKeyup`: If the event is associated with a specific row, this event is emitted with details about the row 
   *   and its element reference.
   * 
   * @param e - The keyboard event triggered by the `keyup` action.
   */
  onKeyup(e: KeyboardEvent): void {
    const cell = this.getCellFromEvent(e);
    const row = this.getRowFromEvent(e);
    if (cell) {
      this.gridService.grid.cellKeyup.emit({event: e, row: row?.row, value: row?.row[cell.column.field], field: cell.column.field, elementRef: cell.el});
    }
    if (row) {
      this.gridService.grid.rowKeyup.emit({event: e, row: row.row, elementRef: row.elementRef});
    }
  }

  /**
   * Handles the scroll event for the grid and delegates the scrolling logic
   * to the `gridScrollService`. It calculates the scroll positions and passes
   * them along with various grid-related properties to the service.
   *
   * @param e - The scroll event triggered by the grid.
   * 
   * @throws Will log an error to the console if an exception occurs during the
   *         execution of the scroll logic.
   */
  scrollGrid(e: any): void {
    try {
      this.gridScrollService.scrollGrid(
        e,
        {
          top: e.target.scrollTop,
          left: e.target.scrollLeft
        },
        this.gridService.gridOptions,
        this.gridService.gridHeader,
        this.gridService.gridBody,
        this.gridService.gridScroller,
        this.gridService.gridFooter,
        this.gridService.hasVerticalScrollbar,
        this.gridService.scrollbarWidth
      );
    } catch (error) {
      console.error('Error during scrollGrid in GridBodyComponent:', error);
    }
  }

  /**
   * Determines whether filler rows should be displayed in the grid body.
   *
   * This method checks if the total height of the grid content is less than
   * or equal to the height of the viewport. If so, it indicates that filler
   * rows are needed to fill the remaining space in the grid body.
   *
   * @returns `true` if filler rows should be displayed; otherwise, `false`.
   */
  shouldShowFillerRows(): boolean {
    const bodyElement = this.tableBody?.nativeElement;
    const viewportHeight = bodyElement?.clientHeight || this.gridOptions.height || 0;
  
    // Check if totalHeight is less than the viewport height
    return this.totalHeight <= viewportHeight;
  }

  /**
   * Toggles the collapse state of a group identified by the given group key.
   * Updates the total height and visible rows after toggling the state.
   *
   * @param groupKey - The unique identifier of the group to toggle.
   * @throws Will log an error to the console if an exception occurs during the toggle operation.
   */
  toggleGroupCollapse(groupKey: string): void {
    try {
      this.expandedGroups[groupKey] = !this.expandedGroups[groupKey];

      if (this.expandedGroups[groupKey]) {
        // Store the rows for the expanded group
        const group = this.gridDataset.groupByData.find(g => g.key === groupKey);
        if (group) {
          this.expandedGroupData[groupKey] = group.rows;
        }
      } else {
        // Remove the rows for the collapsed group
        delete this.expandedGroupData[groupKey];
      }

      setTimeout(() => {
        this.flattenData();
        this.calculateTotalHeight();
        this.updateVisibleRows();
      });
    } catch (error) {
      console.error(`Error toggling group collapse for groupKey "${groupKey}":`, error);
    }
  }

  /**
   * Toggles the visibility of a nested row within the grid.
   *
   * @param row - The grid row object associated with the nested row to toggle.
   * @param visibleRowIndex - The index of the visible row relative to the current viewport.
   *
   * This method calculates the height of the nested row, updates the row height,
   * recalculates the total grid height, and refreshes the visible rows. It runs
   * the operations outside Angular's zone to optimize performance. Any errors
   * encountered during the process are logged to the console.
   */
  toggleNestedRow(row: GridRow, visibleRowIndex: number): void {
    try {
      const fullRowIndex = this.startIndex + visibleRowIndex;
      const nestedRow = this.nestedRowComponents.toArray()[visibleRowIndex];
      const height = nestedRow?.el?.nativeElement?.getBoundingClientRect().height;

      this.updateRowHeight(fullRowIndex, height || this.rowHeight, true);
    } catch (error) {
      console.error('Error toggling nested row:', error);
    }
  }

  /**
   * Tracks rows in a grid for Angular's `*ngFor` directive to optimize rendering.
   * This method provides a unique identifier for each row, allowing Angular to
   * efficiently detect changes and avoid unnecessary re-renders.
   *
   * @param index - The index of the current row in the iteration.
   * @param row - The `GridRow` object representing the current row.
   * @returns A unique identifier for the row, either its `id` property or the index if `id` is not available.
   */
  trackByRow(index: number, row: GridRow): string | number {
    return row.id || index;
  }

  /**
   * Updates the height of a specific row in the grid.
   *
   * @param index - The index of the row to update.
   * @param height - The new height of the row.
   * @param isNested - Optional flag indicating whether the row is nested. Defaults to `false`.
   *
   * If the height of the row has changed, the method updates the internal `rowHeights` map
   * and triggers a recalculation of the total grid height and visible rows after a debounce period.
   */
  updateRowHeight(index: number, height: number, isNested: boolean = false): void {
    const key = isNested ? `nested-${index}` : index;
    if (this.rowHeights.get(key) !== height) {
      this.rowHeights.set(key, height);

      this.calculateTotalHeight();
      this.updateVisibleRows();
    }
  }

  /**
   * Handles wheel scrolling and updates the scroll position using the proper scroll service.
   * Uses debouncing to prevent auto-scrolling issues with rapid wheel events.
   * 
   * @param e <WheelEvent> - the event triggered by scrolling with a mouse wheel or trackpad
   */
  wheelGrid = (e: WheelEvent) => {
    // Handle both horizontal and vertical wheel scrolling
    if (Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) > 0) {
      e.preventDefault(); // Prevent default browser scrolling
      e.stopPropagation(); // Prevent event bubbling
      
      // Prevent rapid wheel events from causing auto-scroll
      if (this.isWheelScrolling) {
        return;
      }
      
      this.isWheelScrolling = true;
      
      const el = this.tableBody.nativeElement;
      
      // Calculate new scroll positions with bounds checking
      const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
      const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
      
      const newScrollLeft = Math.max(0, Math.min(maxScrollLeft, el.scrollLeft + e.deltaX));
      const newScrollTop = Math.max(0, Math.min(maxScrollTop, el.scrollTop + e.deltaY));
      
      // Only scroll if there's actually a change to prevent unnecessary updates
      if (newScrollLeft !== el.scrollLeft || newScrollTop !== el.scrollTop) {
        // Use the proper scrollGrid method for synchronized scrolling
        this.scrollGrid({
          target: {
            scrollLeft: newScrollLeft,
            scrollTop: newScrollTop
          }
        });
      }
      
      // Clear any existing timeout
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      
      // Reset scrolling flag after a short delay to prevent rapid scrolling
      this.scrollTimeout = setTimeout(() => {
        this.isWheelScrolling = false;
        this.scrollTimeout = null;
      }, 50); // 50ms debounce
    }
  }
  
  private calculateTotalHeight(): void {
    this.totalHeight = 0;
    for (const row of this.flattenedRows) {
      const rowHeight = row.isGroup
        ? this.rowHeights.get(`group-${row.key}`) || 30
        : this.rowHeights.get(row.id) || 30;
      this.totalHeight += rowHeight;
    }
  }

  // Flatten nested columns for all rows
  private flattenColumnsForRows(): void {
    if (!this.flattenedRows) {
      return;
    }

    const flattenedColumns = this.gridColumnService.flattenColumns(this.gridOptions.columnDefs);
    
    this.flattenedRows.forEach(row => {
      row.columnDefs = flattenedColumns;
    });
    this.fillerRows.forEach(row => {
      row.columnDefs = flattenedColumns;
    });
  }

  private getCellFromEvent(e: MouseEvent | KeyboardEvent): any {
    const columnId = (e.target as HTMLElement).closest('.table-col')?.getAttribute('data-cell-id');
    const columns = this.rowComponents.map(r => r.columnComponents.toArray().find(c => c.column.id === columnId));
    return columns[0];
  }

  private getRowFromEvent(e: MouseEvent | KeyboardEvent): GridRow | undefined {
    const rowId = (e.target as HTMLElement).closest('.cw-table-row')?.getAttribute('data-row-id');
    return this.rows.find(r => r.id === rowId);
  }

  private flattenData(): void {
    // Preserve left scroll position
    const scrollLeft = this.tableBody.nativeElement.scrollLeft;

    this.flattenedRows = [];

    const traverseGroups = (groups: any[], depth: number): void => {
      for (const group of groups) {
        // Add group header
        this.flattenedRows.push({
          isGroup: true,
          key: group.key,
          depth,
          rowCount: group.rows.length,
        });

        // If the group is expanded, process its rows or subgroups
        if (this.expandedGroups[group.key]) {
          const rows = this.expandedGroupData[group.key] || group.rows;
          if (Array.isArray(rows) && rows.length > 0) {
            if (rows[0]?.key) {
              // Subgroups exist, traverse them recursively
              traverseGroups(rows, depth + 1);
            } else {
              // Add rows in the group
              rows.forEach(row => {
                this.flattenedRows.push({
                  row,
                  depth, // Maintain the depth for rows within this group
                });
              });
            }
          }
        }
      }
    };

    if (this.gridDataset.groupByData?.length) {
      // If group-by data exists, traverse and flatten it
      traverseGroups(this.gridDataset.groupByData, 1);
    } else if (this.rows?.length) {
      // If no group-by data, use flat rows
      this.flattenedRows = this.rows.map(row => ({
        row,
        depth: 0, // Flat rows have no depth
      }));
    } else {
      return;
    }

    // Flatten columns for all rows
    this.flattenColumnsForRows();

    // Reset left scroll position
    setTimeout(() => {
      setTimeout(() => {
        this.tableBody.nativeElement.scrollLeft = scrollLeft;
      });
    });
  }

  private measureRowHeightsAndCorrect(): void {
    let changed = false;
    this.rowComponents.forEach((rowComp, idx) => {
      const el = rowComp.el?.nativeElement;
      if (el) {
        const height = el.getBoundingClientRect().height;
        const key = this.visibleRows[idx]?.id ?? (this.startIndex + idx);
        if (this.rowHeights.get(key) !== height) {
          this.rowHeights.set(key, height);
          changed = true;
        }
      }
    });

    if (changed) {
      // If any height changed, recalculate and re-measure after next render
      this.calculateTotalHeight();
      this.updateVisibleRows();
      setTimeout(() => this.measureRowHeightsAndCorrect());
    }
  }

  private updateVisibleRows(): void {
    this.runOutsideAngular(() => {
      const bodyElement = this.tableBody.nativeElement;
      const scrollTop = bodyElement.scrollTop;
      const viewportHeight = bodyElement.clientHeight;

      // Find first visible row
      let top = 0;
      let first = 0;
      for (; first < this.flattenedRows.length; first++) {
        const row = this.flattenedRows[first];
        const rowHeight = row.isGroup
          ? this.rowHeights.get(`group-${row.key}`) || 30
          : this.rowHeights.get(row.id) || 30;
        if (top + rowHeight > scrollTop) break;
        top += rowHeight;
      }

      // Find last visible row
      let bottom = top;
      let last = first;
      for (; last < this.flattenedRows.length; last++) {
        const row = this.flattenedRows[last];
        const rowHeight = row.isGroup
          ? this.rowHeights.get(`group-${row.key}`) || 30
          : this.rowHeights.get(row.id) || 30;
        bottom += rowHeight;
        if (bottom >= scrollTop + viewportHeight) break;
      }

      // Add buffer
      let start = Math.max(0, first - this.buffer);
      let end = last + this.buffer + 1;
      if (end >= this.flattenedRows.length) {
        end = this.flattenedRows.length;
        start = Math.max(0, end - (last - first + 1) - this.buffer * 2);
      }
      this.startIndex = start;
      this.endIndex = end;
      this.visibleRows = this.flattenedRows.slice(start, end);
      
      // Trigger change detection in zoneless mode
      this.markForCheck();

      // Calculate offsets
      let topOffsetValue = 0;
      for (let i = 0; i < start; i++) {
        const row = this.flattenedRows[i];
        const rowHeight = row.isGroup
          ? this.rowHeights.get(`group-${row.key}`) || 30
          : this.rowHeights.get(row.id) || 30;
        topOffsetValue += rowHeight;
      }
      this.topOffset = `${topOffsetValue}px`;

      let bottomOffsetValue = 0;
      for (let i = end; i < this.flattenedRows.length; i++) {
        const row = this.flattenedRows[i];
        const rowHeight = row.isGroup
          ? this.rowHeights.get(`group-${row.key}`) || 30
          : this.rowHeights.get(row.id) || 30;
        bottomOffsetValue += rowHeight;
      }
      this.bottomOffset = `${bottomOffsetValue}px`;
    });
  }
}
