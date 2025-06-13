// Angular core imports
import { AfterViewInit, ChangeDetectorRef, Component, ContentChildren, DoCheck, ElementRef, EventEmitter, Inject, Injector, Input, IterableDiffers, OnDestroy, OnInit, Optional, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

// Angular common
import { CommonModule } from '@angular/common';

// Angular DI tokens
import { GRID_COLUMN_SERVICE } from '../tokens/grid-column-service.token';
import { GRID_SERVICE } from '../tokens/grid-service.token';
import { WIDGETS_CONFIG } from '../../shared/tokens/widgets-config.token';

// Interfaces
import { CellEvent, RowEvent } from '../interfaces';
import { GridApi } from '../interfaces/grid-api';
import { GridOptions } from '../interfaces/grid-options';
import { IGridBodyComponent } from '../interfaces/component-interfaces/grid-body.interface';
import { IGridComponent } from '../interfaces/component-interfaces/grid.interface';
import { IGridFooterComponent } from '../interfaces/component-interfaces/grid-footer.interface';
import { IGridHeaderComponent } from '../interfaces/component-interfaces/grid-header.interface';
import { IGridMenuBarComponent } from '../interfaces/component-interfaces/grid-menu-bar.interface';
import { IGridPagerComponent } from '../interfaces/component-interfaces/grid-pager.interface';
import { IGridScrollerComponent } from '../interfaces/component-interfaces/grid-scroller.interface';
import { IGridColumnService } from '../interfaces/service-interfaces/grid-column.interface';
import { IGridService } from '../interfaces/service-interfaces/grid.interface';
import { PluginOptions } from '../interfaces/plugin-options';
import { WidgetsConfig } from '../../shared/interfaces/widgets-config.interface';

// Plugins
import { GridPlugin } from '../interfaces/grid-plugin';

// Services
import { GridService } from '../services/grid.service';

// Components
import { GridBodyComponent } from './grid-body/grid-body.component';
import { GridFooterComponent } from './grid-footer/grid-footer.component';
import { GridHeaderComponent } from './grid-header/grid-header.component';
import { GridMenuBarComponent } from './grid-menu-bar/grid-menu-bar.component';
import { GridPagerComponent } from './grid-pager/grid-pager.component';
import { GridScrollerComponent } from './grid-scroller/grid-scroller.component';

@Component({
  selector: 'cw-grid',
  standalone: true,
  templateUrl: './grid.component.html',
  providers: [
    { provide: GRID_SERVICE, useClass: GridService }
  ],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, GridFooterComponent, GridHeaderComponent, GridBodyComponent, GridMenuBarComponent, GridPagerComponent, GridScrollerComponent],
})
export class GridComponent implements IGridComponent, DoCheck, OnInit, OnDestroy, AfterViewInit {
  private iterableDiffer: any;
  private pluginInstances: GridPlugin[] = [];
  private resizeObserver: ResizeObserver | null = null;

  gridApi!: GridApi;
  
  @Input() gridOptions!: GridOptions;
  @Input() pluginOptions!: PluginOptions;
  @Input() data: any;
  @Input() plugins: GridPlugin[] = [];

  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowClick: EventEmitter<RowEvent<any>> = new EventEmitter<RowEvent<any>>();
  @Output() rowDoubleClick: EventEmitter<RowEvent<any>> = new EventEmitter<RowEvent<any>>();
  @Output() rowKeypress: EventEmitter<RowEvent<any>> = new EventEmitter<RowEvent<any>>();
  @Output() rowKeydown: EventEmitter<RowEvent<any>> = new EventEmitter<RowEvent<any>>();
  @Output() rowKeyup: EventEmitter<RowEvent<any>> = new EventEmitter<RowEvent<any>>();
  @Output() cellClick: EventEmitter<CellEvent<any>> = new EventEmitter<CellEvent<any>>();
  @Output() cellDoubleClick: EventEmitter<CellEvent<any>> = new EventEmitter<CellEvent<any>>();
  @Output() cellKeypress: EventEmitter<CellEvent<any>> = new EventEmitter<CellEvent<any>>();
  @Output() cellKeydown: EventEmitter<CellEvent<any>> = new EventEmitter<CellEvent<any>>();
  @Output() cellKeyup: EventEmitter<CellEvent<any>> = new EventEmitter<CellEvent<any>>();
  @Output() columnResize: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnVisibilityChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() gridResize: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(TemplateRef) templateRefs!: QueryList<any>;

  @ViewChild('gridContainer') gridContainer!: ElementRef;
  @ViewChild('gridFooter') gridFooter!: IGridFooterComponent;
  @ViewChild('gridHeader') gridHeader!: IGridHeaderComponent;
  @ViewChild('gridBody') gridBody!: IGridBodyComponent;
  @ViewChild('gridMenuBar') gridMenuBar!: IGridMenuBarComponent;
  @ViewChild('gridPager') gridPager!: IGridPagerComponent;
  @ViewChild('gridScroller') gridScroller!: IGridScrollerComponent;
  
