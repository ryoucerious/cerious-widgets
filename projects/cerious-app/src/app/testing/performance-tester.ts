/**
 * Performance testing utilities for Cerious Grid
 */

export interface PerformanceMetrics {
  dataSetupTime: number;
  gridInitTime: number;
  firstRenderTime: number;
  totalTime: number;
  memoryUsed?: number;
  memoryEfficiency?: number;
}

export interface ScrollPerformanceTest {
  position: number;
  label: string;
  targetRow: number;
  scrollTime: number;
}

export class GridPerformanceTester {
  private startTime: number = 0;
  private metrics: { [key: string]: number } = {};

  /**
   * Start a performance timer
   */
  startTimer(label: string): void {
    this.metrics[`${label}_start`] = performance.now();
  }

  /**
   * End a performance timer
   */
  endTimer(label: string): number {
    const endTime = performance.now();
    const startTime = this.metrics[`${label}_start`];
    const duration = endTime - startTime;
    this.metrics[`${label}_duration`] = duration;
    return duration;
  }

  /**
   * Get timer duration without ending it
   */
  getTimerDuration(label: string): number {
    const startTime = this.metrics[`${label}_start`];
    return startTime ? performance.now() - startTime : 0;
  }

  /**
   * Measure memory usage (Chrome only)
   */
  measureMemory(): number | null {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return null;
  }

  /**
   * Test grid initialization performance
   */
  async testGridInitialization(
    dataSize: number, 
    columnCount: number,
    setupCallback: () => void,
    renderCallback: () => Promise<void>
  ): Promise<PerformanceMetrics> {
    
    console.log(`🚀 Testing grid initialization with ${dataSize.toLocaleString()} rows, ${columnCount} columns`);
    
    const memoryBefore = this.measureMemory();
    
    // Test data setup
    this.startTimer('dataSetup');
    setupCallback();
    const dataSetupTime = this.endTimer('dataSetup');

    // Test grid initialization and rendering
    this.startTimer('gridInit');
    await renderCallback();
    const totalTime = this.endTimer('gridInit');

    const memoryAfter = this.measureMemory();
    
    const metrics: PerformanceMetrics = {
      dataSetupTime,
      gridInitTime: totalTime - dataSetupTime,
      firstRenderTime: totalTime,
      totalTime,
      memoryUsed: memoryBefore && memoryAfter ? (memoryAfter - memoryBefore) / (1024 * 1024) : undefined,
      memoryEfficiency: memoryBefore && memoryAfter ? ((memoryAfter - memoryBefore) / (1024 * 1024)) / (dataSize / 1000) : undefined
    };

    this.logMetrics(metrics, dataSize, columnCount);
    return metrics;
  }

