import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { GridPlugin } from '../interfaces/grid-plugin';
import { GridApi } from '../interfaces/grid-api';
import { ColumnDef } from '../interfaces/column-def';
import { SortState } from '../interfaces/sort-state';
import { PluginOptions } from '../interfaces';
import { PluginConfig } from '../../shared/interfaces/plugin-config.interface';

@Injectable()
export class MultiSortPlugin implements GridPlugin {
  private gridApi!: GridApi;
  private renderer: Renderer2;
  private sortState: SortState[] = [];
  private pluginOptions: PluginOptions | PluginConfig = {};
  

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }


  onInit(api: GridApi, config?: PluginOptions): void {
    this.gridApi = api;

    const pluginOptions = this.gridApi.getPluginOptions();
    this.pluginOptions = config ?? pluginOptions['MultiSort'] ?? {};

    // Check if the pluginOptions include `enableMultiSort`
    if (!this.pluginOptions['enableMultiSort']) {
      return; // Do not add the plugin if `enableMultiSort` is not enabled
    }

    // Register the sort function with the grid API
    this.gridApi.setSortFunction(this.applySorting);

    // Attach click listeners to column headers
    this.attachColumnHeaderListeners();

    // Listen for drag-drop events
    this.gridApi.afterColumnReorder(() => {
      this.attachColumnHeaderListeners(); // Reattach listeners after reordering
      this.updateColumnHeaders(); // Reapply the sort indicators
    });

    this.gridApi.afterPinnedColumnsUpdated(() => {
      this.attachColumnHeaderListeners(); // Reattach listeners after reordering
      this.updateColumnHeaders(); // Reapply the sort indicators
    });

    this.gridApi.afterApplySorting(() => {
      this.updateColumnHeaders(); // Reapply the sort indicators
    });
  }

  onDestroy(): void {
    // Clean up event listeners
    const columnHeaders = this.gridApi.getColumnHeaders();
    columnHeaders.forEach(header => {
      var parentNode = header.parentNode as HTMLElement;
      parentNode.removeEventListener('click', (event: MouseEvent) => this.handleColumnClick(event, header));
    });
  }

  private handleColumnClick(event: MouseEvent, headerElement: HTMLElement): void {
    const columnId = headerElement.getAttribute('data-column-id');
    const column = this.gridApi.getFlattenedColumnDefs().find(col => col.id === columnId);
  
    if (!column) {
      console.warn('Column definition not found for Id:', columnId);
      return;
    }
  
    // Check if the column is sortable
    if (column.sortable === false) {
      return;
    }
  
    const isCtrlPressed = event.ctrlKey || event.metaKey; // MetaKey for Mac (Cmd key)
  
    // Update sort state
    this.updateSortState(column, isCtrlPressed);
  
    // Apply sorting and update headers
    this.gridApi.applySorting(this.sortState);
  }

  private updateSortState(column: ColumnDef, isCtrlPressed: boolean): void {
    if (!isCtrlPressed) {
      // Retain only the clicked column in the sort state
      this.sortState = this.sortState.filter(sort => sort.column === column);
    }

    const existingSort = this.sortState.find(sort => sort.column === column);

    if (existingSort) {
      // Cycle through sorting states: asc -> desc -> none
      existingSort.direction = existingSort.direction === 'asc' ? 'desc' : null;
      if (!existingSort.direction) {
        this.sortState = this.sortState.filter(sort => sort.column !== column);
      }
    } else {
      this.sortState.push({ column, direction: 'asc' });
    }
  }

  private attachColumnHeaderListeners(): void {
    const columnHeaders = this.gridApi.getColumnHeaders();

    columnHeaders.forEach(header => {
      // Check if the listener is already attached
      if (header.getAttribute('data-listener-attached') === 'true') {
        return; // Skip if the listener is already attached
      }

      // Attach the click listener
      var parentNode = header.parentNode as HTMLElement;
      parentNode.addEventListener('click', (event: MouseEvent) => this.handleColumnClick(event, header));

      // Add ARIA attributes for focus and interaction
      header.setAttribute('tabindex', '0'); // Make the header focusable
      header.setAttribute('role', 'button'); // Indicate it is interactive
      header.setAttribute('aria-pressed', 'false'); // Default state

      // Update `aria-pressed` dynamically on click
      this.renderer.listen(header, 'click', () => {
        const isPressed = header.getAttribute('aria-pressed') === 'true';
        header.setAttribute('aria-pressed', (!isPressed).toString());
      });

      // Mark the listener as attached
      header.setAttribute('data-listener-attached', 'true');
    });
  }

  private updateColumnHeaders = (): void => {
    const columnHeaders = this.gridApi.getColumnHeaders();
    const sortState = this.gridApi.getSortState();

    columnHeaders.forEach(header => {
      const columnDef = this.gridApi.getFlattenedColumnDefs().find(col => col.id === header.getAttribute('data-column-id'));
      const sort = sortState.find(s => s.column.id === columnDef?.id);

      // Remove any existing sort indicator
      const existingIndicator = header.querySelector('.sort-indicator');
      if (existingIndicator) {
        existingIndicator.remove();
      }

      // Add ARIA attributes for accessibility
      if (columnDef) {
        header.setAttribute('role', 'columnheader');
        header.setAttribute('aria-label', columnDef.label || columnDef.field || '');
        header.setAttribute('aria-sort', sort ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none');
      }

      if (sort) {
        const showIndex = sortState.length > 1;
        const index = sortState.indexOf(sort) + 1; // 1-based index
        const indicator = document.createElement('span');
        indicator.classList.add('sort-indicator');
        indicator.style.position = 'absolute';
        indicator.style.marginLeft = '5px';
        indicator.innerText = sort.direction === 'asc'
          ? `↑${showIndex ? index : ''}`
          : `↓${showIndex ? index : ''}`;
        header.appendChild(indicator);
      }
    });
  }

  private applySorting = (data: any[], sortState: SortState[]): any[] => {
    return [...data].sort((a, b) => {
      for (const sort of sortState) {
        const field = sort.column.field;
        const direction = sort.direction === 'asc' ? 1 : -1;
  
        if (field) {
          if (a[field] < b[field]) return -1 * direction;
          if (a[field] > b[field]) return 1 * direction;
        }
      }
      return 0;
    });
  }
}