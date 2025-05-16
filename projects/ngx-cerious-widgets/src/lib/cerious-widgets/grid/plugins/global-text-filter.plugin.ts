import { ElementRef, Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { GridApi } from "../interfaces/grid-api";
import { GridPlugin } from "../interfaces/grid-plugin";
import { FilterState } from "../interfaces/filter-state";

@Injectable()
export class GlobalTextFilterPlugin implements GridPlugin {
    private inputElement: HTMLInputElement | null = null;
    private gridApi!: GridApi;
    private renderer: Renderer2;
    private pluginBar: ElementRef | null = null;

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    /**
     * Initializes the Global Text Filter plugin for the grid.
     * 
     * This method sets up an input element for global text-based filtering across all columns
     * in the grid. The input element is added to the plugin bar and listens for user input
     * to dynamically filter grid data based on the search term.
     * 
     * @param api - The GridApi instance used to interact with the grid.
     * 
     * Functionality:
     * - Checks if the `enableGlobalTextFilter` option is enabled in the plugin options.
     * - Creates and styles an input element for entering the search term.
     * - Listens for input events on the element to apply a global filter across all columns.
     * - Constructs a `FilterState` object to define the filter criteria for each column.
     * - Applies the filter to the grid using the `applyFilter` method of the GridApi.
     * - Appends the input element to the plugin bar for user interaction.
     */
    onInit(api: GridApi): void {
        this.gridApi = api;

        // Check if the pluginOptions include `enableGlobalTextFilter`
        const pluginOptions = this.gridApi.getPluginOptions();
        if (!pluginOptions?.['GlobalTextFilter']?.enableGlobalTextFilter) {
            return; // Do not add the input if `enableGlobalTextFilter` is not enabled
        }

        // Register the filter function with the grid API
        this.gridApi.setFilterFunction(this.applyFilter);

        this.pluginBar = this.gridApi.getPluginBar();
        if (!this.pluginBar) {
            console.warn('Grid plugin bar not found. Global text filter input will not be added.');
            return; // Exit if the plugin bar is not found
        }

        // Create the input element
        this.inputElement = this.renderer.createElement('input');
        this.renderer.setAttribute(this.inputElement, 'type', 'text');
        this.renderer.setAttribute(this.inputElement, 'placeholder', 'Search...');
        this.renderer.setAttribute(this.inputElement, 'aria-label', 'Search the grid');
        this.renderer.setAttribute(this.inputElement, 'role', 'searchbox');
        this.renderer.setStyle(this.inputElement, 'margin', '8px');
        this.renderer.setStyle(this.inputElement, 'padding', '4px');
        this.renderer.setStyle(this.inputElement, 'width', '200px');

        // Add event listener for filtering
        this.renderer.listen(this.inputElement, 'input', (event: Event) => {
            const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

            // Create a FilterState object
            const filterState = {} as FilterState;

            if (searchTerm !== '') {
                // Iterate through all columns and apply the search term only if `filterable` is not false
                const columnDefs = this.gridApi.getFlattenedColumnDefs();
                columnDefs.forEach((col) => {
                    if (col.field && col.filterable !== false) {
                        filterState[col.field] = {
                            type: 'contains',
                            value: searchTerm
                        };
                    }
                });
            }

            // Apply the filter using the FilterState
            this.gridApi.applyFilter(filterState);
        });

        // Append the input element to the plugin bar
        this.renderer.appendChild(this.pluginBar.nativeElement, this.inputElement);
    }

    /**
     * Cleans up resources when the plugin is destroyed.
     * Removes the input element from the plugin bar if it exists and sets the reference to null.
     */
    onDestroy(): void {
        if (this.inputElement && this.pluginBar?.nativeElement) {
            this.renderer.removeChild(this.pluginBar.nativeElement, this.inputElement);
        }
        this.inputElement = null;
    }

    private applyFilter(data: any[], filterState: FilterState): any[] {
         // If filterState is empty, return all data
        if (!filterState || Object.keys(filterState).length === 0) {
            return [...data];
        }

        // Get visible columns
        const columns = this.gridApi.getFlattenedColumnDefs().filter(c => c.visible !== false);
        
        // Apply filters to the dataset
        return [...data].filter(row => {
            return Object.keys(filterState).some(columnField => {
                const filter = filterState[columnField];
                const column = columns.find(col => col.field === columnField); // Find column by field
            
                if (!column || !filter || !filter.value) {
                    return false; // Skip filtering if the column or filter is invalid
                }
            
                const cellValue = row[column.field ?? '']?.toString().toLowerCase(); // Use `field` to access the data
                const filterValue = filter.value.toString().toLowerCase();
            
                // Apply filter logic based on the filter type
                switch (filter.type) {
                    case 'contains':
                    return cellValue.includes(filterValue);
                    case 'equals':
                    return cellValue === filterValue;
                    case 'startsWith':
                    return cellValue.startsWith(filterValue);
                    case 'endsWith':
                    return cellValue.endsWith(filterValue);
                    default:
                    return false; // If the filter type is unknown, skip filtering
                }
            });
        });
    }
}