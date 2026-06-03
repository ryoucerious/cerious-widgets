import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent, GridOptions, PluginManagerService, PluginOptions, ServerSidePlugin, ZonelessCompatService } from 'ngx-cerious-widgets';
import { MOCK_COLUMN_DEFS, MOCK_DATA } from './testing/mock-data';
import { MockServerDataSource } from './testing/mock-server.datasource';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [GridComponent, CommonModule]
})
export class AppComponent implements AfterViewInit, OnDestroy, OnInit {
  data!: Array<any>;
  gridOptions!: GridOptions;
  pluginOptions!: PluginOptions;

  nestedData!: Array<any>;
  nestedOptions!: GridOptions;

  gridStates: Array<any> = []

  title = 'Cerious Widgets';

  @ViewChild('grid') grid!: GridComponent;

  constructor(
    private pluginManagerService: PluginManagerService,
    private cdr: ChangeDetectorRef,
    private zonelessCompat: ZonelessCompatService
  ) {}

  // Live performance metrics shown in the dashboard bar
  metrics = {
    fps: 0,
    avgFps: 0,
    minFps: 0,
    memoryUsed: 0,
    renderedRows: 0,
    scrollPercent: 0,
    isLoading: true,
  };

  stressTesting = false;

  // FPS meter internals
  private rafId = 0;
  private frameCount = 0;
  private lastFpsTs = 0;
  private fpsSamples: number[] = [];

  /**
   * Get formatted dataset size for display
   */
  getDatasetSize(): string {
    return this.data ? this.data.length.toLocaleString() : '0';
  }

  /**
   * Check if the app is running in zoneless mode
   */
  get isZonelessMode(): boolean {
    return this.zonelessCompat.isZonelessMode;
  }

  /**
   * Get the change detection mode label
   */
  get changeDetectionMode(): string {
    return this.isZonelessMode ? 'Zoneless' : 'Zone.js';
  }

  /**
   * Get the appropriate icon for the current mode
   */
  get changeDetectionIcon(): string {
    return this.isZonelessMode ? '⚡' : '🔄';
  }

  /**
   * Get current memory usage or estimation
   */
  getCurrentMemoryUsage(): void {
    if ('memory' in performance) {
      this.metrics.memoryUsed = (performance as any).memory.usedJSHeapSize / (1024 * 1024);
    } else {
      // Estimate based on data size - each row roughly 13 columns * 50 bytes average
      this.metrics.memoryUsed = (MOCK_DATA.length * 13 * 50) / (1024 * 1024);
    }
    this.cdr.detectChanges();
  }

  /**
   * Reads live grid + runtime metrics into the dashboard (rendered DOM rows,
   * memory, scroll position). Called once per FPS sample tick.
   */
  private updateLiveMetrics(): void {
    const body: HTMLElement | undefined = this.grid?.gridBody?.tableBody?.nativeElement;
    if (body) {
      this.metrics.renderedRows = body.querySelectorAll('cw-grid-row').length;
      const scrollbar = this.getEngineScrollbar();
      if (scrollbar) {
        const max = scrollbar.scrollHeight - scrollbar.clientHeight;
        this.metrics.scrollPercent = max > 0 ? Math.round((scrollbar.scrollTop / max) * 100) : 0;
      }
    }
    if ('memory' in performance) {
      this.metrics.memoryUsed = (performance as any).memory.usedJSHeapSize / (1024 * 1024);
    }
  }

  /**
   * Returns the cerious-scroll engine vertical scrollbar element, if present.
   */
  private getEngineScrollbar(): HTMLElement | null {
    const body: HTMLElement | undefined = this.grid?.gridBody?.tableBody?.nativeElement;
    return body ? body.querySelector('[data-cerious-scrollbar]') : null;
  }

  /**
   * Starts a requestAnimationFrame loop that measures real frames-per-second and
   * refreshes the live metrics roughly twice a second.
   */
  private startFpsMeter(): void {
    const loop = (now: number) => {
      if (this.lastFpsTs === 0) this.lastFpsTs = now;
      this.frameCount++;
      const elapsed = now - this.lastFpsTs;
      if (elapsed >= 500) {
        const fps = Math.round((this.frameCount * 1000) / elapsed);
        this.metrics.fps = fps;
        this.metrics.minFps = this.metrics.minFps === 0 ? fps : Math.min(this.metrics.minFps, fps);
        this.fpsSamples.push(fps);
        if (this.fpsSamples.length > 120) this.fpsSamples.shift();
        this.metrics.avgFps = Math.round(
          this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length
        );
        this.frameCount = 0;
        this.lastFpsTs = now;
        this.updateLiveMetrics();
        this.cdr.detectChanges();
      }
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  /**
   * Returns a status color for an FPS reading (green/amber/red).
   */
  fpsColor(fps: number): string {
    if (fps >= 55) return '#22c55e';
    if (fps >= 30) return '#f59e0b';
    return '#ef4444';
  }

  /**
   * Resets the rolling min/avg FPS samples.
   */
  resetFps(): void {
    this.metrics.minFps = 0;
    this.fpsSamples = [];
  }

  /**
   * Simple delay utility.
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Resolves on the next animation frame so a scroll sweep stays aligned with
   * the browser's render cadence instead of saturating the main thread.
   */
  private nextFrame(): Promise<void> {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
  }

  /**
   * Scrolls the grid to a fraction (0-1) of its content via the engine scrollbar.
   */
  scrollToPosition(percentage: number): void {
    const scrollbar = this.getEngineScrollbar();
    if (!scrollbar) return;
    const max = scrollbar.scrollHeight - scrollbar.clientHeight;
    scrollbar.scrollTop = max * percentage;
  }

  /**
   * Runs an automated scroll sweep (top -> bottom -> top) to stress the virtual
   * scroller while the FPS meter captures the minimum frame rate.
   */
  async runFpsStressTest(): Promise<void> {
    const scrollbar = this.getEngineScrollbar();
    if (this.stressTesting || !scrollbar) return;

    this.stressTesting = true;
    this.resetFps();
    const max = scrollbar.scrollHeight - scrollbar.clientHeight;
    const steps = 150;
    try {
      for (let i = 0; i <= steps; i++) {
        scrollbar.scrollTop = (max * i) / steps;
        await this.delay(8);
      }
      for (let i = steps; i >= 0; i--) {
        scrollbar.scrollTop = (max * i) / steps;
        await this.delay(8);
      }
    } finally {
      this.stressTesting = false;
      this.cdr.detectChanges();
    }
  }

  ngAfterViewInit() {
    this.startFpsMeter();
  }

  ngOnDestroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
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
      heightOffset: 20,
      // pageSize: 50,
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
    
    // Start loading state and measure memory after data assignment
    this.metrics.isLoading = true;
    
    setTimeout(() => {
      this.getCurrentMemoryUsage();
      this.metrics.isLoading = false;
    }, 500);
  }
}
