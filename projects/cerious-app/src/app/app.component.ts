import { AfterViewInit, Component, OnInit, ViewChild, } from '@angular/core';
import { GridComponent, GridOptions, PluginManagerService, PluginOptions, ServerSidePlugin } from 'ngx-cerious-widgets';
import { MOCK_COLUMN_DEFS, MOCK_DATA } from './testing/mock-data';
import { MockServerDataSource } from './testing/mock-server.datasource';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [GridComponent]
})
export class AppComponent implements AfterViewInit, OnInit {
  data!: Array<any>;
  gridOptions!: GridOptions;
  pluginOptions!: PluginOptions;

  nestedData!: Array<any>;
  nestedOptions!: GridOptions;

  gridStates: Array<any> = []

  title = 'Cerious Widgets';

  @ViewChild('grid') grid!: GridComponent;

  constructor(
    private pluginManagerService: PluginManagerService
  ) {}

  ngAfterViewInit() {
    // // Register server-side plugin
    // const dataSource = new MockServerDataSource();
    // const serverSidePlugin = new ServerSidePlugin(dataSource);
    // this.pluginManagerService.registerPlugins({'server-side': async () => serverSidePlugin }, this.grid.gridApi);

    // this.pluginManagerService.loadPlugin(
    //   'export-to-excel',
    //   this.grid.gridApi,
    //   { 
    //     enableExportToExcel: true,
    //     onBeforeExportToExcel: (data: any, columns: any) => {
    //       console.log('Export to excel', data);
    //     }
    //   }
    // );
    // this.pluginManagerService.loadPlugin('multi-sort', this.grid.gridApi, { enableMultiSort: true });
    // this.pluginManagerService.loadPlugin(
    //   'save-state',
    //   this.grid.gridApi,
    //   {
    //     enableSaveState: true,
    //     onSaveState: (state: any) => {
    //       this.gridStates.push(state);
    //       console.log('State saved', state);
    //     },
    //     onLoadState: (state: any) => {
    //       console.log('State loaded', state);
    //     },
    //     onDeleteState: (state: any) => {
    //       this.gridStates = this.gridStates.filter(s => s !== state);
    //       console.log('State deleted', state);
    //     },
    //     label: 'Favorite'
    //   });
    // this.pluginManagerService.loadPlugin('column-visibility', this.grid.gridApi, { enableColumnVisibility: true });
    // this.pluginManagerService.loadPlugin(
    //   'column-menu',
    //   this.grid.gridApi,
    //   {
    //     enableColumnMenu: true,
    //     enablePinning: true,
    //     enableGroupBy: true
    //   }
    // );
    // this.pluginManagerService.loadPlugin('global-text-filter', this.grid.gridApi, { enableGlobalTextFilter: true });
  }

  ngOnInit() {
    this.gridOptions = {
      headerTemplate: 'headerTemplate',
      showFooter: true,
      showMenuBar: true,
      showPager: true,
      height: 'auto',
      columnWidth: '175px',
      enableVirtualScroll: true,
      enableMultiselect: true,
      pageSize: 50,
      noDataMessage: "There are no records based on your search criteria.",
      columnDefs: [...MOCK_COLUMN_DEFS]
    };

    // Client Side Data
    this.data = [...MOCK_DATA];
      
  }
}
