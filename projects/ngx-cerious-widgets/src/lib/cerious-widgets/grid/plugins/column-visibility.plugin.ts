import { ApplicationRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { filter } from 'rxjs/operators';
import { GridPlugin } from '../interfaces/grid-plugin';
import { GridApi } from '../interfaces/grid-api';
import { ColumnDef } from '../interfaces/column-def';
import { TemplateRegistryService } from '../../shared/services/template-registry.service';
import { PluginOptions } from '../interfaces';
import { PluginConfig } from '../../shared/interfaces/plugin-config.interface';

@Injectable()
export class ColumnVisibilityPlugin implements GridPlugin {
  private visibilityButton!: HTMLButtonElement;
  private gridApi!: GridApi;
  private renderer: Renderer2;
  /** The CDK overlay hosting the column-visibility panel (same popover surface as the library menus). */
  private overlayRef: OverlayRef | null = null;
  /** The panel content moved into the overlay via a DomPortal (removed on close). */
  private visibilityMenu: HTMLElement | null = null;
  private pluginOptions: PluginOptions | PluginConfig = {};

  constructor(
    private templateRegistry: TemplateRegistryService,
    private rendererFactory: RendererFactory2,
    private overlay: Overlay,
    private appRef: ApplicationRef
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Initializes the Column Visibility plugin by setting up the visibility button
   * and appending it to the grid menu bar if the plugin options allow it.
   *
   * @param api - The GridApi instance used to interact with the grid.
   * @param config - Optional configuration object for the plugin.
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
  onInit(api: GridApi, config?: PluginOptions): void {
    this.gridApi = api;

    const pluginOptions = this.gridApi.getPluginOptions();
    this.pluginOptions = config ?? pluginOptions['ColumnVisibility'] ?? {};

    // Check if the pluginOptions include `enableColumnVisibility`
    if (!this.pluginOptions['enableColumnVisibility']) {
      return; // Do not add the button if `enableColumnVisibility` is not enabled
    }

    const gridOptions = this.gridApi.getGridOptions();
    gridOptions.enableColumnVisibility = true; // Enable column visibility in grid options

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

    // Close the panel on scroll (the CDK reposition strategy handles resize).
    this.gridApi.afterScroll(() => this.closeMenu());
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
    this.overlayRef?.dispose();
    this.overlayRef = null;
    // DomPortal restores the content to its original parent on dispose; remove it.
    this.visibilityMenu?.remove();
    this.visibilityMenu = null;
  }

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
    // Toggle: if already open, close.
    if (this.overlayRef) {
      this.closeMenu();
      return;
    }

    // Build the panel content (a checkbox per column).
    const menu = this.renderer.createElement('div');
    this.renderer.addClass(menu, 'cw-grid-column-list');
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

    // DomPortal moves an existing node into the overlay, so the content must have
    // a parent first.
    this.renderer.appendChild(document.body, menu);
    this.visibilityMenu = menu;

    // Host the panel in a CDK overlay with the shared `cw-overlay-panel` surface,
    // anchored to the button — the same popover the library's menus use.
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.visibilityButton)
        .withPush(false)
        .withPositions([
          { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
          { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 }
        ]),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: 'cw-overlay-panel'
    });
    this.overlayRef.attach(new DomPortal(menu));

    this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => !this.visibilityButton.contains(event.target as Node)))
      .subscribe(() => this.closeMenu());
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.closeMenu();
      }
    });
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
    // `refresh()` re-renders the header + body for the new column set (resize
    // alone only re-measures). The checkbox uses a native `change` listener that
    // the zoneless scheduler can't see, so tick() to flush the render now instead
    // of only on the next scroll/click.
    this.gridApi.refresh();
    this.gridApi.resize();
    this.appRef.tick();
  }
}
