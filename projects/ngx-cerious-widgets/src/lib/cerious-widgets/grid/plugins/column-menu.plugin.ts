import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { filter } from 'rxjs/operators';
import { GridPlugin } from '../interfaces/grid-plugin';
import { GridApi } from '../interfaces/grid-api';
import { ColumnDef } from '../interfaces/column-def';
import { MenuOption } from '../models/menu-option';
import { PluginOptions } from '../interfaces';
import { PluginConfig } from '../../shared/interfaces/plugin-config.interface';
import { CwMenuItem, MenuComponent } from '../../components/menu/menu.component';

@Injectable()
export class ColumnMenuPlugin implements GridPlugin {
  private gridApi!: GridApi;
  private renderer: Renderer2;
  /** The overlay hosting the shared `cw-menu`, and the header button that opened it. */
  private overlayRef: OverlayRef | null = null;
  private activeButton: HTMLElement | null = null;
  private pluginOptions: PluginOptions | PluginConfig = {};

  constructor(private rendererFactory: RendererFactory2, private overlay: Overlay) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Initializes the plugin with the provided Grid API instance.
   * 
   * This method sets up the necessary configurations and event listeners for the column menu plugin.
   * It checks if the `enableColumnMenu` option is enabled in the plugin options before proceeding.
   * If enabled, it initializes the column menus and sets up listeners for column reorder and render events
   * to ensure the menus are updated accordingly.
   * 
   * @param api - The Grid API instance used to interact with the grid.
   * @param config - Optional configuration object for the plugin.
   */
  onInit(api: GridApi, config?: PluginOptions): void {
    this.gridApi = api;
    
    const pluginOptions = this.gridApi.getPluginOptions();
    this.pluginOptions = config ?? pluginOptions['ColumnMenu'] ?? {};

    // Check if the pluginOptions include `enableColumnMenu`
    if (!this.pluginOptions['enableColumnMenu']) {
      return; // Do not add the buttons if `enableColumnMenu` is not enabled
    }

    const gridOptions = this.gridApi.getGridOptions();
    if (this.pluginOptions['enableGroupBy']) {
     gridOptions.enableGroupBy = true; // Ensure column group by is enabled in grid options
    }
    if (this.pluginOptions['enablePinning']) {
      gridOptions.enablePinning = true; // Ensure column pinning is enabled in grid options
    }
  
    // Initialize the column menus
    this.initializeColumnMenus();
  
    // Listen for column reorder events
    this.gridApi.afterColumnReorder(() => {
      this.initializeColumnMenus(); // Reinitialize menus after column reorder
    });

    this.gridApi.onColumnVisibilityChange(() => {
      this.initializeColumnMenus(); // Reinitialize menus after column visibility change
    });

    this.gridApi.afterRender(() => {
      this.initializeColumnMenus(); // Reinitialize the column menus after rendering
    });

    this.gridApi.afterGroupBy(() => {
      this.initializeColumnMenus(); // Reinitialize the column menus after grouping
    });

    // Add event listeners for resize and scroll
    this.gridApi.afterResize(() => {
      this.closeMenu();
    });

    this.gridApi.afterScroll(() => {
      this.closeMenu();
    });
  }

  /**
   * Cleans up resources when the plugin is destroyed by disposing the overlay
   * (the per-column header buttons are removed with their headers).
   */
  onDestroy(): void {
    this.closeMenu();
  }


  /**
   * Closes the column menu by removing it from the DOM and clearing its reference.
   * 
   * This method checks if the `menuElement` exists, and if so, removes it from the
   * document body using the renderer. After removal, the `menuElement` reference
   * is set to `null` to ensure proper cleanup.
   * 
   * @private
   */
  private closeMenu(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.activeButton?.classList.remove('active');
    this.activeButton = null;
  }

