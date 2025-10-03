import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent, GridOptions, PluginManagerService, PluginOptions, ServerSidePlugin } from 'ngx-cerious-widgets';
import { MOCK_COLUMN_DEFS, MOCK_DATA } from './testing/mock-data';
import { MockServerDataSource } from './testing/mock-server.datasource';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [GridComponent, CommonModule]
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
    private pluginManagerService: PluginManagerService,
    private cdr: ChangeDetectorRef
  ) {}

  // Visual metrics display
  displayMetrics = {
    memoryUsed: 0,
    memoryEfficiency: 0,
    isLoading: true,
    isScrollTesting: false,
    currentScrollTest: '',
    scrollTestProgress: 0,
    currentScrollPosition: 0,
    totalTime: 0,
    dataSetupTime: 0,
    gridInitTime: 0,
    firstRenderTime: 0,
    performanceGrade: 'A+'
  };

  // Scroll test state
  scrollTestRunning = false;
  scrollTestProgress = 0;

  /**
   * Get formatted dataset size for display
   */
  getDatasetSize(): string {
    return this.data ? this.data.length.toLocaleString() : '0';
  }

  /**
   * Get current memory usage or estimation
   */
  getCurrentMemoryUsage(): void {
    const startTime = performance.now();
    
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const currentUsed = memory.usedJSHeapSize / (1024 * 1024);
      this.displayMetrics.memoryUsed = currentUsed;
      this.displayMetrics.memoryEfficiency = currentUsed / (MOCK_DATA.length / 1000);
    } else {
      // Estimate based on data size - each row roughly 13 columns * 50 bytes average
      const estimatedMemory = (MOCK_DATA.length * 13 * 50) / (1024 * 1024);
      this.displayMetrics.memoryUsed = estimatedMemory;
      this.displayMetrics.memoryEfficiency = estimatedMemory / (MOCK_DATA.length / 1000);
    }
    
    // Mock timing data for demonstration
    this.displayMetrics.dataSetupTime = 45.2;
    this.displayMetrics.gridInitTime = 89.7;
    this.displayMetrics.firstRenderTime = 156.3;
    this.displayMetrics.totalTime = this.displayMetrics.dataSetupTime + this.displayMetrics.gridInitTime + this.displayMetrics.firstRenderTime;
    
    // Calculate performance grade
    if (this.displayMetrics.totalTime < 200) {
      this.displayMetrics.performanceGrade = 'A+';
    } else if (this.displayMetrics.totalTime < 500) {
      this.displayMetrics.performanceGrade = 'A';
    } else if (this.displayMetrics.totalTime < 1000) {
      this.displayMetrics.performanceGrade = 'B';
    } else {
      this.displayMetrics.performanceGrade = 'C';
    }
    
    this.cdr.detectChanges();
  }

  /**
   * Start scroll test with visible animation
   */
  async startScrollTest(): Promise<void> {
    if (this.scrollTestRunning || !this.grid?.gridBody?.tableBody) {
      return;
    }

    this.scrollTestRunning = true;
    this.displayMetrics.scrollTestProgress = 0;
    this.displayMetrics.currentScrollTest = 'Scrolling down through data...';
    this.cdr.detectChanges();

    const scrollContainer = this.grid.gridBody.tableBody.nativeElement;
    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    
    // Scroll down
    for (let i = 0; i <= 100; i += 5) {
      this.displayMetrics.scrollTestProgress = i / 2; // 0-50%
      const scrollPosition = (maxScroll * i) / 100;
      scrollContainer.scrollTop = scrollPosition;
      this.displayMetrics.currentScrollPosition = Math.round((i / 100) * MOCK_DATA.length);
      this.cdr.detectChanges();
      await this.delay(50);
    }

    this.displayMetrics.currentScrollTest = 'Scrolling back to top...';
    
    // Scroll back up
    for (let i = 100; i >= 0; i -= 5) {
      this.displayMetrics.scrollTestProgress = 50 + (100 - i) / 2; // 50-100%
      const scrollPosition = (maxScroll * i) / 100;
      scrollContainer.scrollTop = scrollPosition;
      this.displayMetrics.currentScrollPosition = Math.round((i / 100) * MOCK_DATA.length);
      this.cdr.detectChanges();
      await this.delay(50);
    }

    this.scrollTestRunning = false;
    this.displayMetrics.scrollTestProgress = 0;
    this.displayMetrics.currentScrollPosition = 0;
    
    // Update memory measurement after scroll test
    this.getCurrentMemoryUsage();
    
    this.cdr.detectChanges();
  }

  /**
   * Quick scroll to top
   */
  scrollToTop(): void {
    if (this.grid?.gridBody?.tableBody) {
      this.grid.gridBody.tableBody.nativeElement.scrollTop = 0;
      this.displayMetrics.currentScrollPosition = 0;
      // Update memory after scroll
      setTimeout(() => this.getCurrentMemoryUsage(), 100);
    }
  }

  /**
   * Quick scroll to bottom
   */
  scrollToBottom(): void {
    if (this.grid?.gridBody?.tableBody) {
      const scrollContainer = this.grid.gridBody.tableBody.nativeElement;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      this.displayMetrics.currentScrollPosition = MOCK_DATA.length;
      // Update memory after scroll
      setTimeout(() => this.getCurrentMemoryUsage(), 100);
    }
  }

  /**
   * Simple delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Test scroll performance with visible animation
   */
  async testScrollPerformance(): Promise<void> {
    if (this.displayMetrics.isScrollTesting) return;
    
    this.displayMetrics.isScrollTesting = true;
    this.displayMetrics.currentScrollTest = 'Testing scroll performance...';
    this.displayMetrics.scrollTestProgress = 0;
    this.cdr.detectChanges();
    
    try {
      await this.startScrollTest();
    } finally {
      this.displayMetrics.isScrollTesting = false;
      this.displayMetrics.currentScrollTest = '';
      this.displayMetrics.scrollTestProgress = 0;
      this.cdr.detectChanges();
    }
  }

  /**
   * Debug scrollable elements
   */
  debugScrollableElements(): void {
    console.log('🔍 Debug - Grid Component:', this.grid);
    console.log('🔍 Debug - Grid Body:', this.grid?.gridBody);
    console.log('🔍 Debug - Table Body:', this.grid?.gridBody?.tableBody);
    console.log('🔍 Debug - Native Element:', this.grid?.gridBody?.tableBody?.nativeElement);
    
    if (this.grid?.gridBody?.tableBody?.nativeElement) {
      const element = this.grid.gridBody.tableBody.nativeElement;
      console.log('🔍 Debug - Scroll Properties:', {
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        scrollTop: element.scrollTop,
        canScroll: element.scrollHeight > element.clientHeight
      });
    }
  }

  /**
   * Scroll to specific position (0-1 range)
   */
  scrollToPosition(percentage: number): void {
    if (!this.grid?.gridBody?.tableBody) return;
    
    const scrollContainer = this.grid.gridBody.tableBody.nativeElement;
    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    const targetPosition = maxScroll * percentage;
    
    scrollContainer.scrollTop = targetPosition;
    this.displayMetrics.currentScrollPosition = Math.round((targetPosition / maxScroll) * MOCK_DATA.length);
    // Update memory after scroll
    setTimeout(() => this.getCurrentMemoryUsage(), 100);
  }

  ngAfterViewInit() {
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
      heightOffset: 10,
      // pageSize: 50,
      noDataMessage: "There are no records based on your search criteria.",
      columnDefs: [...MOCK_COLUMN_DEFS]
    };

    // Client Side Data
    this.data = [...MOCK_DATA];
    
    // Start loading state and measure memory after data assignment
    this.displayMetrics.isLoading = true;
    
    setTimeout(() => {
      this.getCurrentMemoryUsage();
      this.displayMetrics.isLoading = false;
    }, 500);
  }
}
