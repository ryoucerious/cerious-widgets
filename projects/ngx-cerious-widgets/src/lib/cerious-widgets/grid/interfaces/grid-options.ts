import { ColumnDef } from "./column-def";

/**
 * Interface representing the configuration options for a grid component.
 */
export interface GridOptions {
    // === Column Configuration ===

    /**
     * Array of column definitions for the grid.
     */
    columnDefs: Array<ColumnDef>;

    /**
     * Optional array of additional column options.
     */
    columnOptions?: Array<any>;

    /**
     * Default width for columns in the grid.
     */
    columnWidth?: string;

    /**
     * Width for feature columns in the grid.
     */
    featureColumnWidth?: string;

    /**
     * Whether pinning columns is enabled.
     */
    enablePinning?: boolean;

    /**
     * Whether toggling column visibility is enabled.
     */
    enableColumnVisibility?: boolean;

    // === Grouping ===

    /**
     * Whether grouping rows by column values is enabled.
     */
    enableGroupBy?: boolean;

    // === Virtual Scrolling ===

    /**
     * Whether virtual scrolling is enabled for the grid body.
     * When `true` (default) rows are rendered through the cerious-scroll
     * engine, recycling DOM nodes as the user scrolls. When `false` every
     * row is rendered up-front and the body becomes a native scroll container
     * — simpler and friendlier to find-in-page / printing, but expensive for
     * large datasets.
     *
     * @default true
     */
    enableVirtualScroll?: boolean;

    // === Pagination ===

    /**
     * Number of rows per page for pagination.
     */
    pageSize?: number;

    /**
     * Whether the pager control is displayed.
     */
    showPager?: boolean;

    /**
     * Per-part configuration for the pager (built on the standalone Paginator).
     * Each region defaults to shown; set `false` to hide it.
     */
    pager?: {
      /** Rows-per-page select. */
      showPageSize?: boolean;
      /** "Showing x to y of n" summary. */
      showSummary?: boolean;
      /** First / last («, ») buttons. */
      showFirstLast?: boolean;
      /** Previous / next (‹, ›) buttons. */
      showPrevNext?: boolean;
      /** Numbered page buttons. */
      showPageNumbers?: boolean;
      /** Page-size choices; when set, the size select becomes interactive. */
      pageSizeOptions?: number[];
    };

    /**
     * Whether the menu bar is displayed at the top of the grid.
     */
    showMenuBar?: boolean;

    // === Grid Dimensions ===

    /**
     * Height of the grid.
     */
    height?: string;

    /**
     * Maximum height of the grid.
     */
    maxHeight?: string;

    /**
     * Offset value for the grid height.
     */
    heightOffset?: number;

    /**
     * Configuration for resizing the grid container.
     */
    resizeContainer?: any;

    // === Templates ===

    /**
     * Template for the menu bar.
     */
    headerTemplate?: string;

    /**
     * Template for nested rows.
     */
    nestedRowTemplate?: string;

    /**
     * Whether to pin the nested row template.
     */
    pinNestedRowTemplate?: boolean;

    // === Footer and No Data Message ===

    /**
     * Whether the footer is displayed.
     */
    showFooter?: boolean;

    /**
     * Message to display when no data is available.
     */
    noDataMessage?: string;

    // === Selection ===

    /**
     * Whether multi-selection of rows is enabled.
     */
    enableMultiselect?: boolean;

    /**
     * Whether single-selection of rows is enabled.
     */
    enableSingleselect?: boolean;

    // === Container ===

    /**
     * Configuration for the grid container.
     */
    container?: any;
}
