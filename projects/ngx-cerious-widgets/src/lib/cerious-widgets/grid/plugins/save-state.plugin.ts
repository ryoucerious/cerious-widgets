import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { GridPlugin } from '../interfaces/grid-plugin';
import { GridApi } from '../interfaces/grid-api';
import { TemplateRegistryService } from '../../shared/services/template-registry.service';
import { ColumnDef, SortState } from '../interfaces';

@Injectable()
export class SaveGridStatePlugin implements GridPlugin {
  private gridStateButton!: HTMLButtonElement;
  private gridApi!: GridApi;
  private renderer: Renderer2;
  private states: Array<{ name: string; state: any }> = [];
  private menuElement: HTMLElement | null = null;
  private label: string = 'State';
  private closeMenuHandler!: (event: MouseEvent) => void;
  private pluginOptions: any;

  constructor(
    private templateRegistry: TemplateRegistryService,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  onInit(api: GridApi): void {
    this.gridApi = api;

    this.pluginOptions = this.gridApi.getPluginOptions();
    if (!this.pluginOptions?.['GridState']?.enableSaveState) {
      return;
    }

    // Register the setStates function to allow methods to set states
    if (this.pluginOptions?.['GridState']) {
      this.pluginOptions['GridState'].setStates = (states: Array<{ name: string; state: any }>) => {
        this.states = states;
      };
    }

    const pluginBar = this.gridApi.getPluginBar();
    if (!pluginBar) {
      console.warn('Grid plugin bar not found. Grid state button will not be added.');
      return;
    }

    if (this.pluginOptions?.['GridState']?.label) {
      this.label = this.pluginOptions['GridState'].label;
    }

    const buttonTemplate = this.templateRegistry.getTemplate('gridStateButton');
    if (buttonTemplate) {
      const container = this.renderer.createElement('div');
      const embeddedView = buttonTemplate.createEmbeddedView({});
      embeddedView.detectChanges();
      embeddedView.rootNodes.forEach((node: any) => this.renderer.appendChild(container, node));
      this.gridStateButton = container.firstChild as HTMLButtonElement;
    } else {
      this.gridStateButton = this.renderer.createElement('button');
      this.renderer.addClass(this.gridStateButton, 'btn');
      this.renderer.addClass(this.gridStateButton, 'btn-sm');
      this.renderer.addClass(this.gridStateButton, 'btn-default');
      this.renderer.setProperty(this.gridStateButton, 'innerText', this.label + 's');
    }

    this.renderer.setStyle(this.gridStateButton, 'margin-right', '8px');
  
    // Add ARIA attributes for accessibility
    this.renderer.setAttribute(this.gridStateButton, 'role', 'button');
    this.renderer.setAttribute(this.gridStateButton, 'aria-haspopup', 'menu');
    this.renderer.setAttribute(this.gridStateButton, 'aria-expanded', 'false');
    this.renderer.setAttribute(this.gridStateButton, 'aria-label', 'Manage ' + this.label + 's');

    this.renderer.listen(this.gridStateButton, 'click', () => {
      const isExpanded = this.gridStateButton.getAttribute('aria-expanded') === 'true';
      this.gridStateButton.setAttribute('aria-expanded', (!isExpanded).toString());
      this.openMenu();
    });

    setTimeout(() => {
      this.renderer.appendChild(pluginBar.nativeElement, this.gridStateButton);
      this.gridApi.resize();
    }, 0);
  }

  onDestroy(): void {
    this.gridStateButton?.remove();
    this.closeMenu();
  }

  private openMenu(): void {
    if (this.menuElement) {
      this.closeMenu();
      return;
    }

    const menu = this.renderer.createElement('div');
    this.renderer.addClass(menu, 'cw-dropdown-menu');
    this.renderer.setAttribute(menu, 'role', 'menu');
    this.renderer.setAttribute(menu, 'aria-label', 'Grid ' + this.label + ' options');

    const saveOption = this.renderer.createElement('button');
    this.renderer.setProperty(saveOption, 'innerText', `Save Current ${this.label}`);
    this.renderer.setAttribute(saveOption, 'role', 'menuitem');
    this.renderer.setAttribute(saveOption, 'aria-label', `Save current ${this.label}`);
    this.renderer.setStyle(saveOption, 'fontSize', '14px');
    this.renderer.listen(saveOption, 'click', () => {
      this.saveCurrentState();
      this.closeMenu();
    });
    this.renderer.appendChild(menu, saveOption);

    if (this.states.length > 0) {
      // Add a divider between the save button and the list of states
      const divider = this.renderer.createElement('div');
      this.renderer.setStyle(divider, 'borderTop', '1px solid #e0e0e0');
      this.renderer.setStyle(divider, 'margin', '8px 0');
      this.renderer.appendChild(menu, divider);

      const statesList = this.renderer.createElement('ul');
      this.renderer.setAttribute(statesList, 'role', 'menu');
      this.renderer.setStyle(statesList, 'fontSize', '14px');
      this.states.forEach((state, index) => {
        const listItem = this.renderer.createElement('li');
        this.renderer.setStyle(listItem, 'display', 'flex');
        this.renderer.setStyle(listItem, 'alignItems', 'center');
        this.renderer.setStyle(listItem, 'justifyContent', 'space-between');
        this.renderer.setStyle(listItem, 'padding', '0 8px');
        this.renderer.setStyle(listItem, 'cursor', 'pointer');
        this.renderer.listen(listItem, 'click', () => {
          this.applyState(state.state);
          this.closeMenu();
        });

        // State name (click to apply)
        const nameSpan = this.renderer.createElement('span');
        this.renderer.setProperty(nameSpan, 'innerText', state.name);
        this.renderer.setAttribute(nameSpan, 'role', 'menuitem');
        this.renderer.setAttribute(nameSpan, 'aria-label', `Apply ${this.label}: ${state.name}`);
        this.renderer.appendChild(listItem, nameSpan);

        // Delete "X" button
        const deleteButton = this.renderer.createElement('button');
        this.renderer.setProperty(deleteButton, 'innerText', '✕');
        this.renderer.setAttribute(deleteButton, 'aria-label', `Delete ${this.label}: ${state.name}`);
        this.renderer.setStyle(deleteButton, 'background', 'none');
        this.renderer.setStyle(deleteButton, 'border', 'none');
        this.renderer.setStyle(deleteButton, 'fontWeight', 'bold');
        this.renderer.setStyle(deleteButton, 'cursor', 'pointer');
        this.renderer.setStyle(deleteButton, 'textAlign', 'right');
        this.renderer.setStyle(deleteButton, 'width', '30px');
        this.renderer.listen(deleteButton, 'click', (event: MouseEvent) => {
          event.stopPropagation();
          this.deleteState(index);
          this.closeMenu();
        });
        this.renderer.appendChild(listItem, deleteButton);

        this.renderer.appendChild(statesList, listItem);
      });
      this.renderer.appendChild(menu, statesList);
    }

    this.renderer.appendChild(document.body, menu);

    const buttonRect = this.gridStateButton.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;

    this.renderer.setStyle(menu, 'top', `${buttonRect.bottom}px`);
    this.renderer.setStyle(menu, 'left', `${buttonRect.right - menuWidth}px`);

    this.menuElement = menu;

    this.closeMenuHandler = (event: MouseEvent) => {
      if (
        this.menuElement &&
        !this.menuElement.contains(event.target as Node) &&
        event.target !== this.gridStateButton
      ) {
        this.gridStateButton.setAttribute('aria-expanded', 'false');
        this.closeMenu();
      }
    };
    setTimeout(() => document.addEventListener('click', this.closeMenuHandler), 0);
  }

  private closeMenu(): void {
    if (this.menuElement) {
      this.renderer.removeChild(document.body, this.menuElement);
      this.menuElement = null;
      document.removeEventListener('click', this.closeMenuHandler);
    }
  }

  private saveCurrentState(): void {
    const state = {
      // Save all properties of ColumnDef to preserve order and state
      columnDefs: this.gridApi.getColumnDefs().map((col: ColumnDef) => ({ ...col })),
      // Save the full SortState objects
      sortState: this.gridApi.getSortState().map((sort: SortState) => ({ ...sort })),
      // Save groupBy columns as full objects
      groupBy: this.gridApi.getGroupByColumns().filter((col): col is ColumnDef => !!col).map(col => ({ ...col })),
    };
  
    const stateName = prompt('Enter a name for this state:');
    if (stateName) {
      this.states.push({ name: stateName, state });

      this.pluginOptions?.['GridState']?.onSaveState?.(state);
    }
    this.closeMenu();
  }

  private applyState(state: any): void {
    // Get the current column defs from the API
    const currentColumnDefs = this.gridApi.getColumnDefs();

    // Helper to update columns recursively and preserve references
    function updateColumns(savedCols: ColumnDef[], currentCols: ColumnDef[]): ColumnDef[] {
      const updated: ColumnDef[] = [];
      savedCols.forEach(savedCol => {
        const currentCol = currentCols.find(col => col.field === savedCol.field);
        if (currentCol) {
          Object.assign(currentCol, savedCol);
          // If there are children, update recursively
          if (savedCol.children && currentCol.children) {
            currentCol.children = updateColumns(savedCol.children, currentCol.children);
          }
          updated.push(currentCol);
        }
      });
      // Optionally, add any columns that exist in the current defs but not in the saved state (e.g., new columns)
      currentCols.forEach(col => {
        if (!updated.includes(col)) {
          updated.push(col);
        }
      });
      return updated;
    }

    // Build the updated column defs, preserving references and handling nested children
    const updatedColumnDefs = updateColumns(state.columnDefs, currentColumnDefs);

    // Set the column definitions in the new order, but with original references
    this.gridApi.setColumnDefs(updatedColumnDefs);

    // Apply sorting state (only for columns that still exist)
    const flatten = (cols: ColumnDef[]): ColumnDef[] =>
      cols.reduce((arr, col) => arr.concat(col, col.children ? flatten(col.children) : []), [] as ColumnDef[]);
    const allUpdatedCols = flatten(updatedColumnDefs);

    const validSortState = state.sortState.filter((sort: SortState) =>
      allUpdatedCols.some((col: ColumnDef) => col.field === sort.column.field)
    );
    if (validSortState.length > 0) {
      this.gridApi.applySorting(validSortState);
    }

    // Apply group-by state
    const currentGroupBy = this.gridApi.getGroupByColumns().filter((col): col is ColumnDef => !!col);

    // Remove columns that are no longer grouped
    currentGroupBy.forEach((groupByColumn: ColumnDef) => {
      if (!state.groupBy.some((col: ColumnDef) => col.field === groupByColumn.field)) {
        this.gridApi.removeGroupByColumn(groupByColumn);
      }
    });

    // Add new group-by columns
    state.groupBy.forEach((groupByColumn: ColumnDef) => {
      if (
        allUpdatedCols.some((col: ColumnDef) => col.field === groupByColumn.field) &&
        !currentGroupBy.some((col: ColumnDef) => col.field === groupByColumn.field)
      ) {
        this.gridApi.addGroupByColumn(groupByColumn);
      }
    });

    this.gridApi.refresh();
  }

  private deleteState(index: number): void {
    const deleted = this.states.splice(index, 1)[0];
    if (this.menuElement) {
      const statesList = this.menuElement.querySelector('ul');
      if (statesList) {
        const listItem = statesList.children[index];
        if (listItem) {
          this.renderer.removeChild(statesList, listItem);
        }
      }
    }

    // Call plugin option callback if provided
    const pluginOptions = this.gridApi.getPluginOptions();
    if (pluginOptions?.['GridState']?.onDeleteState) {
      pluginOptions['GridState'].onDeleteState(deleted);
    }
  }
}