  /**
   * Test scrolling performance through different positions
   */
  async testScrollPerformance(
    dataSize: number,
    scrollCallback: (position: number) => Promise<void>
  ): Promise<ScrollPerformanceTest[]> {
    
    console.log('🏃‍♂️ Testing scroll performance...');
    
    const positions = [
      { position: 0, label: 'Top' },
      { position: 0.1, label: '10%' },
      { position: 0.25, label: '25%' },
      { position: 0.5, label: 'Middle' },
      { position: 0.75, label: '75%' },
      { position: 0.9, label: '90%' },
      { position: 1, label: 'Bottom' }
    ];

    const results: ScrollPerformanceTest[] = [];

    for (const pos of positions) {
      const targetRow = Math.floor(dataSize * pos.position);
      
      this.startTimer(`scroll_${pos.label}`);
      await scrollCallback(pos.position);
      const scrollTime = this.endTimer(`scroll_${pos.label}`);

      const result: ScrollPerformanceTest = {
        position: pos.position,
        label: pos.label,
        targetRow,
        scrollTime
      };

      results.push(result);
      console.log(`📍 Scroll to ${pos.label} (row ${targetRow.toLocaleString()}): ${scrollTime.toFixed(2)}ms`);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('✅ Scroll performance test completed!');
    return results;
  }

  /**
   * Benchmark grid performance against targets
   */
  benchmarkPerformance(metrics: PerformanceMetrics, dataSize: number): {
    grade: string;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let grade = 'A';

    // Check total render time
    if (metrics.totalTime > 2000) {
      grade = 'D';
      recommendations.push('Consider reducing dataset size or implementing server-side pagination');
      recommendations.push('Check if virtual scrolling is enabled');
    } else if (metrics.totalTime > 1000) {
      grade = 'C';
      recommendations.push('Consider optimizing data preparation or enabling virtual scrolling');
    } else if (metrics.totalTime > 500) {
      grade = 'B';
      recommendations.push('Good performance, but could be optimized further');
    }

    // Check memory efficiency
    if (metrics.memoryEfficiency && metrics.memoryEfficiency > 1) {
      if (grade === 'A') grade = 'B';
      recommendations.push('High memory usage per row - consider data optimization');
    }

    // Data size specific recommendations
    if (dataSize > 100000) {
      recommendations.push('For datasets > 100K rows, ensure virtual scrolling is enabled');
      recommendations.push('Consider implementing progressive loading for better UX');
    }

    if (recommendations.length === 0) {
      recommendations.push('Excellent performance! Grid is well optimized.');
    }

    return { grade, recommendations };
  }

  /**
   * Log performance metrics in a formatted way
   */
  private logMetrics(metrics: PerformanceMetrics, dataSize: number, columnCount: number): void {
    console.log('\n🎯 === GRID PERFORMANCE REPORT ===');
    console.log(`📊 Dataset: ${dataSize.toLocaleString()} rows × ${columnCount} columns`);
    console.log(`⏱️  Data Setup: ${metrics.dataSetupTime.toFixed(2)}ms`);
    console.log(`⚙️  Grid Init: ${metrics.gridInitTime.toFixed(2)}ms`);
    console.log(`🎨 First Render: ${metrics.firstRenderTime.toFixed(2)}ms`);
    console.log(`🏁 Total Time: ${metrics.totalTime.toFixed(2)}ms`);
    
    if (metrics.memoryUsed) {
      console.log(`💾 Memory Used: ${metrics.memoryUsed.toFixed(2)} MB`);
    }
    
    if (metrics.memoryEfficiency) {
      console.log(`📈 Memory Efficiency: ${metrics.memoryEfficiency.toFixed(3)} MB per 1K rows`);
    }

    const benchmark = this.benchmarkPerformance(metrics, dataSize);
    console.log(`🎖️  Performance Grade: ${benchmark.grade}`);
    
    console.log('💡 Recommendations:');
    benchmark.recommendations.forEach(rec => console.log(`   • ${rec}`));
    
    console.log('===================================\n');
  }

  /**
   * Create a performance report for sharing
   */
  generateReport(metrics: PerformanceMetrics, dataSize: number, columnCount: number): string {
    const benchmark = this.benchmarkPerformance(metrics, dataSize);
    
    return `
# Cerious Grid Performance Report

## Test Configuration
- **Dataset**: ${dataSize.toLocaleString()} rows × ${columnCount} columns
- **Browser**: ${navigator.userAgent}
- **Test Date**: ${new Date().toISOString()}

## Performance Metrics
- **Data Setup Time**: ${metrics.dataSetupTime.toFixed(2)}ms
- **Grid Initialization**: ${metrics.gridInitTime.toFixed(2)}ms  
- **First Render Time**: ${metrics.firstRenderTime.toFixed(2)}ms
- **Total Time**: ${metrics.totalTime.toFixed(2)}ms
${metrics.memoryUsed ? `- **Memory Used**: ${metrics.memoryUsed.toFixed(2)} MB` : ''}
${metrics.memoryEfficiency ? `- **Memory Efficiency**: ${metrics.memoryEfficiency.toFixed(3)} MB per 1K rows` : ''}

## Performance Grade: ${benchmark.grade}

## Recommendations
${benchmark.recommendations.map(rec => `- ${rec}`).join('\n')}
    `.trim();
  }
}