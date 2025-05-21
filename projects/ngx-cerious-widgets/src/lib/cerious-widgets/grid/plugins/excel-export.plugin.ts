import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { GridPlugin } from '../interfaces/grid-plugin';
import { GridApi } from '../interfaces/grid-api';
import { ColumnDef } from '../interfaces/column-def';
import { TemplateRegistryService } from '../../shared/services/template-registry.service';
import { PluginOptions } from '../interfaces';
import { PluginConfig } from '../../shared/interfaces/plugin-config.interface';

@Injectable()
export class ExportToExcelPlugin implements GridPlugin {
  private exportButton!: HTMLButtonElement;
  private gridApi!: GridApi;
  private renderer: Renderer2;
  private pluginOptions: PluginOptions | PluginConfig = {};

  constructor(
    private templateRegistry: TemplateRegistryService,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Initializes the Excel export plugin by setting up the export button and its functionality.
   * 
   * @param api - The Grid API instance used to interact with the grid and retrieve data or configurations.
   * @param config - Optional configuration object for the plugin.
   * 
   * This method performs the following steps:
   * 1. Checks if the `enableExportToExcel` option is enabled in the plugin options.
   * 2. Attempts to retrieve a registered button template from the template registry. If unavailable, falls back to a default button.
   * 3. Styles the button and attaches a click event listener to handle the export logic.
   * 4. On button click, retrieves and optionally modifies the grid data, flattens grouped columns, and generates an Excel file.
   * 5. Appends the button to the grid's plugin bar and triggers a grid resize.
   * 
   * The export logic includes:
   * - Cloning the grid data to avoid mutating the original.
   * - Flattening grouped columns for a structured export.
   * - Creating grouped headers and mapping data to match the column structure.
   * - Using the `XLSX` library to generate and export the Excel file.
   */
  onInit(api: GridApi, config?: PluginOptions): void {
    this.gridApi = api;

    const pluginOptions = this.gridApi.getPluginOptions();
    this.pluginOptions = config ?? pluginOptions['ExportToExcel'] ?? {};

    // Check if the pluginOptions include `enableExportToExcel`
    if (!this.pluginOptions['enableExportToExcel']) {
      return; // Do not add the button if `enableExportToExcel` is not enabled
    }

    const pluginBar = this.gridApi.getPluginBar();
    if (!pluginBar) {
      console.warn('Grid plugin bar not found. Export to Excel button will not be added.');
      return; // Exit if the plugin bar is not found
    }
  
    // Check if a template is registered
    const buttonTemplate = this.templateRegistry.getTemplate('exportButton');
  
    if (buttonTemplate) {
      // Use the template to create the button
      const container = this.renderer.createElement('div');
      const embeddedView = buttonTemplate.createEmbeddedView({});
      embeddedView.detectChanges(); // Ensure bindings are applied
      embeddedView.rootNodes.forEach((node: any) => this.renderer.appendChild(container, node));
      this.exportButton = container.firstChild as HTMLButtonElement;
    } else {
      // Fall back to a default button
      this.exportButton = this.renderer.createElement('button');
      this.renderer.setProperty(this.exportButton, 'innerText', 'Export to Excel');
      this.renderer.addClass(this.exportButton, 'btn');
      this.renderer.addClass(this.exportButton, 'btn-sm');
      this.renderer.addClass(this.exportButton, 'btn-default');
    }
  
    // Set styles for the button
    this.renderer.setStyle(this.exportButton, 'margin-right', '8px');
    // this.renderer.setStyle(this.exportButton, 'padding', '0px');
  
    // Add ARIA attributes for accessibility
    this.renderer.setAttribute(this.exportButton, 'role', 'button');
    this.renderer.setAttribute(this.exportButton, 'aria-label', 'Export grid data to Excel');
  
    // Add the click event listener
    this.renderer.listen(this.exportButton, 'click', () => {
      this.exportGridDataToExcel();
    });
  
    // Append to menu bar
    setTimeout(() => {
      this.renderer.appendChild(pluginBar.nativeElement, this.exportButton);
      this.gridApi.resize();
    }, 0);
  }

  /**
   * Cleans up resources when the plugin is destroyed.
   * Specifically, it removes the export button from the DOM if it exists.
   */
  onDestroy(): void {
    this.exportButton?.remove();
  }

  /**
   * Flattens grouped columns into a single array while preserving their hierarchy.
   * @param columns The grouped column definitions.
   * @returns A flat array of column definitions.
   */
  private flattenColumns(columns: ColumnDef[]): ColumnDef[] {
    const result: ColumnDef[] = [];
    for (const column of columns) {
      if (column.children?.length) {
        result.push(...this.flattenColumns(column.children));
      } else {
        result.push(column);
      }
    }
    return result;
  }

  /**
   * Creates grouped headers for the Excel sheet based on the column hierarchy.
   * Ensures all leaf columns are on the same row.
   * @param columns The grouped column definitions.
   * @returns A 2D array representing the grouped headers.
   */
  private createGroupedHeaders(columns: ColumnDef[]): any[][] {
    const headerRows: any[][] = [];
    const maxDepth = this.getMaxDepth(columns);

    // Initialize header rows
    for (let i = 0; i < maxDepth; i++) {
      headerRows[i] = [];
    }

    const processLevel = (cols: ColumnDef[], level: number) => {
      for (const col of cols) {
        const colSpan = this.getColumnSpan(col);

        // Add grouped columns to the current row
        headerRows[level].push(col.label || '');
        for (let i = 1; i < colSpan; i++) {
          headerRows[level].push(null); // Add empty cells for colspan
        }

        if (col.children?.length) {
          processLevel(col.children, level + 1);
        } else {
          // Add leaf columns to all rows above the last row
          for (let i = level + 1; i < maxDepth; i++) {
            headerRows[i].push(col.label || '');
          }
        }
      }
    };

    processLevel(columns, 0);

    // Add only leaf columns to the last row
    const leafColumns = this.flattenColumns(columns);
    headerRows[maxDepth - 1] = leafColumns.map(col => col.label || '');

    // Convert grouped headers to a 2D array with proper colspan handling
    return this.convertToAoa(headerRows);
  }

  /**
   * Converts the header rows with colspan information into a 2D array for Excel.
   * @param headerRows The header rows with colspan information.
   * @returns A 2D array representing the headers for Excel.
   */
  private convertToAoa(headerRows: any[][]): any[][] {
    return headerRows.map(row =>
      row.map(cell => (cell ? cell.label || cell : cell))
    );
  }

  /**
   * Exports the grid data to an Excel file.
   *
   * This method performs the following steps:
   * 1. Retrieves and clones the grid data to avoid mutating the original data.
   * 2. Invokes a user-supplied callback (`onBeforeExportToExcel`) to allow modifications to the data before export.
   * 3. Flattens the grouped column definitions to create a flat structure for export.
   * 4. Maps the data to match the flattened column structure.
   * 5. Creates grouped header rows based on the column definitions.
   * 6. Converts the data and headers into an Excel worksheet.
   * 7. Appends the worksheet to a new workbook.
   * 8. Writes the workbook to a file named `export.xlsx`.
   *
   * The exported Excel file includes:
   * - Grouped headers at the top.
   * - Data rows aligned with the flattened column structure.
   *
   * Note: This method uses the `XLSX` library for Excel file generation.
   */
  private async exportGridDataToExcel(): Promise<void> {
    const XLSX = await import('xlsx');

    const data = this.gridApi.getData().map(data => ({ ...data })); // Clone the data to avoid mutating the original
    const groupedColumns = this.gridApi.getColumnDefs();
  
    // Invoke the user-supplied callback to modify the data
    const modifiedData = (this.pluginOptions['onBeforeExportToExcel']
      ? this.pluginOptions['onBeforeExportToExcel'](data, groupedColumns)
      : data) || data;
  
    // Flatten the grouped columns for export
    const flattenedColumns = this.flattenColumns(groupedColumns);
  
    // Map the data to match the flattened column structure
    const exportData = modifiedData.map((row: any) =>
      flattenedColumns.reduce((acc, col) => {
        if (col.label && col.field) {
          acc[col.label] = row[col.field];
        }
        return acc;
      }, {} as Record<string, any>)
    );
  
    // Create a header row for grouped columns
    const headerRows = this.createGroupedHeaders(groupedColumns);
  
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet([], { skipHeader: true });
  
    // Add the grouped headers to the worksheet
    XLSX.utils.sheet_add_aoa(worksheet, headerRows, { origin: 'A1' });
  
    // Add the data rows below the headers
    XLSX.utils.sheet_add_json(worksheet, exportData, {
      skipHeader: true,
      origin: `A${headerRows.length + 1}`, // Offset data rows below the headers
    });
  
    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
    // Export the workbook
    const fileName = this.pluginOptions['fileName'] || 'export.xlsx';
    XLSX.writeFile(workbook, fileName);
  }

  /**
   * Calculates the column span for a grouped column.
   * @param column The column definition.
   * @returns The number of leaf columns under the grouped column.
   */
  private getColumnSpan(column: ColumnDef): number {
    if (!column.children?.length) {
      return 1;
    }
    return column.children.reduce((span, child) => span + this.getColumnSpan(child), 0);
  }

  /**
   * Calculates the maximum depth of the column hierarchy.
   * @param columns The grouped column definitions.
   * @returns The maximum depth of the column hierarchy.
   */
  private getMaxDepth(columns: ColumnDef[]): number {
    let maxDepth = 0;
    const calculateDepth = (cols: ColumnDef[], depth: number) => {
      maxDepth = Math.max(maxDepth, depth);
      for (const col of cols) {
        if (col.children?.length) {
          calculateDepth(col.children, depth + 1);
        }
      }
    };
    calculateDepth(columns, 1);
    return maxDepth;
  }
}
