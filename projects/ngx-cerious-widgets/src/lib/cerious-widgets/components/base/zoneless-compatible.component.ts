import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { ZonelessCompatService } from '../../shared/services/zoneless-compat.service';

/**
 * Base component that provides zoneless compatibility for all grid components
 * All grid components should extend this to get automatic zoneless support
 */
@Component({
  template: '',
  standalone: true
})
export abstract class ZonelessCompatibleComponent implements OnDestroy {
  protected readonly zonelessCompat = inject(ZonelessCompatService);
  protected readonly cdr = inject(ChangeDetectorRef);

  /**
   * Whether the application is running in zoneless mode
   */
  protected get isZoneless(): boolean {
    return this.zonelessCompat.isZonelessMode;
  }

  /**
   * Runs code outside Angular zone if zones are enabled
   */
  protected runOutsideAngular<T>(fn: () => T): T {
    return this.zonelessCompat.runOutsideAngular(fn);
  }

  /**
   * Runs code inside Angular zone if zones are enabled
   */
  protected runInZone<T>(fn: () => T): T {
    return this.zonelessCompat.run(fn);
  }

  /**
   * Triggers change detection (zoneless) or does nothing (zoned)
   */
  protected markForCheck(): void {
    this.zonelessCompat.markForCheck(this.cdr);
  }

  /**
   * Forces change detection (zoneless) or does nothing (zoned)
   */
  protected detectChanges(): void {
    this.zonelessCompat.detectChanges(this.cdr);
  }

  /**
   * Schedules a task using the appropriate method for the current mode
   */
  protected scheduleTask(fn: () => void, delay = 0): void {
    this.zonelessCompat.scheduleTask(() => {
      fn();
      this.markForCheck(); // Ensure change detection in zoneless mode
    }, delay);
  }

  /**
   * Safely schedules an async operation that may require change detection
   */
  protected async safeAsync<T>(operation: () => Promise<T>): Promise<T> {
    try {
      const result = await operation();
      this.markForCheck();
      return result;
    } catch (error) {
      this.markForCheck();
      throw error;
    }
  }

  ngOnDestroy(): void {
    // Ensure any pending tasks are cleaned up in zoneless mode
    if (this.isZoneless) {
      this.markForCheck();
    }
  }
}