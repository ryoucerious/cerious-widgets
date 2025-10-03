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
    this.pluginManagerService.loadPlugin(
      'export-to-excel',
      this.grid.gridApi
    );
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
      columnDefs: [...MOCK_COLUMN_DEFS],
    };

    this.pluginOptions = {
      ExportToExcel: {
        enableExportToExcel: true, 
        useStreamingExport: true,
        maxChunkSize: 25000,          // Smaller chunks for better single-file success
        webWorkerThreshold: 1000,     // Use worker for smaller datasets
        batchSize: 10000,             // Larger batches for speed
        autoSplitLargeDatasets: true, // Skip confirmation for 1M+ rows
        onProgress: (processed: any, total: any) => {
          const percent = Math.round((processed / total) * 100);
          console.log(`Progress: ${percent}% (${processed.toLocaleString()}/${total.toLocaleString()})`);
        },
        onComplete: () => {
          alert('All files exported successfully!');
        },
        onError: (error: any) => {
          console.error('Export error:', error);
        }
      }
    };

    // Client Side Data
    this.data = [...MOCK_DATA];
      
  }
}