  /**
   * Toggles the grouping state of a column in the grid.
   * 
   * If the specified column is already a group-by column, this method removes it from the group
   * and updates the menu option label to "Group By". Otherwise, it adds the column to the group
   * and updates the menu option label to "Ungroup".
   * 
   * @param option - The menu option associated with the column, used to update the label.
   * @param column - The column definition object representing the column to be grouped or ungrouped.
   */
  private groupBy(option: MenuOption, column: ColumnDef): void {
    if (this.gridApi.getGroupByColumns().includes(column)) {
      // If the column is already a group by column, remove it from the group
      this.gridApi.removeGroupByColumn(column);
      option.label = 'Group By'; // Update the label
    } else {
      // If the column is not a group by column, add it to the group
      this.gridApi.addGroupByColumn(column);
      option.label = 'Ungroup'; // Update the label
    }
  }
  
  /**
   * Opens a dropdown menu for a specific column and attaches it to the DOM.
   * 
   * @param column - The column definition for which the menu is being opened.
   * @param menuButton - The HTML button element that triggers the menu.
   * @param options - An array of menu options, each containing a label and a callback function.
   * 
   * The menu is dynamically created and positioned relative to the `menuButton`.
   * Each menu option is rendered as a list item with a click listener that triggers
   * the associated callback and closes the menu.
   * 
   * The menu is automatically closed when clicking outside of it or on a menu option.
   * A global click listener is added to handle this behavior.
   */
  private openMenu(column: ColumnDef, menuButton: HTMLElement, options: MenuOption[]): void {
    // Close any open menu first.
    this.closeMenu();

    // Reuse the shared `cw-menu` (the same popover the library's menus use),
    // hosted in a CDK overlay anchored to the header button. The grid's
    // MenuOption callbacks become the menu items' `command`s.
    const items: CwMenuItem[] = options.map(option => ({
      label: option.label,
      command: () => option.callback(option, column)
    }));

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(menuButton)
        .withPush(false)
        .withPositions([
          { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
          { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 }
        ]),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: 'cw-overlay-panel'
    });
    this.activeButton = menuButton;

    const ref = this.overlayRef.attach(new ComponentPortal(MenuComponent));
    ref.setInput('items', items);
    ref.instance.itemClick.subscribe(() => this.closeMenu());
    ref.changeDetectorRef.detectChanges();

