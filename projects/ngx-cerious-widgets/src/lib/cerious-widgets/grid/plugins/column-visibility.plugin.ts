import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { GridPlugin } from '../interfaces/grid-plugin';
import { GridApi } from '../interfaces/grid-api';
import { ColumnDef } from '../interfaces/column-def';
import { TemplateRegistryService } from '../../shared/services/template-registry.service';

@Injectable()
export class ColumnVisibilityPlugin implements GridPlugin {
  private visibilityButton!: HTMLButtonElement;
  private gridApi!: GridApi;
  private renderer: Renderer2;
  private menuElement: HTMLElement | null = null;

  constructor(
    private templateRegistry: TemplateRegistryService,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Initializes the Column Visibility plugin by setting up the visibility button
   * and appending it to the grid menu bar if the plugin options allow it.
   *
   * @param api - The GridApi instance used to interact with the grid.
   *
   * The method performs the following steps:
   * 1. Checks if the `enableColumnVisibility` option is enabled in the plugin options.
   *    If not, the method exits early.
   * 2. Attempts to retrieve a registered template for the column visibility button.
   *    - If a template is found, it uses the template to create the button.
   *    - If no template is found, it falls back to creating a default button.
   * 3. Styles the button and adds a click event listener to open the column visibility menu.
   * 4. Appends the button to the grid menu bar and triggers a grid resize.
   */
  onInit(api: GridApi): void {
    this.gridApi = api;

    // Check if the pluginOptions include `enableColumnVisibility`
    const pluginOptions = this.gridApi.getPluginOptions();
    if (!pluginOptions?.['ColumnVisibility']?.enableColumnVisibility) {
      return; // Do not add the button if `enableColumnVisibility` is not enabled
    }

    const pluginBar = this.gridApi.getPluginBar();
    if (!pluginBar) {
      console.warn('Grid plugin bar not found. Column visibility button will not be added.');
      return; // Exit if the plugin bar is not found
    }

    // Check if a template is registered
    const buttonTemplate = this.templateRegistry.getTemplate('columnVisibilityButton');

    if (buttonTemplate) {
      // Use the template to create the button
      const container = this.renderer.createElement('div');
      const line = this.renderer.createElement('div');
      const embeddedView = buttonTemplate.createEmbeddedView({});
      embeddedView.detectChanges(); // Ensure bindings are applied
      embeddedView.rootNodes.forEach((node: any) => this.renderer.appendChild(container, node));
      this.visibilityButton = container.firstChild as HTMLButtonElement;
    } else {
      // Fall back to a default button
      this.visibilityButton = this.renderer.createElement('div');
      const innerTag = this.renderer.createElement('div');
      this.renderer.appendChild(this.visibilityButton, innerTag);
      this.renderer.addClass(innerTag, 'line'); // Add a class for styling
      this.renderer.setProperty(this.visibilityButton, 'title', 'Column Visibility');
      this.renderer.addClass(this.visibilityButton, 'vertical-hamburger-button'); // Add a class for styling
    }

    // Set styles for the button
    this.renderer.setStyle(this.visibilityButton, 'margin-right', '8px');
    this.renderer.setStyle(this.visibilityButton, 'padding', '0px');

    // Add click event listener to open the menu
    this.renderer.listen(this.visibilityButton, 'click', () => this.openMenu());

    // Append the button to the grid menu bar
    setTimeout(() => {
      this.renderer.appendChild(pluginBar.nativeElement, this.visibilityButton);
      this.gridApi.resize();
    });

    // Add event listeners for resize and scroll

    this.gridApi.afterResize(() => {
      if (this.menuElement) {
        const buttonRect = this.visibilityButton.getBoundingClientRect();
        const menuWidth = this.menuElement.offsetWidth;
        this.renderer.setStyle(this.menuElement, 'top', `${buttonRect.bottom + 4}px`);
        this.renderer.setStyle(this.menuElement, 'left', `${buttonRect.right - menuWidth}px`);
      }
    });

    this.gridApi.afterScroll(() => {
      this.closeMenuHandler();
    }); 
  }

  onDestroy(): void {
    this.visibilityButton?.remove();
    this.closeMenu();
  }

  /**
   * Closes the menu by removing it from the DOM and clearing its reference.
   * Also removes the event listener for menu closure to prevent memory leaks.
   *
   * @private
   */
   private closeMenu(): void {
    if (this.menuElement) {
      this.renderer.removeChild(document.body, this.menuElement);
      this.menuElement = null; // Clear the reference
      document.removeEventListener('click', this.closeMenuHandler);
    }
  }

  /**
   * Handles the closing of the menu when a click event occurs outside the menu element
   * and the visibility button. This ensures that the menu is closed when the user
   * interacts with other parts of the UI.
   *
   * @param event - The mouse event triggered by the user's interaction.
   */
  private closeMenuHandler = (event?: Event): void => {
    if (!event) {
      this.closeMenu(); // Close the menu if no event is provided
      return;
    }
    
    if (
      this.menuElement &&
      !this.menuElement.contains(event.target as Node) &&
      event.target !== this.visibilityButton
    ) {
      this.closeMenu();
    }
  };

  /**
   * Opens the menu for managing column visibility.
   */
  /**
   * Opens a dropdown menu for managing column visibility in the grid.
   * 
   * - If a menu is already open, it will close the existing menu and return.
   * - Creates a dropdown menu containing a list of column definitions with checkboxes.
   * - Each checkbox allows toggling the visibility of a corresponding column.
   * - The menu is dynamically positioned relative to the visibility button.
   * - Adds a global click listener to close the menu when clicking outside of it.
   * 
   * @private
   */
  private openMenu(): void {
    // Check if the menu already exists
    if (this.menuElement) {
      this.closeMenu(); // Close the existing menu
      return;
    }
  
    // Create the dropdown menu
    const menu = this.renderer.createElement('div');
    this.renderer.addClass(menu, 'cw-dropdown-menu');
    this.renderer.setAttribute(menu, 'role', 'menu');
    this.renderer.setAttribute(menu, 'aria-label', 'Column Visibility Options');
  
    // Add a list of column definitions with checkboxes
    const columnList = this.renderer.createElement('ul');
    this.renderer.setAttribute(columnList, 'role', 'menu');
    const columnDefs = this.gridApi.getFlattenedColumnDefs();
    columnDefs.forEach((column: ColumnDef) => {
      const listItem = this.renderer.createElement('li');
      this.renderer.setAttribute(listItem, 'role', 'menuitemcheckbox');
      this.renderer.setAttribute(listItem, 'aria-checked', column.visible !== false ? 'true' : 'false');
  
      // Create a label to wrap the checkbox and text
      const label = this.renderer.createElement('label');
      this.renderer.setStyle(label, 'display', 'flex');
      this.renderer.setStyle(label, 'align-items', 'center');
      this.renderer.setStyle(label, 'cursor', 'pointer');
      this.renderer.setStyle(label, 'width', '100%');
  
      // Create a checkbox for the column
      const checkbox = this.renderer.createElement('input');
      this.renderer.setAttribute(checkbox, 'type', 'checkbox');
      this.renderer.setProperty(checkbox, 'checked', column.visible !== false);
      this.renderer.setStyle(checkbox, 'margin-right', '6px');
      this.renderer.listen(checkbox, 'change', () => {
        this.toggleColumnVisibility(column);
        this.renderer.setAttribute(listItem, 'aria-checked', column.visible !== false ? 'true' : 'false');
      });
  
      // Add the checkbox and label text to the label
      const labelText = this.renderer.createText(` ${column.label}`);
      this.renderer.appendChild(label, checkbox);
      this.renderer.appendChild(label, labelText);
  
      // Append the label to the list item
      this.renderer.appendChild(listItem, label);
  
      // Append the list item to the column list
      this.renderer.appendChild(columnList, listItem);
    });
    this.renderer.appendChild(menu, columnList);
  
    // Append the menu to the body
    this.renderer.appendChild(document.body, menu);
  
    // Position the menu
    const buttonRect = this.visibilityButton.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;
    this.renderer.setStyle(menu, 'top', `${buttonRect.bottom + 4}px`);
    this.renderer.setStyle(menu, 'left', `${buttonRect.right - menuWidth}px`);
  
    // Store the menu reference
    this.menuElement = menu;
  
    // Add a global click listener to close the menu
    document.addEventListener('click', this.closeMenuHandler);
  }

  /**
   * Toggles the visibility of a specified column in the grid.
   * 
   * If the column is currently hidden (`visible` is `false`), this method will make it visible.
   * If the column is currently visible, this method will hide it.
   * 
   * @param column - The column definition object containing the column's visibility state and identifier.
   */
  private toggleColumnVisibility(column: ColumnDef): void {
    if (column.visible === false) {
      this.gridApi.showColumn(column.id);
    } else {
      this.gridApi.hideColumn(column.id);
    }
    this.gridApi.resize(); // Resize the grid after toggling visibility
  }
}