  constructor(
    public changeDetector: ChangeDetectorRef,
    private injector: Injector,
    private iterableDiffers: IterableDiffers,
    @Inject(GRID_SERVICE) private gridService: IGridService,
    @Inject(GRID_COLUMN_SERVICE) private gridColumnService: IGridColumnService,
    @Optional() @Inject(WIDGETS_CONFIG) public config: WidgetsConfig
  ) {
    this.iterableDiffer = this.iterableDiffers.find([]).create();
    this.gridApi = this.gridService.gridApi;
    this.pluginInstances = (this.config?.plugins || []).map(pluginType => 
      this.injector.get(pluginType)
    );

    if (this.config && !this.pluginOptions) {
      this.pluginOptions = this.config.pluginOptions || {};
    }
  }

  ngAfterViewInit(): void {
    this.gridService.grid = this;
    this.gridService.gridContainer = this.gridContainer;
    this.gridService.gridFooter = this.gridFooter;
    this.gridService.gridHeader = this.gridHeader;
    this.gridService.gridBody = this.gridBody;
    this.gridService.gridMenuBar = this.gridMenuBar;
    this.gridService.gridPager = this.gridPager;
    this.gridService.gridScroller = this.gridScroller;

    this.gridService.setGridContainerElement();

    this.gridService.setScrollbarSize();

    if (this.gridService.gridOptions.container && this.gridService.gridOptions.height === 'auto') {
      this.gridService.gridOptions.container.addEventListener('resize', () => this.resize());
    }

    if (this.gridService.gridContainerElement) {
      this.resizeObserver = new ResizeObserver(() => this.gridService.resize());
      this.resizeObserver.observe(this.gridService.gridContainerElement);
    }

    setTimeout(() => {
      this.gridService.processTemplates(this.templateRefs);
      this.gridColumnService.processGridDefs(this.gridService.gridOptions, this.gridService.gridDataset);
      this.gridService.resize();
      
      setTimeout(() => {
        this.registerPlugins();

        // if server-side plugin is used
        if (this.gridApi.requestData) {
          setTimeout(() => {
            this.gridService.requestData().subscribe();
          });
        }
      });
    });
  }

  ngDoCheck(): void {
    // Check if the data changed and reload the current page data
    if (this.iterableDiffer.diff(this.data)) {
      this.gridService.processDataset();
    }
  }

  ngOnInit(): void {
    this.gridService.gridOptions = this.gridOptions;
    this.gridService.pluginOptions = this.pluginOptions;
    this.gridService.setData(this.data);   
  }

  ngOnDestroy(): void {
    this.plugins.forEach(p => p.onDestroy?.());

    if (this.gridService.gridOptions.container) {
      this.gridService.gridOptions.container.removeEventListener('resize', () => this.resize());
    }

    if (this.resizeObserver && this.gridService.gridContainerElement) {
      this.resizeObserver.unobserve(this.gridService.gridContainerElement);
      this.resizeObserver.disconnect();
    }
  }

  /**
   * Handles the mouse move event and delegates it to the grid service.
   *
   * @param e - The mouse event triggered by the user's interaction.
   */
  onMouseMove(e: MouseEvent): void {
    this.gridService.onMouseMove(e);
  }

  /**
   * Handles the mouse up event and delegates the event to the grid service.
   *
   * @param e - The mouse event triggered when the mouse button is released.
   */
  onMouseUp(e: MouseEvent): void {
    this.gridService.onMouseUp(e);
  }

  /**
   * Triggers the resize operation for the grid component.
   * Delegates the resize logic to the `gridService`.
   * This method is typically used to adjust the grid's layout or dimensions
   * in response to external changes, such as window resizing.
   */
  resize(): void {
    this.gridService.resize();
  }

  /**
   * Registers and initializes all plugins associated with the grid component.
   * Combines both static plugins and dynamically instantiated plugin instances,
   * and invokes their `onInit` method, passing the grid API as an argument.
   *
   * @remarks
   * This method ensures that all plugins are properly initialized and ready
   * to interact with the grid API.
   */
  registerPlugins(): void {
    const allPlugins = [...(this.plugins || []), ...(this.pluginInstances || [])];
    allPlugins.forEach(p => p.onInit(this.gridApi));
  }

  /**
   * Registers a plugin with the grid component if it has not already been registered.
   * Once registered, the plugin's `onInit` method is called with the grid API.
   *
   * @param plugin - The plugin to be registered. Must implement the `GridPlugin` interface.
   */
  registerPlugin(plugin: GridPlugin): void {
    if (!this.plugins.some(p => p === plugin)) {
      this.plugins.push(plugin);
    }
    plugin.onInit(this.gridApi);
  }

  /**
   * Determines whether the footer should be displayed in the grid.
   *
   * @returns {boolean} `true` if the footer should be shown, otherwise `false`.
   */
  shouldShowFooter(): boolean {
    return this.gridService.gridOptions.showFooter === true;
  }

  /**
   * Determines whether the menu bar should be displayed in the grid.
   *
   * @returns {boolean} `true` if the menu bar should be shown; otherwise, `false`.
   */
  shouldShowMenuBar(): boolean {
    return this.gridService.gridOptions.showMenuBar === true;
  }

  /**
   * Determines whether the pager should be displayed in the grid.
   *
   * @returns {boolean} `true` if the pager should be shown; otherwise, `false`.
   */
  shouldShowPager(): boolean {
    return this.gridService.gridOptions.showPager === true;
  }

}