    // Close on an outside click (but not on the button that toggles it) or Escape.
    this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => !menuButton.contains(event.target as Node)))
      .subscribe(() => this.closeMenu());
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.closeMenu();
      }
    });
  }

  /**
   * Initializes column menus for the grid by dynamically creating menu buttons
   * for each column header. Each menu button provides options such as pinning
   * and grouping, depending on the grid's configuration.
   *
   * - Skips columns without a `field` property.
   * - Skips creating a menu button if one already exists for a column.
   *
   * Menu options:
   * - **Pin**: Allows toggling the pinning state of the column (if `enablePinning` is enabled in grid options).
   * - **Group By**: Allows grouping by the column (if `enableGroupBy` is enabled in grid options).
   *
   * The menu button is styled and appended to the column header. Clicking the button
   * opens the menu with the defined options and toggles an active class for styling.
   *
   * @private
   */
  private initializeColumnMenus(): void {
    // Get the column definitions
    const columnDefs = this.gridApi.getColumnDefs();
    const flattenedDefs = this.gridApi.getFlattenedColumnDefs();

    // Create a new array
    const columns = [...columnDefs, ...flattenedDefs.filter((col) => !columnDefs.includes(col))];

    // Create a menu button for each column
    columns.forEach((column) => {
      if (!column.id) {
        return; // Skip columns without an ID
      }

      // Get the column header by ID
      const columnHeader = this.gridApi.getColumnHeader(column.id);
      if (!columnHeader) {
        return; // Skip if the column header is not found
      }

      // Check if a menu button already exists
      const children = this.renderer.selectRootElement(columnHeader.nativeElement, true).children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.classList.contains('column-menu-button')) {
          // Remove the existing button
          this.renderer.removeChild(columnHeader.nativeElement, child);
          break;
        }
      }

      // Create the menu button
      const menuButton = this.renderer.createElement('div');
      const innerTag = this.renderer.createElement('div');
      this.renderer.appendChild(menuButton, innerTag);
      this.renderer.addClass(innerTag, 'line');
      this.renderer.addClass(menuButton, 'hamburger-button');
      this.renderer.addClass(menuButton, 'column-menu-button');
      this.renderer.setStyle(menuButton, 'margin', '0px 6px');
      this.renderer.setStyle(menuButton, 'padding', '0px');
      this.renderer.setStyle(menuButton, 'cursor', 'pointer');

      // Define the menu options
      const columnMenuOptions: MenuOption[] = [];

      // Add option to toggle column pinning if the column does not have a parent
      if (!column.parent && this.gridApi.getGridOptions().enablePinning && column.pinnable !== false) {
        columnMenuOptions.push(
          new MenuOption({
            label: column.pinned ? 'Un-Pin' : 'Pin',
            callback: (option: MenuOption, column: ColumnDef) => this.toggleColumnPin(option, column),
          })
        );
      }

      // Add option to toggle column group by if the column is not a parent
      if (!column.children?.length && this.gridApi.getGridOptions().enableGroupBy && column.groupable !== false) {
        columnMenuOptions.push(
          new MenuOption({
            label: column.groupBy ? 'Ungroup' : 'Group By',
            callback: (option: MenuOption, column: ColumnDef) => this.groupBy(option, column),
          })
        );
      }

      // Add click event listener to open or close the menu for this column
      this.renderer.listen(menuButton, 'click', (event: MouseEvent) => {
        event.stopPropagation(); // Prevent event bubbling

        if (menuButton.classList.contains('active')) {
          // If the menu is already open, close it
          this.closeMenu();
          menuButton.classList.remove('active'); // Remove active class for styling
        } else {
          // If the menu is not open, open it
          this.openMenu(column, menuButton, columnMenuOptions);
          menuButton.classList.add('active'); // Add active class for styling
        }
      });

      // Append the button to the column header
      this.renderer.appendChild(columnHeader.nativeElement, menuButton);
    });
  }

  /**
   * Toggles the pinned state of a column and its child columns, updates the menu item label,
   * and re-renders the grid to reflect the changes.
   *
   * @param option - The menu option associated with the column pin action. Its label will be updated
   *                 to reflect the new pinned state ("Pin" or "Un-Pin").
   * @param column - The column definition object whose pinned state is being toggled. If the column
   *                 has child columns, their pinned states will also be updated recursively.
   *
   * @remarks
   * This method updates the `pinned` property of the column and its children, modifies the menu
   * option label, and triggers grid re-rendering by calling `this.gridApi.updateToggledPinnedCols()`.
   */
  private toggleColumnPin(option: MenuOption, column: ColumnDef): void {
    const togglePin = (column: ColumnDef, pinned: boolean) => {
      column.pinned = pinned;
      if (column.children && column.children.length > 0) {
        // Recursively pin/unpin all child columns
        column.children.forEach((child) => togglePin(child, pinned));
      }
    };

    const newPinnedState = !column.pinned;
    togglePin(column, newPinnedState);

    // Update the menu item name
    option.label = newPinnedState ? 'Un-Pin' : 'Pin';

    this.updateColumnOrder();

    // Close the menu and re-render the grid
    this.gridApi.updateToggledPinnedCols();

    this.gridApi.resetScrollPosition();
  }

  /**
   * Updates the order of columns in the grid by separating pinned and unpinned columns.
   * Pinned columns are placed before unpinned columns in the updated column definitions.
   * 
   * This method retrieves the current column definitions from the grid API, filters them
   * into pinned and unpinned groups, and then updates the grid's column definitions
   * to reflect the new order.
   * 
   * @private
   */
  private updateColumnOrder(): void {
    const columnDefs = this.gridApi.getColumnDefs();
  
    // Separate pinned and unpinned columns
    const pinnedColumns = columnDefs.filter(col => col.pinned);
    const unpinnedColumns = columnDefs.filter(col => !col.pinned);
  
    // Update the grid's column definitions
    this.gridApi.setColumnDefs([...pinnedColumns, ...unpinnedColumns]);
  }
}
