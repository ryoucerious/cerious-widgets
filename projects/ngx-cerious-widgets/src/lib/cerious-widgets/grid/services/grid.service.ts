import { ElementRef, Inject, Injectable, NgZone, QueryList, TemplateRef } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { GRID_COLUMN_SERVICE } from '../tokens/grid-column-service.token';
import { GRID_SCROLL_SERVICE } from '../tokens/grid-scroll-services.token';
import { GridRow } from '../models/grid-row';
import {
  ColumnDef,
  FilterState,
  GridApi,
  GridDataRequest,
  GridDataResponse,
  GridDataset,
  GridOptions,
  IGridBodyComponent,
  IGridColumnService,
  IGridComponent,
  IGridFooterComponent,
  IGridHeaderComponent,
  IGridMenuBarComponent,
  IGridPagerComponent,
  IGridScrollerComponent,
  IGridScrollService,
  IGridService,
  PluginOptions,
  ScrollDelta,
  SortState } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class GridService implements IGridService {

  private isColumnResizing: boolean = false;
  private mouseX: number = 0;
  private resizingColumn: ColumnDef | null = null;
  private sortFunction: ((data: any[], sortState: SortState[]) => any[]) | null = null;
  private filterFunction: ((data: any[], filterState: FilterState) => any[]) | null = null;

  // api
  gridApi!: GridApi;

  // components
  grid!: IGridComponent;
  gridBody!: IGridBodyComponent;
  gridContainer!: ElementRef;
  gridFooter!: IGridFooterComponent;
  gridHeader!: IGridHeaderComponent;
  gridMenuBar!: IGridMenuBarComponent;
  gridPager!: IGridPagerComponent;
  gridScroller!: IGridScrollerComponent;

  // properties
  dataset: Array<any> = {} as Array<any>;
  currentFilterState: FilterState = {} as FilterState;
  currentSortState: SortState[] = [];
  fillerRowHeight: number = 0;
  filteredDataset: Array<any> = [] as Array<any>;
  gridContainerElement: HTMLElement | null = null;
  gridDataset: GridDataset = {} as GridDataset;
  gridOptions!: GridOptions;
  hasHorizontalScrollbar: boolean = false;
  hasVerticalScrollbar: boolean = false;
  headerWidth: string = '';
  moddedColumnWidth: number = 0;
  originalDataset: Array<any> = [] as Array<any>;
  os: string = '';
  sortedDataset: Array<any> = [] as Array<any>;
  pinnedColumns: ColumnDef[] = [];
  pinnedColumnWidth: number = 0;
  pluginOptions!: PluginOptions;
  rowMinWidth: string = '';
  scrollbarHeight: number = 0;
  scrollbarWidth: number = 0;
  scrollbarSize: number = 0;
  tableScrollHeight: number = 0;
  tableScrollWidth: number = 0;
  templates: { [key: string]: TemplateRef<any> } = {};

  // events
  afterApplySorting: Subject<any> = new Subject<any>();
  afterApplyFilter: Subject<any> = new Subject<any>();
  afterGroupBy: Subject<any> = new Subject<any>();
  afterPinnedColumnsUpdated: Subject<any> = new Subject<any>();
  afterResize: Subject<any> = new Subject<any>();
  afterRender: Subject<any> = new Subject<any>();
  afterSetColumnDefs: Subject<any> = new Subject<any>();
  afterUpdateHeaderOrder: Subject<any> = new Subject<any>();
  pageChange: ReplaySubject<any> = new ReplaySubject<any>();
  rowSelect: ReplaySubject<any> = new ReplaySubject<any>();
  selectedRowsChange: ReplaySubject<any> = new ReplaySubject<any>();
  
  constructor(
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService,
    @Inject(GRID_SCROLL_SERVICE) private gridScrollService: IGridScrollService,
    private zone: NgZone
  ) {
    this.gridApi = this.buildGridApi();
    this.setOS();
  }

  /**
   * Applies filtering logic to a dataset based on the provided filter state.
   * 
   * @param filterState - The current state of filters to be applied. Each key represents a field,
   * and its value contains the filter criteria (e.g., type and value).
   * @param dataset - The dataset to which the filters will be applied. This is an array of objects
   * where each object represents a row of data.
   * @returns A filtered dataset based on the provided filter state. If server-side filtering is enabled,
   * an empty array is returned while waiting for the server response.
   * 
   * ### Filtering Logic:
   * - If the filter state has not changed, the original dataset is returned.
   * - If server-side filtering is enabled, a request is made to the server with the filter state,
   *   and an empty dataset is returned.
   * - For client-side filtering:
   *   - Filters are applied to visible columns only.
   *   - Supported filter types:
   *     - `contains`: Checks if the cell value contains the filter value.
   *     - `equals`: Checks if the cell value equals the filter value.
   *     - `startsWith`: Checks if the cell value starts with the filter value.
   *     - `endsWith`: Checks if the cell value ends with the filter value.
   *   - If a column or filter is invalid, filtering for that field is skipped.
   */
  applyFilter(filterState: FilterState, dataset: any[]): any[] {
    // Check if the filter state has changed
    if (this.currentFilterState === filterState) {
      return dataset; // No filters applied
    }
  
    // Update the current filter state and reset the page number
    this.currentFilterState = filterState;
    this.gridDataset.pageNumber = 1;
  
    // If server-side filtering is enabled, delegate the filtering to the server
    if (this.gridApi.requestData) {
      this.requestData({
        startRow: 0,
        endRow: this.gridOptions.pageSize || 50,
        sortState: this.currentSortState,
        filterState: filterState,
        groupBy: [],
        groupKeys: []
      }).subscribe();
      return []; // Return an empty dataset while waiting for the server response
    }

     // Use the provided filter function if available
    if (this.filterFunction) {
      return this.filterFunction(dataset, filterState);
    }
  
    return dataset;
  }

  /**
   * Applies sorting to the dataset based on the provided sort state.
   * 
   * This method updates the current sort state and performs sorting on the dataset.
   * If the grid is in server mode, it triggers a data request and resets the page to the first one.
   * Otherwise, it sorts the original dataset locally, applies any active filters, and updates the grid.
   * 
   * @param sortState - An array of `SortState` objects representing the columns to sort by and their respective directions.
   * 
   * SortState example:
   * ```typescript
   * interface SortState {
   *   column: { field: string };
   *   direction: 'asc' | 'desc';
   * }
   * ```
   */
  applySorting(sortState: SortState[]): void {
    this.currentSortState = sortState;

    if (this.gridApi.requestData) {
      // We are in server mode, so we need to call the requestData method
      this.requestData().subscribe();
      this.selectPage(1);
      return;
    }
    
    // Use plugin sort function if available
    if (this.sortFunction) {
      this.sortedDataset = this.sortFunction(this.originalDataset, this.currentSortState);
    } else {
      this.sortedDataset = [...this.originalDataset];
    }
  
    // Apply the filter to the sorted dataset
    this.filteredDataset = this.applyFilter(this.currentFilterState, this.sortedDataset);

    // Reset the page number to 1
    this.gridDataset.pageNumber = 1;
  
    // Update the grid with the filtered dataset
    this.dataset = this.filteredDataset;
    this.processDataset();

    // Scroll to the top of the grid
    const scrollDelta = this.gridScrollService.scrollDelta;
    scrollDelta.top = 0;
    this.resetGridScrollWithTimeout(scrollDelta);

    // Emit the afterApplySorting event
    this.afterApplySorting.next(true);
  }

  /**
   * Ends the column resizing operation.
   * 
   * If a column resizing operation is currently in progress, this method finalizes
   * the resizing by invoking the `resize` method. It then resets the state by marking
   * the resizing operation as complete and clearing the reference to the resizing column.
   */
  endColumnResizing() {
    if (this.isColumnResizing) {
      this.resize();
    }
    this.isColumnResizing = false;
    this.resizingColumn = null;
  }

  /**
   * Calculates and returns the number of enabled features for the grid.
   *
   * This method evaluates specific grid options and templates to determine
   * the count of active features. The following conditions contribute to the count:
   * - If a nested row template is defined and exists in the templates collection.
   * - If either multi-select or single-select functionality is enabled.
   *
   * @returns {number} The total count of enabled grid features.
   */
  getFeatureCount() {
    let rowFeatureCount = 0;
    
    if (this.gridOptions.nestedRowTemplate && this.templates[this.gridOptions.nestedRowTemplate]) {
      rowFeatureCount++;
    }
    
    if (this.gridOptions.enableMultiselect || this.gridOptions.enableSingleselect) {
      rowFeatureCount++;
    }

    return rowFeatureCount;
  }

  /**
   * Initializes the column resizing process by setting the necessary state variables.
   *
   * @param column - The column definition object representing the column to be resized.
   * @param e - The mouse event that triggered the column resizing.
   */
  initColumnResizing(column: ColumnDef, e: MouseEvent) {
    this.isColumnResizing = true;
    this.resizingColumn = column;
    this.mouseX = e.pageX;
  }

  /**
   * Handles the mouse move event and triggers the column resizing logic.
   *
   * @param e - The mouse event containing information about the cursor's position.
   */
  onMouseMove(e: MouseEvent) {
    this.resizeColumn(e);
  }

  /**
   * Handles the mouseup event to finalize column resizing.
   * This method is triggered when the user releases the mouse button
   * after resizing a column in the grid.
   *
   * @param e - The MouseEvent object containing details about the mouseup event.
   */
  onMouseUp(e: MouseEvent) {
    this.endColumnResizing();
  }

  /**
   * Processes the dataset and updates the grid's internal data structure.
   * 
   * This method maps the provided dataset into `GridRow` objects and assigns them
   * to the `gridDataset`. It also initializes filler and footer rows, calculates
   * the total row count, and handles client-side paging if applicable.
   * 
   * Preconditions:
   * - `this.gridDataset` and `this.dataset` must be defined.
   * 
   * Behavior:
   * - Maps `this.dataset` into `GridRow` objects using the column definitions
   *   from `this.gridOptions.columnDefs`.
   * - Creates filler and footer rows using the same column definitions.
   * - Updates `this.gridDataset.totalRowCount` with the length of the dataset
   * 
   * Note:
   * - This method assumes that `this.gridOptions.columnDefs`
   *   is properly configured.
   */
  processDataset(): void {
    try {
      if (this.gridDataset && this.dataset) {
        this.gridDataset.dataset = this.dataset.map((data: any) => {
          return new GridRow({
            row: data,
            columnDefs: this.gridOptions.columnDefs
          });
        });
        this.gridDataset.fillerRows = [new GridRow({ columnDefs: this.gridOptions.columnDefs })];
        this.gridDataset.footerRows = [new GridRow({ columnDefs: this.gridOptions.columnDefs })];

        this.gridDataset.totalRowCount = this.gridDataset.dataset.length;

        // Only call selectPage for client-side paging
        if (!this.gridApi.requestData) {
          this.selectPage(this.gridDataset.pageNumber, false);
        }
      }
    } catch (error) {
      console.error('Error processing dataset:', error);
    }
  }

  
  /**
   * Processes the page data for the grid dataset.
   * If the `gridDataset` and its `pageData` property are defined,
   * this method assigns the `pageData` to the `bodyRows` property
   * of the `gridDataset`.
   */
  processPageData() {
    if (this.gridDataset && this.gridDataset.pageData) {
      this.gridDataset.bodyRows = this.gridDataset.pageData;
    }
  }

  /**
   * Processes the paging logic for the grid dataset based on the grid options and dataset properties.
   * This method calculates the total number of pages, divides them into groups if necessary,
   * and generates the pagination information to be displayed.
   *
   * - If paging is disabled or the page size is not specified, the entire dataset is used as a single page.
   * - For server-side paging, the total row count is used to calculate the number of pages.
   * - If there are 5 or fewer pages, all pages are displayed individually.
   * - For more than 5 pages, the pages are grouped into blocks of up to 5 pages each, with navigation links
   *   for the first, last, and neighboring groups.
   *
   * @returns {void}
   */
  processPaging(): void {
    if (!this.gridOptions.pageSize) {
      this.gridDataset.pages = this.gridDataset.pageData = this.gridDataset.dataset;
      return;
    }

    // Calculate the total number of pages based on the data set length and the page size option
    let pageCount = Math.ceil(this.dataset.length / (this.gridOptions.pageSize || 1));

    // If using server-side paging and there is a total row count, use that to calculate the number of pages instead
    if (this.gridDataset.totalRowCount) {
      pageCount = Math.ceil(this.gridDataset.totalRowCount / (this.gridOptions.pageSize || 1));
    }

    // If there are 5 or fewer pages, display all pages individually
    if (pageCount <= 5) {
      this.gridDataset.pages = [...Array(pageCount)].map((_, i) => ({ value: i + 1, text: `${i + 1}` }));
    } else {
      // If there are more than 5 pages, group them into blocks of up to 5 pages each and display navigation links for each block

      // Calculate the number of page groups needed to display all pages
      const groupCount = Math.ceil(pageCount / 5);
      // Create an array to hold each page group as an array of page numbers
      const groups: Array<Array<number>> = [];
      let visibleGroupIndex = 0;
      let groupPage = 1;

      // Divide the pages into groups of up to 5 pages each
      for (let i = 0; i < groupCount; i++) {
        const pageGroup: Array<number> = [];
        for (let p = 0; p < 5; p++) {
          if (groupPage <= pageCount) {
            pageGroup.push(groupPage);

            // If we've found the current page in this group, mark it as the visible group
            if (groupPage === this.gridDataset.pageNumber) {
              visibleGroupIndex = i;
            }
            groupPage += 1;
          }
        }
        // If this group has any pages in it, add it to the list of groups
        if (pageGroup.length > 0) {
          groups.push(pageGroup);
        }
      }

      // Get references to the first and last page groups, as well as the currently visible group and its neighbors
      const firstGroup = groups[0];
      const lastGroup = groups[groups.length - 1];
      const visibleGroup = groups[visibleGroupIndex];
      const preGroup = groups[visibleGroupIndex - 1];
      const postGroup = groups[visibleGroupIndex + 1];

      // Assemble the pagination information using the page groups and navigation links
      this.gridDataset.pages = [
        ...(visibleGroupIndex > 0 && firstGroup ? [{ value: firstGroup[0], text: 'First' }] : []),
        ...(preGroup ? [{ value: preGroup[preGroup.length - 1], text: '...' }] : []),
        ...visibleGroup.map((page) => ({ value: page, text: `${page}` })),
        ...(postGroup ? [{ value: postGroup[0], text: '...' }] : []),
        ...(visibleGroupIndex < groups.length - 1 && lastGroup ? [{ value: lastGroup[lastGroup.length - 1], text: 'Last' }] : []),
      ];
    }
  }

  
  /**
   * Processes a list of Angular `TemplateRef` objects and maps them to a `templates` object
   * using their unique local names as keys.
   *
   * @param templateRefs - A `QueryList` of `TemplateRef` objects to be processed.
   *
   * This method converts the `QueryList` into an array, extracts the local name of each
   * template reference, and stores the template reference in the `templates` object
   * under the corresponding local name key.
   */
  processTemplates(templateRefs: QueryList<TemplateRef<any>>): void {
    // Convert the `templateRefs` `QueryList` into an array of `TemplateRef` objects
    const templates = [...templateRefs];

    // For each template, assign it a unique local name and store it in the `templates` object keyed by that name
    templates.forEach((templateRef: any) => {
      // Get the local name of the template reference from its `_declarationTContainer`
      const localName = templateRef._declarationTContainer.localNames[0];
      
      // Store the template reference in the `templates` object under the unique `localName` key
      this.templates[localName] = templateRef;
    });
  }

  /**
   * Renders the grid by performing a series of operations such as updating column parents,
   * handling pinned columns, processing page data, and resizing the grid.
   * 
   * This method ensures that the grid is properly configured and displayed based on the
   * provided dataset and grid options. After the rendering process is complete, it emits
   * a signal through the `afterRender` observable to indicate that rendering has finished.
   * 
   * Preconditions:
   * - `this.dataset` and `this.gridOptions` must be defined for the rendering process to execute.
   * 
   * Operations performed:
   * 1. Updates column parent relationships using `updateColumnParents`.
   * 2. Updates pinned columns using `updatePinnedCols`.
   * 3. Processes page data using `processPageData`.
   * 4. Resizes the grid using `resize`.
   * 
   * Emits:
   * - `afterRender.next(true)` to notify subscribers that rendering is complete.
   */
  render(): void {
    try {
      if (this.dataset && this.gridOptions) {
        this.updateColumnParents(this.gridOptions.columnDefs);
        this.updatePinnedCols();
        this.processPageData();
        this.resize();
        this.afterRender.next(true);
      }
    } catch (error) {
      console.error('Error rendering grid:', error);
    }
  }
  
  /**
   * Resizes the grid by updating its dimensions and scrollbars.
   * 
   * This method performs the following steps:
   * 1. Sets the minimum width for rows.
   * 2. Runs operations outside Angular's zone to avoid triggering change detection unnecessarily.
   * 3. Updates the scrollbars and grid height within Angular's zone.
   * 4. Emits a signal indicating that the resize operation is complete.
   * 
   * @returns A promise that resolves when the resize operation is complete.
   */
  resize(): Promise<any> {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        this.setRowMinWidth();
        this.zone.runOutsideAngular(() => {
          
          setTimeout(() => {
            this.zone.run(() => {
              this.updateScrollBars();
              this.updateGridHeight();    
              this.grid.gridResize.next(true);        
              this.afterResize.next(true);
              resolve(null);
          });
          }, 0);
        });
      });
    });
    return promise;
  }

  /**
   * Handles the resizing of a column in a grid when a mouse event occurs.
   * 
   * This method adjusts the width of the column being resized based on the 
   * horizontal movement of the mouse. It ensures that the column width does 
   * not go below a minimum value of 40 pixels. If column resizing is not 
   * active or the resizing column is not defined, it ends the resizing process.
   * 
   * @param e - The MouseEvent triggered during the column resizing operation.
   */
  resizeColumn = (e: MouseEvent) => {
    if (this.isColumnResizing && this.resizingColumn) {
      const newWidth = parseInt(this.resizingColumn.width ? this.resizingColumn.width : '0', 0) + (e.pageX - this.mouseX);
      if (newWidth >= 40) {
        this.resizingColumn.width = newWidth + 'px';
      }
      this.mouseX = e.pageX;
    } else {
      this.endColumnResizing();
    }
  }

  /**
   * Requests data for the grid, either using a provided request or a default request configuration.
   *
   * @param request - An optional `GridDataRequest` object specifying the data request parameters.
   *                  If not provided, a default request will be used.
   * @returns An `Observable` that emits a `GridDataResponse` containing the requested grid data.
   *          If the `gridApi.requestData` method is not defined, the observable will emit an error.
   *
   * @throws Error - If `gridApi.requestData` is not defined in the `gridApi`.
   */
  requestData(request?: GridDataRequest): Observable<GridDataResponse> {
    if (this.gridApi.requestData) {
      // If a request is provided, use it
      if (request) {
        return this.gridApi.requestData(request);
      } else {
        // Otherwise, use the default request
        return this.gridApi.requestData({
          startRow: 0,
          endRow: this.gridOptions.pageSize,
          sortState: this.currentSortState,
          filterState: {},
          groupBy: [],
          groupKeys: []
        });
      }
    }
    return new Observable<GridDataResponse>((observer) => {
      observer.error(new Error('requestData is not defined in the gridApi.'));
      observer.complete();
    });
  }

  
  /**
   * Selects a specific page in the grid and updates the dataset accordingly.
   *
   * @param pageNumber - The page number to select. Defaults to 1.
   * @param scroll - Whether to scroll the grid after selecting the page. Defaults to true.
   *
   * This method handles both client-side and server-side paging:
   * - For client-side paging, it slices the dataset to extract the data for the selected page.
   * - For server-side paging, it requests the data for the selected page from the server.
   *
   * After updating the dataset, it triggers a page change event, re-renders the grid,
   * and optionally scrolls to the appropriate position.
   */
  selectPage(pageNumber: number = 1, scroll: boolean = true): Promise<void> {
    return new Promise((resolve) => {
      const pageSize = this.gridOptions.pageSize || 50;
      const paging = this.gridOptions.pageSize && this.gridOptions.pageSize > 0;
      this.gridDataset.pageNumber = pageNumber;
  
      const startIndex = (pageNumber * pageSize) - pageSize;
      const endIndex = startIndex + pageSize;
  
      if (paging && !this.gridApi.requestData) {
        // Extract a subset of the dataset corresponding to the current page
        this.gridDataset.pageData = this.gridDataset.dataset.slice(startIndex, endIndex);
        this.processPaging();
      } else if (paging && this.gridApi.requestData) {
        // If server-side paging is enabled, request the rows from the server
        this.requestData({
          startRow: startIndex,
          endRow: endIndex,
          sortState: this.currentSortState,
          filterState: {},
          groupBy: [],
          groupKeys: []
        }).subscribe(() => {
          resolve(); // Resolve the promise after the server request completes
        });
        return; // Exit early since the server request is asynchronous
      } else {
        this.gridDataset.pageData = this.gridDataset.dataset;
        this.processPaging();
      }
  
      // Fire off a page change
      this.pageChange.next(this.gridDataset.pageNumber);
  
      // Re-render the grid and resize
      this.render();
      this.resize().then(() => {
        if (scroll) {
          this.gridColumnService.updatePinnedColumnPos(
            this.gridHeader,
            this.gridBody,
            this.gridFooter,
            this.gridOptions,
            this.gridScrollService.scrollDelta
          );
        }
        resolve(); // Resolve the promise after rendering and resizing are complete
      });
    });
  }

  /**
   * Updates the grid's dataset and processes it for rendering, filtering, sorting, and paging.
   *
   * @param dataset - The new dataset to be set for the grid. This is an array of any type of objects.
   * @param totalRowCount - (Optional) The total number of rows available on the server. 
   *                        If provided, server-side paging will be processed.
   *
   * @remarks
   * - The method updates the internal datasets (`originalDataset`, `sortedDataset`, `filteredDataset`, and `dataset`) 
   *   and processes them for rendering.
   * - If `totalRowCount` is provided, it assumes server-side data and updates the paging information, 
   *   including the current page number and total row count.
   * - Triggers a page change event if server-side paging is enabled.
   * - Calls additional methods to render the grid, resize it, and reset the scroll position.
   */
  setData(dataset: Array<any>, totalRowCount?: number): void {
    // Check if the dataset is empty
    if (!dataset || dataset.length === 0) {
      this.originalDataset = [];
      this.sortedDataset = [];
      this.filteredDataset = [];
      this.dataset = this.filteredDataset;
      this.gridDataset.pageData = [];
      this.gridDataset.totalRowCount = 0;
      this.gridDataset.pageNumber = 1;
      this.render();
      return;
    }

    this.originalDataset = dataset;
    this.sortedDataset = [...dataset];
    this.filteredDataset = [...dataset];
    this.dataset = this.filteredDataset;
    // Set the pageData if we are using server data
    if (totalRowCount !== undefined) {
      if (!this.gridDataset.pageNumber) {
        this.gridDataset.pageNumber = 1;
      }
      this.gridDataset.totalRowCount = totalRowCount;
      this.processPaging();
      this.processDataset();
      this.gridDataset.pageData = this.gridDataset.dataset;

      // Fire off a page change
      this.pageChange.next(this.gridDataset.pageNumber);
    }
    this.render();
    this.resize();
    this.resetGridScroll();
  }

  /**
   * Sets the grid container element for the grid service.
   *
   * If a container is specified in `gridOptions`, this method assigns the grandparent
   * of the container's native element to `gridContainerElement`. Otherwise, it defaults
   * to using the `document.body` as the grid container.
   *
   * This method is typically used to determine the DOM element that will act as the
   * container for grid-related UI elements, such as overlays or popups.
   */
  setGridContainerElement(): void {
    if (this.gridOptions.container) {
      // Check if the container is a string or an HTML element
      if (typeof this.gridOptions.container === 'string') {
        // If the container is window or body, set the gridContainerElement accordingly
        if (this.gridOptions.container === 'window' || this.gridOptions.container === 'body' || this.gridOptions.container === 'document' || this.gridOptions.container === 'document.body') {
          this.gridContainerElement = window.document.body as HTMLElement;
        } else {
          // Otherwise, find the element by ID
          const containerElement = document.getElementById(this.gridOptions.container);
          if (containerElement) {
            this.gridContainerElement = containerElement as HTMLElement;
          } else {
            console.warn(`Container with ID ${this.gridOptions.container} not found.`);
            this.gridContainerElement = window.document.body as HTMLElement;
          }
        }
      } else if (this.gridOptions.container instanceof HTMLElement) {
        this.gridContainerElement = this.gridOptions.container as HTMLElement;
      } else if (this.gridOptions.container instanceof ElementRef) {
        this.gridContainerElement = this.gridOptions.container?.nativeElement as HTMLElement;
      }
    } else {
      // Default to using the document body as the grid container
      this.gridContainerElement = this.gridContainer?.nativeElement?.parentNode?.parentNode as HTMLElement;
    }
  }

  
  /**
   * Determines whether the grid's table body has a horizontal scrollbar
   * and updates the `hasHorizontalScrollbar` property accordingly.
   *
   * This method calculates the available width for the table body by subtracting
   * the scrollbar width (if a vertical scrollbar is present) from the offset width
   * of the table body element. It then compares the scroll width of the table body
   * to this calculated width to determine if a horizontal scrollbar is needed.
   */
  setHasHorizontalScrollbar(): void {
    // Set the hasHorizontalScrollbar property based on whether the scrollWidth is greater than the offsetWidth of the tableBody element
    const testWidth = this.gridBody.tableBody.nativeElement.offsetWidth - (this.hasVerticalScrollbar ? this.scrollbarWidth : 0);
    this.hasHorizontalScrollbar = this.gridBody.tableBody.nativeElement.scrollWidth > testWidth;
  }
  
  /**
   * Determines whether the grid's table body has a vertical scrollbar.
   * Updates the `hasVerticalScrollbar` property based on the comparison
   * between the `scrollHeight` and `offsetHeight` of the `tableBody` element.
   *
   * If the `scrollHeight` (total height of the content) exceeds the
   * `offsetHeight` (visible height of the element), it indicates the presence
   * of a vertical scrollbar.
   *
   * @returns {void}
   */
  setHasVerticalScrollbar(): void {
    // Set the hasVerticalScrollbar property based on whether the scrollHeight is greater than the offsetHeight of the tableBody element
    this.hasVerticalScrollbar = this.gridBody.tableBody.nativeElement.scrollHeight > this.gridBody.tableBody.nativeElement.offsetHeight;
  }

  
  /**
   * Sets the size of the scrollbar by creating a temporary element to measure
   * the width of the scrollbar. This is done by comparing the offset width
   * of the element with and without scrollbars.
   * 
   * @returns {void}
   */
  setScrollbarSize(): void {
    const outer = document.createElement('div');
    outer.classList.add('scrollbarTest'); // add a class to simplify CSS targeting
    this.gridBody.tableBody.nativeElement.appendChild(outer);
  
    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';
  
    // Add content and scrollbars
    const inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '100px'; // add some height to force scrollbars
    outer.appendChild(inner);
  
    const widthWithScroll = inner.offsetWidth;
  
    // Remove divs and class
    outer.parentNode?.removeChild(outer);
    outer.classList.remove('scrollbarTest');
  
    this.scrollbarSize = widthNoScroll - widthWithScroll;
  }

  /**
   * Calculates and sets the size of the scrollbar for the grid.
   * 
   * This method dynamically creates a temporary DOM element to measure the
   * width of the scrollbar by comparing the element's width with and without
   * scrollbars. The calculated scrollbar size is then stored in the `scrollbarSize` property.
   * 
   * Steps:
   * 1. Creates a temporary `div` element and appends it to the grid body.
   * 2. Measures the width of the element without scrollbars.
   * 3. Forces the element to show scrollbars and measures the width again.
   * 4. Calculates the scrollbar size as the difference between the two widths.
   * 5. Cleans up by removing the temporary element from the DOM.
   * 
   * @remarks
   * This method assumes that the grid body (`this.gridBody.tableBody.nativeElement`)
   * is already available and properly initialized.
   */
  updateGridHeight() {
    const gridBody = this.gridBody.tableBody.nativeElement;

    if (this.gridOptions.height === 'auto') { 
      // Get the heights of various components in the grid, defaults to zero if not found
      const menuBarHeight = this.gridMenuBar && this.gridMenuBar.menuBar ? this.gridMenuBar.menuBar.nativeElement.getBoundingClientRect().height : 0;
      const headerHeight = this.gridHeader && this.gridHeader.tableHead ? this.gridHeader.tableHead.nativeElement.getBoundingClientRect().height : 0;
      const footerHeight = this.gridFooter && this.gridFooter.tableFooter ? this.gridFooter.tableFooter.nativeElement.getBoundingClientRect().height : 0;
      const pagerHeight = this.gridPager && this.gridPager.tablePager ? this.gridPager.tablePager.nativeElement.getBoundingClientRect().height : 0;
      
      const gridContainerTop = this.gridContainer ? this.gridContainer.nativeElement.getBoundingClientRect().top : 0;
      const gridOffset = this.gridOptions.heightOffset !== undefined ? this.gridOptions.heightOffset : 0;
      const gridTop = gridContainerTop + gridOffset;
  
      // Calculate the height of the grid body
      let bodyHeight = this.getContainerHeight() - gridTop - menuBarHeight - headerHeight - footerHeight - pagerHeight;
      const borderBottomWidth = window.getComputedStyle(gridBody).getPropertyValue('border-bottom-width');
      const borderTopWidth = window.getComputedStyle(gridBody).getPropertyValue('border-top-width');
      const scrollWidth = this.hasHorizontalScrollbar ? this.scrollbarSize : 0;
    
      bodyHeight -= parseFloat(borderBottomWidth) + parseFloat(borderTopWidth) + scrollWidth;
      gridBody.style.height = Math.floor(bodyHeight) + 'px';
    }
  
    // Calculate the height of the filler row
    let childrenHeight = 0;
    this.gridBody.rowComponents.forEach(component => {
      childrenHeight += component.el.nativeElement.getBoundingClientRect().height;
    });
    this.gridBody.nestedRowComponents.forEach(component => {
      childrenHeight += component.el.nativeElement.getBoundingClientRect().height;
    });
    
    const borderBottomWidth = Math.ceil(parseFloat(window.getComputedStyle(gridBody).getPropertyValue('border-bottom-width')));
    const borderTopWidth = Math.ceil(parseFloat(window.getComputedStyle(gridBody).getPropertyValue('border-top-width')));
    const fillerRowHeight = gridBody.offsetHeight - childrenHeight - borderBottomWidth - borderTopWidth;

    this.fillerRowHeight = fillerRowHeight >=0 ? fillerRowHeight : 0;
  }

  /**
   * Updates the order of the grid headers based on the provided column definitions.
   * 
   * @param columns - An optional array of `ColumnDef` objects representing the new column definitions.
   *                  If provided, these will replace the current column definitions in the grid options.
   * 
   * This method performs the following actions:
   * - Updates the grid's column definitions if `columns` is provided.
   * - Processes the grid definitions using the `gridColumnService`.
   * - Processes the dataset to ensure it aligns with the updated column definitions.
   * - Triggers a re-render of the grid.
   * - Emits a `true` value through the `afterUpdateHeaderOrder` observable to signal that the header order update is complete.
   */
  updateHeaderOrder(columns?: ColumnDef[]) {
    if (columns) {
      this.gridOptions.columnDefs = columns;
    }

    this.processDataset();
    this.render();

    const scrollDelta = this.gridScrollService.scrollDelta;
    this.resetGridScrollWithTimeout(scrollDelta);

    this.afterUpdateHeaderOrder.next(true);
  }

  /**
   * Updates the pinned columns in the grid and adjusts their order accordingly.
   * 
   * - Filters the column definitions to identify pinned columns.
   * - Reorders the column definitions to place pinned columns at the beginning.
   * - Clears the `lastPinned` property for all columns.
   * - Sets the `lastPinned` property for the last pinned column.
   * - Updates the grid dataset with the current list of pinned columns.
   * 
   * @remarks
   * This method ensures that pinned columns are properly ordered and marked
   * within the grid's column definitions. It also propagates the changes to
   * the grid dataset for further use.
   */
  updatePinnedCols(): void {
    try {
      this.pinnedColumns = this.gridOptions.columnDefs.filter(col => col.pinned);

      // Set column order based on pinned columns
      const reversePinnedColumns = [...this.pinnedColumns].reverse();
      for (const column of reversePinnedColumns) {
        const index = this.gridOptions.columnDefs.indexOf(column);
        this.gridOptions.columnDefs.unshift(this.gridOptions.columnDefs.splice(index, 1)[0]);
      }

      // Clear current last pinned column
      const flattenedColumns = this.gridColumnService.flattenColumns(this.gridOptions.columnDefs);
      flattenedColumns.forEach(col => col.lastPinned = false);

      // Set new last pinned column
      if (this.pinnedColumns.length > 0) {
        const flattenedPinnedColumns = this.gridColumnService.flattenColumns(this.pinnedColumns);
        flattenedPinnedColumns.forEach(col => col.pinned = true);
        this.pinnedColumns.push(...flattenedPinnedColumns);
        this.pinnedColumns[this.pinnedColumns.length - 1].lastPinned = true;
      }

      this.gridDataset.pinnedColumns = this.pinnedColumns;

      this.afterPinnedColumnsUpdated.next(true);
    } catch (error) {
      console.error('Error updating pinned columns:', error);
    }
  }

  /**
   * Updates the state of toggled pinned columns in the grid.
   * This method processes the dataset and triggers a re-render
   * of the grid to reflect the updated column states.
   */
  updateToggledPinnedCols() {
    this.processDataset();
  }

  /**
   * Builds and returns the Grid API object, which provides a set of methods
   * for interacting with and manipulating the grid's state, data, and configuration.
   *
   * @returns {GridApi} The Grid API object with various utility methods.
   */
  private buildGridApi(): GridApi {
    return {
      // === Grouping ===
      addGroupByColumn: (column: ColumnDef) => this.addGroupByColumn(column),
      removeGroupByColumn: (column: ColumnDef) => this.removeGroupByColumn(column),
      getGroupByColumns: () => this.gridDataset.groupByColumns || [],
      afterGroupBy: (callback: Function) => {
        const subscription = this.afterGroupBy.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },

      // === Sorting ===
      applySorting: (sortState: SortState[]) => this.applySorting(sortState),
      getSortState: () => this.currentSortState || [],
      setSortFunction: (fn: (data: any[], sortState: SortState[]) => any[]) => this.setSortFunction(fn),
      afterApplySorting: (callback: Function) => {
        const subscription = this.afterApplySorting.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },

      // === Filtering ===
      applyFilter: (filterState: FilterState) => this.setFilteredData(filterState),
      getFilterState: () => this.currentFilterState || {},
      setFilterFunction: (fn: (data: any[], filterState: FilterState) => any[]) => this.setFilterFunction(fn),
      afterApplyFilter: (callback: Function) => {
        const subscription = this.afterApplyFilter.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },

      // === Column Management ===
      getColumnDefs: () => this.gridOptions.columnDefs,
      setColumnDefs: (columnDefs: ColumnDef[]) => {
        this.gridOptions.columnDefs = columnDefs;
        this.gridColumnService.processGridDefs(this.gridOptions, this.gridDataset);
        this.processDataset();

        this.grid.changeDetector.detectChanges();
        this.afterSetColumnDefs.next(this.gridOptions.columnDefs);
      },
      afterSetColumnDefs: (callback: Function) => {
        const subscription = this.afterSetColumnDefs.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },
      getFlattenedColumnDefs: () => this.gridColumnService.flattenColumns(this.gridOptions.columnDefs),

      // === Column Headers ===
      getColumnHeaders: () => this.getColumnHeaders(),
      getColumnHeader: (id: string) => {
        const header = this.getColumnHeader(id);
        return header ? new ElementRef(header) : null;
      },

      // === Column Visibility ===
      hideColumn: (id: string) => {
        const column = this.gridColumnService.getColumnById(id, this.gridOptions.columnDefs);
        if (column) {
          column.visible = false;
          this.grid.columnVisibilityChange.next({ id, visible: false });
        }
      },
      showColumn: (id: string) => {
        const column = this.gridColumnService.getColumnById(id, this.gridOptions.columnDefs);
        if (column) {
          column.visible = true;
          this.grid.columnVisibilityChange.next({ id, visible: true });
        }
      },
      isColumnVisible: (id: string) => {
        const column = this.gridColumnService.getColumnById(id, this.gridOptions.columnDefs);
        return column?.visible !== false;
      },

      // === Row Management ===
      expandRow: (id: string) => {
        const row = this.gridDataset.bodyRows.find((r) => r.id === id);
        if (row) {
          row.nestedExpanded = true;
        }
      },
      collapseRow: (id: string) => {
        const row = this.gridDataset.bodyRows.find((r) => r.id === id);
        if (row) {
          row.nestedExpanded = false;
        }
      },
      isRowExpanded: (id: string) => {
        const row = this.gridDataset.bodyRows.find((r) => r.id === id);
        return row?.nestedExpanded || false;
      },

      // === Selection Management ===
      getSelectedRows: () => this.gridDataset.selectedRows,
      selectRow: (id: string) => {
        const isSelected = this.gridDataset.selectedRows.some((r) => r.id === id);
        if (!isSelected) {
          const row = this.gridDataset.bodyRows.find((r) => r.id === id);
          if (row) {
            this.gridDataset.selectedRows.push(row);
          }
        }
        this.gridDataset.selectedRows = this.gridDataset.dataset.filter((row) => row.selected);
        this.selectedRowsChange.next(this.gridDataset.selectedRows);
      },
      deselectRow: (id: string) => {
        const index = this.gridDataset.selectedRows.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.gridDataset.selectedRows.splice(index, 1);
        }
        this.gridDataset.selectedRows = this.gridDataset.dataset.filter((row) => row.selected);
        this.selectedRowsChange.next(this.gridDataset.selectedRows);
      },
      selectAllRows: () => {
        this.gridDataset.dataset.forEach((row) => row.selected = true);
        this.gridDataset.selectedRows = this.gridDataset.dataset.filter((row) => row.selected);
        this.selectedRowsChange.next(this.gridDataset.selectedRows);
      },
      deselectAllRows: () => {
        this.gridDataset.dataset.forEach((row) => row.selected = false);
        this.gridDataset.selectedRows = [];
        this.selectedRowsChange.next(this.gridDataset.selectedRows);
      },

      // === Pagination ===
      getCurrentPage: () => this.gridDataset.pageNumber,
      setCurrentPage: (pageNumber: number) => {
        this.selectPage(pageNumber);
      },
      getTotalPages: () => {
        if (this.gridDataset.totalRowCount) {
          return Math.ceil(this.gridDataset.totalRowCount / (this.gridOptions.pageSize || 1));
        }
        return Math.ceil(this.dataset.length / (this.gridOptions.pageSize || 1));
      },
      getPageSize: () => this.gridOptions.pageSize || null,
      setPageSize: (pageSize: number) => {
        this.gridOptions.pageSize = pageSize;
        this.selectPage(1);
      },

      // === Grid Options ===
      getGridOptions: () => this.gridOptions,

      // === Data Management ===
      getData: () => this.dataset,
      setData: (data: any[], totalRowCount?: number) => this.setData(data, totalRowCount),
      getOriginalData: () => this.originalDataset,
      resetToOriginalData: () => this.resetToOriginalData(),
      setDataTotalCount: (totalCount: number) => {
        this.gridDataset.totalRowCount = totalCount;
        this.processPaging();
        this.render();
      },

      // === State Management ===
      getState: () => null,
      setState: (state: any) => {},

      // === Rendering and Resizing ===
      refresh: () => {
        this.updateHeaderOrder();
        this.render();
      },
      resetScrollPosition: () => {
        this.gridScrollService.scrollGrid(
          new Event('scroll'),
          {left: 0, top: 0},
          this.gridOptions,
          this.gridHeader,
          this.gridBody,
          this.gridScroller,
          this.gridFooter,
          this.hasVerticalScrollbar,
          this.scrollbarWidth
        );
      },
      resize: () => this.resize(),

      // === Plugin Management ===
      getPluginOptions: () => this.pluginOptions,
      getPluginBar: () => {
        return this.gridMenuBar?.pluginBar || null;
      },

      // === Event Hooks ===
      afterColumnReorder: (callback: Function) => {
        const subscription = this.afterUpdateHeaderOrder.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },
      afterPinnedColumnsUpdated: (callback: Function) => {
        const subscription = this.afterPinnedColumnsUpdated.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },
      afterRender: (callback: Function) => {
        const subscription = this.afterRender.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },
      afterResize: (callback: Function) => {
        const subscription = this.afterResize.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },
      afterScroll: (callback: Function) => {
        const subscription = this.gridScrollService.afterScroll.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },

      // === Pinned Columns ===
      updateToggledPinnedCols: () => this.updateToggledPinnedCols(),

      // === Grid Container ===
      getContainer: () => {
        if (!this.gridContainer) {
          throw new Error('Grid container is not initialized.');
        }
        return this.gridContainer;
      },

      // === Custom Events ===
      onRowClick: (callback: Function) => {
        const subscription = this.grid.rowClick.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },
      onRowDoubleClick: (callback: Function) => {
        const subscription = this.grid.rowDoubleClick.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },
      onCellClick: (callback: Function) => {
        const subscription = this.grid.cellClick.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },
      onCellDoubleClick: (callback: Function) => {
        const subscription = this.grid.cellDoubleClick.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },
      onColumnResize: (callback: Function) => {
        const subscription = this.grid.columnResize.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },
      onColumnVisibilityChange: (callback: Function) => {
        const subscription = this.grid.columnVisibilityChange.subscribe((event: any) => {
          setTimeout(() => callback(event));
        });
        return () => subscription.unsubscribe();
      },
    };
  }

  /**
   * Retrieves an array of column header elements from the grid's header rows.
   *
   * This method iterates through the row components of the grid header,
   * and for each row, it selects all elements matching the CSS selectors
   * `.leaf-column .column-container`. These elements are then collected
   * into an array and returned.
   *
   * @returns {HTMLElement[]} An array of `HTMLElement` objects representing the column headers.
   */
  private getColumnHeaders(): HTMLElement[] {
    const headerRows = this.gridHeader.rowComponents.toArray();
    const columnHeaders: HTMLElement[] = [];

    headerRows.forEach((row) => {
        row.el.nativeElement.querySelectorAll('.leaf-column .column-container').forEach((header: HTMLElement) => {
          if (header) {
            columnHeaders.push(header);
          }
        });
    });

    return columnHeaders;
  }

  /**
   * Retrieves the column header element corresponding to the specified column ID.
   *
   * This method searches through the grid header's row components to find
   * a header element that matches the provided column ID. It looks for elements
   * with the CSS classes `.leaf-column .column-container` or 
   * `.group-header .column-container` and checks their `data-column-id` attribute.
   *
   * @param id - The ID of the column whose header element is to be retrieved.
   * @returns The `HTMLElement` representing the column header if found, or `null` if no match is found.
   */
  private getColumnHeader(id: string): HTMLElement | null {
    try {
      const headerRows = this.gridHeader.rowComponents.toArray();
      let columnHeader: HTMLElement | null = null;

      headerRows.forEach((row) => {
        row.el.nativeElement.querySelectorAll('.column-container').forEach((header: HTMLElement) => {
          if (header && header.getAttribute('data-column-id') === id) {
            columnHeader = header;
          }
        });
      });

      return columnHeader;
    } catch (error) {
      console.error(`Error retrieving column header for ID "${id}":`, error);
      return null;
    }
  }

  /**
   * Retrieves the height of the grid container element in pixels.
   *
   * @returns The offset height of the grid container element, or 0 if the element is not available.
   */
  private getContainerHeight(): number {
    return (this.gridContainerElement?.offsetHeight ?? 0);
  }

  /**
   * Groups an array of grid rows based on the specified columns.
   *
   * @param data - The array of grid rows to be grouped.
   * @param groupByColumns - An array of column IDs to group the data by, in hierarchical order.
   * @returns A nested array structure representing the grouped data. Each group contains a `key` 
   *          representing the group value and `rows` which can either be the grouped rows or further nested groups.
   *
   * @remarks
   * - If `groupByColumns` is empty or not provided, the original data is returned without grouping.
   * - The grouping is performed recursively, with each level of grouping corresponding to a column in `groupByColumns`.
   * - The `gridColumnService.flattenColumns` method is used to retrieve the flattened column definitions for determining group keys.
   *
   * @example
   * ```typescript
   * const data = [
   *   { row: { category: 'A', subCategory: 'X', value: 10 } },
   *   { row: { category: 'A', subCategory: 'Y', value: 20 } },
   *   { row: { category: 'B', subCategory: 'X', value: 30 } },
   * ];
   * const groupByColumns = ['category', 'subCategory'];
   * const groupedData = groupData(data, groupByColumns);
   * // Result:
   * // [
   * //   {
   * //     key: 'A',
   * //     rows: [
   * //       { key: 'X', rows: [{ row: { category: 'A', subCategory: 'X', value: 10 } }] },
   * //       { key: 'Y', rows: [{ row: { category: 'A', subCategory: 'Y', value: 20 } }] }
   * //     ]
   * //   },
   * //   {
   * //     key: 'B',
   * //     rows: [
   * //       { key: 'X', rows: [{ row: { category: 'B', subCategory: 'X', value: 30 } }] }
   * //     ]
   * //   }
   * // ]
   * ```
   */
  private groupData(data: Array<GridRow>, groupByColumns: ColumnDef[]): Array<any> {
    try {
      if (!groupByColumns || groupByColumns.length === 0) {
        return data; // No grouping
      }

      const flattenedColumns = this.gridColumnService.flattenColumns(this.gridOptions.columnDefs);

      const groupRecursive = (rows: Array<GridRow>, columns: ColumnDef[]): Array<any> => {
        if (columns.length === 0) {
          return rows; // No more columns to group by
        }

        const [currentColumn, ...remainingColumns] = columns;

        // Group the data by the current column
        const groupedData = rows.reduce((groups: { [key: string]: { key: string; rows: GridRow[] } }, gridRow) => {
          const column = flattenedColumns.find(c => c === currentColumn);
          const groupKey = column && column.field ? gridRow.row[column.field] : null;

          if (!groups[groupKey]) {
            groups[groupKey] = { key: groupKey, rows: [] };
          }

          groups[groupKey].rows.push(gridRow);

          return groups;
        }, {});

        // Recursively group the subgroups
        return Object.keys(groupedData).map(key => ({
          key,
          rows: groupRecursive(groupedData[key].rows, remainingColumns),
        }));
      };

      return groupRecursive(data, groupByColumns);
    } catch (error) {
      console.error('Error grouping data:', error);
      return [];
    }
  }

  /**
   * Resets the grid's scroll position to the top-left corner.
   * 
   * This method uses the `gridScrollService` to scroll the grid to the
   * specified position (left: 0, top: 0). It also takes into account the
   * presence of vertical scrollbars and the scrollbar width.
   */
  private resetGridScroll(): void {
    try {
      this.gridScrollService.scrollGrid(
        new Event('scroll'),
        { left: 0, top: 0 },
        this.gridOptions,
        this.gridHeader,
        this.gridBody,
        this.gridScroller,
        this.gridFooter,
        this.hasVerticalScrollbar,
        this.scrollbarWidth
      );
    } catch (error) {
      console.error('Error resetting grid scroll:', error);
    }
  }

  /**
   * Resets the grid's dataset to its original state.
   * 
   * This method restores the dataset to its initial state by:
   * - Reverting `dataset`, `filteredDataset`, and `sortedDataset` to the original dataset.
   * - Reprocessing the dataset to ensure any dependent operations are updated.
   * - Triggering a re-render of the grid.
   * - Resetting the grid's scroll position to its default state.
   * 
   * This is useful for scenarios where the grid needs to be restored to its
   * unmodified state, such as after clearing filters or sorting.
   */
  private resetToOriginalData() {
    this.dataset = this.originalDataset;
    this.filteredDataset = [...this.originalDataset];
    this.sortedDataset = [...this.originalDataset];
    this.processDataset();
    this.resetGridScroll();
  }

  /**
   * Updates the filtered dataset based on the provided filter state and applies necessary updates
   * to the grid's data and rendering.
   *
   * @param filterState - The current state of filters to be applied to the dataset.
   *
   * This method performs the following steps:
   * 1. Applies the filter state to the sorted dataset to generate the filtered dataset.
   * 2. Updates the main dataset with the filtered dataset.
   * 3. Processes the updated dataset for any additional transformations or calculations.
   * 4. Triggers a re-render of the grid to reflect the updated data.
   * 5. Resets the grid's scroll position to its initial state.
   */
  private setFilteredData(filterState: FilterState): void {
    this.filteredDataset = this.applyFilter(filterState, this.sortedDataset);
    this.dataset = this.filteredDataset;
    this.processDataset();
    this.resetGridScroll();
  }

  /**
   * Detects the user's operating system based on the platform and user agent information
   * available in the window.navigator object, and sets the result to the instance variable this.os.
   * @private
   * @function
   * @name setOS
   * @returns {void} No return value.
   */
  private setOS(): void {
    const platform = window.navigator.platform;

    switch (true) {
      case /^Mac/.test(platform):
        this.os = 'Mac OS';
        break;
      case /^iPhone|iPad|iPod$/.test(platform):
        this.os = 'iOS';
        break;
      case /^Win/.test(platform):
        this.os = 'Windows';
        break;
      case /\bAndroid\b/.test(navigator.userAgent):
        this.os = 'Android';
        break;
      case /Linux/.test(platform):
        this.os = 'Linux';
        break;
      default:
        this.os = '';
    }
  }

  /**
   * Sets the minimum width for the grid rows based on the column definitions and their visibility.
   * 
   * This method calculates the minimum width required for the rows by summing up the widths of
   * all visible columns, including any feature columns. It sets the calculated width to the
   * `rowMinWidth` property of the grid.
   * 
   * @private
   * @returns {void}
   */
  private setRowMinWidth(): void {
    const visibleColumnDefs = this.gridOptions.columnDefs.filter((columnDef) => columnDef.visible !== false);
    const defaultColumnWidth = this.gridOptions.columnWidth ? parseInt(this.gridOptions.columnWidth) : 150;
    const featureColumnWidth = parseInt(this.gridColumnService.getFeatureColumnWidth(this.getFeatureCount(), this.gridOptions));
    const minWidth = visibleColumnDefs.reduce((acc, columnDef) => acc + (columnDef.width ? Number(columnDef.width.replace('px', '')) : defaultColumnWidth), 0) + featureColumnWidth;
    this.rowMinWidth = `${minWidth}px`;
  }
  
  /**
   * Calculates and sets the height of the scrollbar.
   * @private
   * @returns {void}
   */
  private setScrollbarHeight = (): void => {
    const { tableBody } = this.gridBody || {};
  
    if (!tableBody) return;
  
    const tableEl = tableBody.nativeElement as HTMLElement;
    const hasScroll = tableEl.scrollWidth !== tableEl.clientWidth;
    
    this.scrollbarHeight = hasScroll ? tableEl.offsetHeight - tableEl.clientHeight : 0;
  }

  /**
   * Sets the scrollbar width and header width based on the presence of scroll in the table body element.
   * @private
   * @returns {void}
   */
   private setScrollbarWidth(): void {
    const { tableBody } = this.gridBody || {};
    if (!tableBody) return;
    
    const tableEl = tableBody.nativeElement as HTMLElement;
    const hasScroll = tableEl.scrollHeight !== tableEl.clientHeight;
    const scrollbarWidth = hasScroll ? tableEl.offsetWidth - tableEl.clientWidth : 0;
    this.scrollbarWidth = scrollbarWidth > 0 ? scrollbarWidth : 0;
    this.headerWidth = hasScroll ? `${tableEl.clientWidth}px` : '100%';
  }

  /**
   * Sets the values for table scrolling based on table dimensions and scrollbar visibility.
   * @returns {void}
   */
  private setTableScrollValues(): void {
    let widthOffset = 0;
    this.tableScrollHeight = 0;
    this.tableScrollWidth = parseInt(this.gridBody.tableBody.nativeElement.scrollWidth, 0) - widthOffset;
      
    if (this.hasHorizontalScrollbar) {
      this.tableScrollHeight += this.scrollbarSize;
    }

    if (this.hasVerticalScrollbar) {
      this.tableScrollWidth += this.scrollbarSize;
    }
  }

  /**
   * Recursively updates the parent property of child columns in a hierarchical column structure.
   * 
   * This method traverses through the provided array of columns and assigns the parent column
   * to each child column. If a column has children, the method is called recursively on the
   * children to ensure the entire hierarchy is updated.
   * 
   * @param columns - An array of column definitions to process. Each column may have a `children`
   *                  property containing an array of child columns.
   */
  private updateColumnParents(columns: ColumnDef[]): void {
    for (const column of columns) {
      if (column.children && column.children.length > 0) {
        column.children.forEach((child: ColumnDef) => {
          child.parent = column;
        });
        this.updateColumnParents(column.children);
      }
    }
  }

  /**
   * Updates the state of the scrollbars for the grid. This method performs
   * several operations to ensure the scrollbars are correctly configured
   * based on the current state of the grid, including:
   * - Determining the presence of horizontal and vertical scrollbars.
   * - Calculating the width and height of the scrollbars.
   * - Setting the scroll values for the table.
   *
   * This method is intended to be used internally to maintain the visual
   * and functional integrity of the grid's scrolling behavior.
   *
   * @private
   */
  private updateScrollBars(): void {
    this.setHasHorizontalScrollbar();
    this.setHasVerticalScrollbar();
    this.setScrollbarWidth();
    this.setScrollbarHeight();
    this.setTableScrollValues();
  }

  /**
   * Adds a column to the groupBy array and updates the dataset grouping.
   * 
   * This method ensures that the specified column is added to the `groupBy` array
   * if it is not already present. It then groups the dataset based on the updated
   * `groupBy` array, triggers a re-render of the grid, and emits the updated grouped
   * data through the `afterGroupBy` observable.
   * 
   * @param column - The column definition to be added to the groupBy array.
   */
  addGroupByColumn(column: ColumnDef): void {
    if (!this.gridDataset.groupByColumns) {
      this.gridDataset.groupByColumns = [];
    }

    // Add the column to the groupByColumns array if not already present
    if (!this.gridDataset.groupByColumns.includes(column)) {
      this.gridDataset.groupByColumns.push(column);
      column.groupBy = true;
    }

    if (this.gridApi.requestData) {
      // Server-side grouping: request grouped data from the server
      this.gridApi.requestData({
        startRow: 0,
        endRow: this.gridOptions.pageSize || 50,
        sortState: this.currentSortState,
        filterState: this.currentFilterState,
        groupBy: this.gridDataset.groupByColumns.map(col => col.field).filter((field): field is string => typeof field === 'string'),
        groupKeys: []
      }).subscribe((response: GridDataResponse) => {
        // Optionally handle response here if needed
        this.afterGroupBy.next(response.data);
        this.render();
      });
    } else {
      // Client-side grouping
      this.gridDataset.groupByData = this.groupData(this.gridDataset.dataset, this.gridDataset.groupByColumns);
      this.render();
      this.afterGroupBy.next(this.gridDataset.groupByData);
    }
  }

  /**
   * Removes a column from the groupBy array in the grid dataset.
   * 
   * If the specified column is part of the groupBy array, it will be removed.
   * If no columns remain in the groupBy array after removal, the dataset will be reset
   * to its original state, and the groupByData will be cleared.
   * 
   * After updating the groupBy configuration, the grid is re-rendered, and the updated
   * groupByData is emitted via the `afterGroupBy` observable.
   * 
   * @param column - The column definition object representing the column to be removed from the groupBy array.
   */
  removeGroupByColumn(column: ColumnDef): void {
    if (this.gridDataset.groupByColumns) {
      // Remove the column from the groupBy array
      this.gridDataset.groupByColumns = this.gridDataset.groupByColumns.filter((col) => col !== column);
      column.groupBy = false;

      if (this.gridApi.requestData) {
        // Server-side grouping: request grouped data from the server
        const groupByFields = this.gridDataset.groupByColumns.map(col => col.field).filter((field): field is string => typeof field === 'string');
        this.gridApi.requestData({
          startRow: 0,
          endRow: this.gridOptions.pageSize || 50,
          sortState: this.currentSortState,
          filterState: this.currentFilterState,
          groupBy: groupByFields,
          groupKeys: []
        }).subscribe((response: GridDataResponse) => {
          // Optionally handle response here if needed
          this.afterGroupBy.next(response.data);
          this.render();
        });
      } else {
        // Client-side grouping
        if (this.gridDataset.groupByColumns.length === 0) {
          this.gridDataset.groupByData = [];
          this.dataset = this.originalDataset;
        } else {
          this.gridDataset.groupByData = this.groupData(this.gridDataset.dataset, this.gridDataset.groupByColumns);
        }
        this.render();
        this.afterGroupBy.next(this.gridDataset.groupByData);
      }
    }
  }

  /**
   * Resets the grid scroll position with a slight delay to force a reflow/repaint of the grid.
   * This method temporarily adjusts the horizontal scroll position (`scrollDelta.left`) 
   * to trigger the necessary updates and then restores it to its original value.
   *
   * @param scrollDelta - An object representing the scroll position deltas for the grid.
   *                       The `left` property is temporarily modified during the operation.
   */
  private resetGridScrollWithTimeout(scrollDelta: ScrollDelta): void {
    setTimeout(() => {
      // This forces a reflow/repaint of the grid

      scrollDelta.left ++;
      this.gridScrollService.scrollGrid(
        new Event('scroll'),
        scrollDelta,
        this.gridOptions,
        this.gridHeader,
        this.gridBody,
        this.gridScroller,
        this.gridFooter,
        this.hasVerticalScrollbar,
        this.scrollbarWidth
      );

      scrollDelta.left --;
      this.gridScrollService.scrollGrid(
        new Event('scroll'),
        scrollDelta,
        this.gridOptions,
        this.gridHeader,
        this.gridBody,
        this.gridScroller,
        this.gridFooter,
        this.hasVerticalScrollbar,
        this.scrollbarWidth
      );
    });
  }

  private setFilterFunction(fn: (data: any[], filterState: FilterState) => any[]): void {
    this.filterFunction = fn;
  };

  private setSortFunction(fn: (data: any[], sortState: SortState[]) => any[]): void {
    this.sortFunction = fn;
  };
}
