import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { GridPlugin } from '../interfaces/grid-plugin';
import { GridApi } from '../interfaces/grid-api';
import { ColumnDef } from '../interfaces/column-def';
import { TemplateRegistryService } from '../../shared/services/template-registry.service';
import { PluginOptions } from '../interfaces';
import { PluginConfig } from '../../shared/interfaces/plugin-config.interface';

export interface ExcelExportOptions {
  fileName?: string;
  sheetName?: string;
  includeHeaders?: boolean;
  batchSize?: number;
  maxChunkSize?: number;
  autoSplitLargeDatasets?: boolean;
  optimizeDataTypes?: boolean; // New: Automatically detect and use optimal data types
  useRequestAnimationFrame?: boolean; // New: Use RAF for smoother UI updates
  onProgress?: (processed: number, total: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

@Injectable()
export class ExportToExcelPlugin implements GridPlugin {
  private exportButton!: HTMLButtonElement;
  private gridApi!: GridApi;
  private renderer: Renderer2;
  private pluginOptions: PluginOptions | PluginConfig = {};
  private isExporting = false;

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
   * - Using the `write-excel-file` library to generate and export the Excel file.
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
      if (!this.isExporting) {
        this.exportGridDataToExcel();
      }
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
   * Exports the grid data to an Excel file using lazy-loaded write-excel-file library.
   *
   * This method performs the following steps:
   * 1. Retrieves the grid data and only clones it if there's a callback that might modify it.
   * 2. Invokes a user-supplied callback (`onBeforeExportToExcel`) to allow modifications to the data before export.
   * 3. Uses chunked processing for large datasets to prevent UI blocking.
   * 4. Flattens the grouped column definitions to create a flat structure for export.
   * 5. Generates and downloads the Excel file using dynamic import.
   *
   * The exported Excel file includes:
   * - Headers based on the column definitions.
   * - Data rows aligned with the flattened column structure.
   */
  private async exportGridDataToExcel(): Promise<void> {
    try {
      this.isExporting = true;
      this.updateButtonState(true);

      const originalData = this.gridApi.getData();
      const groupedColumns = this.gridApi.getColumnDefs();
    
      // Handle data transformation with callback protection
      let exportData = originalData;
      if (this.pluginOptions['onBeforeExportToExcel']) {
        // Clone data only when there's a callback to prevent mutation of original data
        const clonedData = originalData.map(row => ({ ...row }));
        exportData = this.pluginOptions['onBeforeExportToExcel'](clonedData, groupedColumns) || clonedData;
      }
      // If no callback, use original data directly for better performance
    
      // Check if we should use chunked processing for large datasets
      const shouldUseChunked = exportData.length > (this.pluginOptions['batchSize'] ?? 10000);
      
      if (shouldUseChunked) {
        await this.exportWithChunkedProcessing(exportData, groupedColumns);
      } else {
        await this.exportSynchronously(exportData, groupedColumns);
      }
    } catch (error) {
      console.error('Excel export failed:', error);
      const errorCallback = this.pluginOptions['onError'];
      if (errorCallback) {
        errorCallback(error instanceof Error ? error.message : 'Export failed');
      }
    } finally {
      this.isExporting = false;
      this.updateButtonState(false);
    }
  }

  /**
   * Updates the button state during export
   */
  private updateButtonState(isExporting: boolean): void {
    if (this.exportButton) {
      this.renderer.setProperty(
        this.exportButton, 
        'disabled', 
        isExporting
      );
      this.renderer.setProperty(
        this.exportButton, 
        'innerText', 
        isExporting ? 'Exporting...' : 'Export to Excel'
      );
    }
  }

  /**
   * Exports data using main thread with optimized chunked processing for large datasets
   */
  private async exportWithChunkedProcessing(data: any[], groupedColumns: ColumnDef[]): Promise<void> {
    try {
      // Dynamically import write-excel-file to keep the plugin lightweight
      const writeExcelFile = await import('write-excel-file');
      
      const flattenedColumns = this.flattenColumns(groupedColumns);
      
      // For very large datasets, offer to split into multiple files
      const maxChunkSize = this.pluginOptions['maxChunkSize'] || 25000;
      if (data.length > maxChunkSize) {
        const userWantsMultipleFiles = confirm(
          `This dataset has ${data.length.toLocaleString()} rows. ` +
          `Would you like to split it into multiple Excel files for faster processing? ` +
          `(Each file will contain up to ${maxChunkSize.toLocaleString()} rows)`
        );

        if (userWantsMultipleFiles) {
          await this.exportMultipleFiles(data, groupedColumns, maxChunkSize);
          return;
        }
      }
      
      // Create optimized schema with cached column field access
      const columnFields = flattenedColumns.map(col => col.field).filter(Boolean) as string[];
      const columnLabels = flattenedColumns.map(col => col.label || col.field || 'Unknown');
      
      const schema = columnFields.map((field, index) => {
        const dataType = this.getOptimalDataType(data[0]?.[field]);
        const schemaEntry: any = {
          column: columnLabels[index],
          value: (row: any) => {
            const value = row[field];
            if (value === undefined || value === null) return '';
            
            // Convert string dates to Date objects when schema expects Date
            if (typeof dataType === 'object' && dataType.type === Date && typeof value === 'string') {
              const dateValue = new Date(value);
              return isNaN(dateValue.getTime()) ? value : dateValue;
            }
            
            return value;
          }
        };
        
        // Handle date format requirement
        if (typeof dataType === 'object' && dataType.type === Date) {
          schemaEntry.type = Date;
          schemaEntry.format = dataType.format;
        } else {
          schemaEntry.type = dataType;
        }
        
        return schemaEntry;
      });

      // Use requestAnimationFrame for better UI responsiveness during processing
      const chunkSize = this.pluginOptions['batchSize'] || 5000;
      let processedCount = 0;
      
      // Update button text for processing
      this.renderer.setProperty(
        this.exportButton, 
        'innerText', 
        'Processing data...'
      );
      
      // Process in smaller chunks with requestAnimationFrame for smoother UI
      for (let i = 0; i < data.length; i += chunkSize) {
        processedCount = Math.min(i + chunkSize, data.length);
        
        // Update progress
        const progressCallback = this.pluginOptions['onProgress'];
        if (progressCallback) {
          progressCallback(processedCount, data.length);
        }
        
        // Update button text with progress
        this.renderer.setProperty(
          this.exportButton, 
          'innerText', 
          `Processing ${processedCount.toLocaleString()}/${data.length.toLocaleString()}...`
        );
        
        // Use requestAnimationFrame for smoother UI updates
        await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
      }
      
      // Update button text for file generation
      this.renderer.setProperty(
        this.exportButton, 
        'innerText', 
        'Generating Excel file...'
      );
      
      // Generate Excel file using original data with optimized schema
      const buffer = await (writeExcelFile as any).default(data, {
        schema,
        headerStyle: {
          backgroundColor: '#eeeeee',
          fontWeight: 'bold',
          align: 'center'
        }
      });

      // Download the file
      const fileName = this.pluginOptions['fileName'] || 'export.xlsx';
      this.downloadFile(buffer, fileName);
      
      const completeCallback = this.pluginOptions['onComplete'];
      if (completeCallback) {
        completeCallback();
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Exports data as multiple Excel files for very large datasets
   */
  private async exportMultipleFiles(
    data: any[], 
    groupedColumns: ColumnDef[], 
    chunkSize: number
  ): Promise<void> {
    const totalChunks = Math.ceil(data.length / chunkSize);
    const baseFileName = this.pluginOptions['fileName'] || 'export.xlsx';
    const fileNameBase = baseFileName.replace('.xlsx', '');
    
    // Dynamically import write-excel-file
    const writeExcelFile = await import('write-excel-file');
    const flattenedColumns = this.flattenColumns(groupedColumns);
    
    // Create optimized schema with cached column field access and proper data types
    const columnFields = flattenedColumns.map(col => col.field).filter(Boolean) as string[];
    const columnLabels = flattenedColumns.map(col => col.label || col.field || 'Unknown');
    
    const schema = columnFields.map((field, index) => {
      const dataType = this.getOptimalDataType(data[0]?.[field]);
      const schemaEntry: any = {
        column: columnLabels[index],
        value: (row: any) => {
          const value = row[field];
          if (value === undefined || value === null) return '';
          
          // Convert string dates to Date objects when schema expects Date
          if (typeof dataType === 'object' && dataType.type === Date && typeof value === 'string') {
            const dateValue = new Date(value);
            return isNaN(dateValue.getTime()) ? value : dateValue;
          }
          
          return value;
        }
      };
      
      // Handle date format requirement
      if (typeof dataType === 'object' && dataType.type === Date) {
        schemaEntry.type = Date;
        schemaEntry.format = dataType.format;
      } else {
        schemaEntry.type = dataType;
      }
      
      return schemaEntry;
    });
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, data.length);
      const chunk = data.slice(start, end);
      
      const chunkFileName = totalChunks > 1 
        ? `${fileNameBase}_part_${i + 1}_of_${totalChunks}.xlsx`
        : `${fileNameBase}.xlsx`;

      // Update button text with current file progress
      this.renderer.setProperty(
        this.exportButton, 
        'innerText', 
        `Exporting file ${i + 1}/${totalChunks}...`
      );

      // Generate and download this chunk using optimized schema
      const buffer = await (writeExcelFile as any).default(chunk, {
        schema,
        headerStyle: {
          backgroundColor: '#eeeeee',
          fontWeight: 'bold',
          align: 'center'
        }
      });

      this.downloadFile(buffer, chunkFileName);
      
      // Small delay between files to prevent overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call progress callback
      const progressCallback = this.pluginOptions['onProgress'];
      if (progressCallback) {
        progressCallback(end, data.length);
      }
    }

    // Show completion message
    if (totalChunks > 1) {
      alert(`Export completed! ${totalChunks} files were created with a total of ${data.length.toLocaleString()} rows.`);
    }
    
    // Call the completion callback
    const completeCallback = this.pluginOptions['onComplete'];
    if (completeCallback) {
      completeCallback();
    }
  }

  /**
   * Fallback synchronous export for smaller datasets
   */
  private async exportSynchronously(data: any[], groupedColumns: ColumnDef[]): Promise<void> {
    // Dynamically import write-excel-file to keep the plugin lightweight
    const writeExcelFile = await import('write-excel-file');

    // Flatten the grouped columns for export
    const flattenedColumns = this.flattenColumns(groupedColumns);
      
    // Create optimized schema with cached column field access and proper data types
    const columnFields = flattenedColumns.map(col => col.field).filter(Boolean) as string[];
    const columnLabels = flattenedColumns.map(col => col.label || col.field || 'Unknown');
    
    const schema = columnFields.map((field, index) => {
      const dataType = this.getOptimalDataType(data[0]?.[field]);
      const schemaEntry: any = {
        column: columnLabels[index],
        value: (row: any) => {
          const value = row[field];
          if (value === undefined || value === null) return '';
          
          // Convert string dates to Date objects when schema expects Date
          if (typeof dataType === 'object' && dataType.type === Date && typeof value === 'string') {
            const dateValue = new Date(value);
            return isNaN(dateValue.getTime()) ? value : dateValue;
          }
          
          return value;
        }
      };
      
      // Handle date format requirement
      if (typeof dataType === 'object' && dataType.type === Date) {
        schemaEntry.type = Date;
        schemaEntry.format = dataType.format;
      } else {
        schemaEntry.type = dataType;
      }
      
      return schemaEntry;
    });

    // Use the original data directly with the optimized schema
    const buffer = await (writeExcelFile as any).default(data, {
      schema,
      headerStyle: {
        backgroundColor: '#eeeeee',
        fontWeight: 'bold',
        align: 'center'
      }
    });

    // Download the file
    const fileName = this.pluginOptions['fileName'] || 'export.xlsx';
    this.downloadFile(buffer, fileName);

    // Call completion callback if provided
    const completeCallback = this.pluginOptions['onComplete'];
    if (completeCallback) {
      completeCallback();
    }
  }

  /**
   * Determines the optimal data type for Excel export based on the value
   */
  private getOptimalDataType(value: any): any {
    if (value === null || value === undefined) {
      return String;
    }
    
    if (typeof value === 'number') {
      return Number;
    }
    
    if (typeof value === 'boolean') {
      return Boolean;
    }
    
    if (value instanceof Date) {
      return {
        type: Date,
        format: 'mm/dd/yyyy' // Required format for Date cells
      };
    }
    
    // Check if string value looks like a date
    if (typeof value === 'string') {
      // Check for common date patterns
      if (/^\d{4}-\d{2}-\d{2}/.test(value) || /^\d{1,2}\/\d{1,2}\/\d{4}/.test(value)) {
        return {
          type: Date,
          format: 'mm/dd/yyyy' // Required format for Date cells
        };
      }
      
      // Check if it's a numeric string
      if (!isNaN(Number(value)) && value.trim() !== '') {
        return Number;
      }
    }
    
    return String;
  }

  /**
   * Downloads a file from an ArrayBuffer
   */
  private downloadFile(buffer: ArrayBuffer, fileName: string): void {
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
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
