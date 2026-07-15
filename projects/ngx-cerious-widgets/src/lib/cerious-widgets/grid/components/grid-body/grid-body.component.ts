import { AfterViewInit, Component, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { CeriousScrollDirective } from '@ceriousdevtech/ngx-cerious-scroll';
import type { CeriousScrollOptions } from '@ceriousdevtech/ngx-cerious-scroll';

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
  imports: [CommonModule, GridRowComponent, GridNestedRowComponent, CeriousScrollDirective]
})
export class GridBodyComponent extends ZonelessCompatibleComponent implements IGridBodyComponent, AfterViewInit, OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];
  private rowHeight = 30;
  flattenedRows: any[] = [];

  /** The cerious-scroll engine instance (vertical virtual scroller). */
  private scroller: any = null;
  /** The engine's content element; rows are absolutely positioned inside it. */
  private contentElement: HTMLElement | null = null;

  expandedGroups: { [key: string]: boolean } = {};
  expandedGroupData: { [key: string]: any[] } = {};
  refreshTick = 0;

  /** Options forwarded to the cerious-scroll engine. */
  scrollOptions: CeriousScrollOptions = {
    attachScrollbar: true,
    autoResize: true,
    observeContentChanges: true,
    touch: {
      // Forward horizontal-dominant touch gestures to the native overflow-x
      // scroller so mobile users can pan horizontally while still scrolling
      // vertically through the body. Resolved lazily on each touchstart since
      // gridScroller isn't available until after view init.
      getHorizontalScrollTarget: () =>
        this.gridService.gridScroller?.scroller?.nativeElement ?? null,
    },
  };

  @Input() classes: SectionClassConfig = {};

  @ViewChild('tableBody', { static: true }) tableBody!: ElementRef;
  @ViewChild('nonVirtualContent', { static: false }) nonVirtualContent?: ElementRef<HTMLElement>;
  @ViewChild(CeriousScrollDirective) ceriousScroll!: CeriousScrollDirective;
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

  /** Virtual scrolling is on by default; consumers opt out via `enableVirtualScroll: false`. */
  get useVirtualScroll(): boolean {
    return this.gridOptions?.enableVirtualScroll !== false;
  }

  /** trackBy for the non-virtual `*ngFor`; falls back to index when no row id. */
  trackByRow = (index: number, item: any): any => {
    return item?.isGroup ? `g:${item.key}` : (item?.row?.id ?? index);
  };

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
      // Horizontal scroll synchronisation (transform + pin-offset var + pinned
      // columns) is done inside GridScrollService.scrollGrid itself — no need
      // to repeat it here on every afterScroll emission.
      this.subscriptions.push(this.gridService.afterResize.subscribe(() => {
        this.applyHorizontalOffset();
        // The viewport height may have changed; let the engine re-measure.
        this.ceriousScroll?.render();
      }));
      this.subscriptions.push(this.gridService.afterGroupBy.subscribe(() => {
        // The group tree was rebuilt. Drop the cached expanded-row snapshots,
        // they reference the previous tree's group objects, so keeping them makes
        // flattenData re-render stale subgroups (e.g. removing an inner grouping
        // level would leave its old subgroups showing). flattenData then reads
        // fresh rows straight from the new groupByData.
        this.expandedGroupData = {};
        // Grouping replaces the entire row set (group headers + rows). Rebuild
        // the flat list, force it into the DOM synchronously, then re-measure the
        // virtual scroller so it repaints against the new items. Without the
        // explicit scroller render the body keeps its stale pooled viewport under
        // zoneless and only corrects on the next scroll/click, and because the
        // menu's Group By runs from a manual (non-Angular) listener, nothing else
        // schedules that work.
        setTimeout(() => {
          this.flattenData();
          this.detectChanges();
          this.ceriousScroll?.render();
        });
      }));
      this.subscriptions.push(this.gridService.afterRender.subscribe(() => {
        this.flattenData();
        this.markForCheck();
      }));
      // In-place row state changes (selection, column width drag) that don't
      // alter row identity or count. Bumping `refreshTick` (bound to every
      // `cw-grid-row`) changes the OnPush rows' input so they re-read their cell
      // widths; `markForCheck()` schedules this body's view so that new tick is
      // actually pushed (under zoneless a plain field mutation marks nothing).
      // `refreshRenderedContent()` additionally repaints the virtual scroller's
      // pooled views (no-op when virtual scrolling is off).
      const refreshRows = () => {
        this.refreshTick++;
        this.markForCheck();
        this.ceriousScroll?.refreshRenderedContent();
      };
      this.subscriptions.push(this.gridService.selectedRowsChange.subscribe(refreshRows));
      this.subscriptions.push(this.gridService.afterColumnResize.subscribe(refreshRows));
      this.subscriptions.push(this.gridService.afterCellEdit.subscribe(refreshRows));
    } catch (error) {
      console.error('Error during initialization in GridBodyComponent:', error);
    }
  }

  ngAfterViewInit(): void {
    try {
      setTimeout(() => {
        this.gridService.updateGridHeight();
        this.flattenData();
        this.markForCheck();
        // Render once the host has a measured height.
        setTimeout(() => {
          this.ceriousScroll?.render();
          this.applyHorizontalOffset();
        });
      });
    } catch (error) {
      console.error('Error in ngAfterViewInit in GridBodyComponent:', error);
    }
  }

  override ngOnDestroy(): void {
    try {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    } catch (error) {
      console.error('Error during destruction in GridBodyComponent:', error);
    }

    // Call parent cleanup
    super.ngOnDestroy();
  }

  /**
   * Captures the engine instance and its content element once the scroller is
   * ready so we can drive horizontal offset and pinned-column positioning.
   */
  onScrollerReady(scroller: any): void {
    this.scroller = scroller;
    this.contentElement = this.tableBody?.nativeElement?.querySelector('[data-cerious-scroll-content]') ?? null;
    this.applyHorizontalOffset();
  }

  /**
   * Translates the engine content element horizontally to mirror the shared
   * scroll position. Body pinned cells track this via the `--cw-pin-offset`
   * CSS variable, so newly rendered rows are positioned without per-frame JS.
   */
  private applyHorizontalOffset(): void {
    const left = this.gridScrollService.scrollDelta?.left || 0;
    const body = this.tableBody?.nativeElement as HTMLElement | undefined;
    const content = this.contentElement ?? this.nonVirtualContent?.nativeElement ?? null;
    if (content) {
      content.style.transform = left ? `translateX(${-left}px)` : '';
    }
    if (body) {
      body.style.setProperty('--cw-pin-offset', `${left}px`);
    }
    // Header/footer/breadcrumb pinned cells still go through the service
    // (small fixed component arrays — runs only on horizontal scroll).
    this.gridColumnService.updatePinnedColumnPos(
      this.gridService.gridHeader,
      this,
      this.gridService.gridFooter,
      this.gridOptions,
      this.gridScrollService.scrollDelta
    );
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
   * Toggles the collapse state of a group identified by the given group key.
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
        this.detectChanges();
        // Row count changed; re-measure the virtual scroller so the content
        // height and pooled views update immediately.
        this.ceriousScroll?.render();
      });
    } catch (error) {
      console.error(`Error toggling group collapse for groupKey "${groupKey}":`, error);
    }
  }

  /**
   * Toggles the visibility of a nested row within the grid.
   *
   * The nested row is part of the same item template as its parent row, so its
   * height change is picked up by the engine's content observer. We also ask the
   * engine to recalculate so the total content height and scrollbar update
   * immediately.
   *
   * @param row - The grid row object associated with the nested row to toggle.
   */
  toggleNestedRow(row: GridRow): void {
    try {
      setTimeout(() => {
        this.ceriousScroll?.recalculate();
        this.applyHorizontalOffset();
      });
    } catch (error) {
      console.error('Error toggling nested row:', error);
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
    const colEl = (e.target as HTMLElement).closest('.table-col') as HTMLElement | null;
    if (!colEl) {
      return undefined;
    }
    const columnId = colEl.getAttribute('data-cell-id');
    const column = this.gridColumnService
      .flattenColumns(this.gridOptions.columnDefs)
      .find(c => c.id === columnId);
    if (!column) {
      return undefined;
    }
    return { column, el: new ElementRef(colEl) };
  }

  private getRowFromEvent(e: MouseEvent | KeyboardEvent): GridRow | undefined {
    const rowId = (e.target as HTMLElement).closest('.cw-table-row')?.getAttribute('data-row-id');
    return this.rows.find(r => r.id === rowId);
  }

  // --- Touch panning (non-virtual bodies) -----------------------------------
  // The grid drives horizontal scrolling through <cw-grid-scroller>, not a native
  // overflow container, so dragging the body sideways has to be implemented here.
  // Virtual bodies get this from cerious-scroll (see `scrollOptions.touch`); this
  // covers `enableVirtualScroll: false` grids, which otherwise can't be panned on
  // touch devices at all.
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartLeft = 0;
  private touchAxis: 'horizontal' | 'vertical' | null = null;

  /** The element whose native scroll position drives the grid's horizontal sync. */
  private get horizontalScroller(): HTMLElement | null {
    return this.gridService.gridScroller?.scroller?.nativeElement ?? null;
  }

  onTouchStart(e: TouchEvent): void {
    if (this.useVirtualScroll) { return; }
    const touch = e.touches[0];
    if (!touch) { return; }
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartLeft = this.horizontalScroller?.scrollLeft ?? 0;
    this.touchAxis = null;
  }

  onTouchMove(e: TouchEvent): void {
    if (this.useVirtualScroll) { return; }
    const touch = e.touches[0];
    const scroller = this.horizontalScroller;
    if (!touch || !scroller) { return; }

    const dx = touch.clientX - this.touchStartX;
    const dy = touch.clientY - this.touchStartY;

    // Lock the axis once the gesture clears a small threshold, so a mostly-vertical
    // swipe keeps scrolling the rows instead of nudging the columns sideways.
    if (this.touchAxis === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) { return; }
      this.touchAxis = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
    }
    if (this.touchAxis !== 'horizontal') { return; }

    // Scrolling this element fires the scroll sync that moves the header + body.
    scroller.scrollLeft = this.touchStartLeft - dx;
  }

  onTouchEnd(): void {
    this.touchAxis = null;
  }

  /**
   * Total number of leaf (data) rows under a group, recursing through any
   * subgroups. Used for the group-header count so a parent group shows its full
   * row total (e.g. 40) rather than its number of subgroups (e.g. 3).
   */
  private countLeafRows(group: any): number {
    const rows = group?.rows;
    if (!Array.isArray(rows)) { return 0; }
    // A subgroup node carries a `key`; a leaf GridRow does not.
    if (rows.length > 0 && rows[0]?.key) {
      return rows.reduce((sum: number, sub: any) => sum + this.countLeafRows(sub), 0);
    }
    return rows.length;
  }

  private flattenData(): void {
    const rows: any[] = [];

    const traverseGroups = (groups: any[], depth: number): void => {
      for (const group of groups) {
        // Add group header
        rows.push({
          isGroup: true,
          key: group.key,
          depth,
          rowCount: this.countLeafRows(group),
        });

        // If the group is expanded, process its rows or subgroups
        if (this.expandedGroups[group.key]) {
          const groupRows = this.expandedGroupData[group.key] || group.rows;
          if (Array.isArray(groupRows) && groupRows.length > 0) {
            if (groupRows[0]?.key) {
              // Subgroups exist, traverse them recursively
              traverseGroups(groupRows, depth + 1);
            } else {
              // Add rows in the group
              groupRows.forEach(row => {
                rows.push({
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
      this.flattenedRows = rows;
    } else if (this.rows?.length) {
      // If no group-by data, use flat rows
      this.flattenedRows = this.rows.map(row => ({
        row,
        depth: 0, // Flat rows have no depth
      }));
    } else {
      this.flattenedRows = [];
    }

    // Flatten columns for all rows
    this.flattenColumnsForRows();
  }
}

