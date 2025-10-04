import { Injectable, NgZone, ChangeDetectorRef, inject } from '@angular/core';

/**
 * Service to handle compatibility between zoned and zoneless Angular applications
 * Provides utilities for change detection and zone management
 */
@Injectable({
  providedIn: 'root'
})
export class ZonelessCompatService {
  private zone = inject(NgZone);
  private isZoneless: boolean;

  constructor() {
    // Detect if we're running in zoneless mode
    // In zoneless mode, NgZone is typically a NoopNgZone
    this.isZoneless = this.zone.constructor.name === 'NoopNgZone' || 
                     (this.zone as any).isStable === undefined;
  }

  /**
   * Returns true if the application is running in zoneless mode
   */
  get isZonelessMode(): boolean {
    return this.isZoneless;
  }

  /**
   * Runs code outside Angular zone if zones are enabled, otherwise runs immediately
   */
  runOutsideAngular<T>(fn: () => T): T {
    if (this.isZoneless) {
      return fn();
    }
    return this.zone.runOutsideAngular(fn);
  }

  /**
   * Runs code inside Angular zone if zones are enabled, otherwise runs immediately
   */
  run<T>(fn: () => T): T {
    if (this.isZoneless) {
      return fn();
    }
    return this.zone.run(fn);
  }

  /**
   * Triggers change detection manually in zoneless mode, or does nothing in zoned mode
   */
  markForCheck(cdr?: ChangeDetectorRef): void {
    if (this.isZoneless && cdr) {
      cdr.markForCheck();
    }
  }

  /**
   * Detects changes manually in zoneless mode, or does nothing in zoned mode
   */
  detectChanges(cdr?: ChangeDetectorRef): void {
    if (this.isZoneless && cdr) {
      cdr.detectChanges();
    }
  }

  /**
   * Schedules a task using the appropriate method for the current mode
   * In zoneless mode, uses requestAnimationFrame for better performance
   */
  scheduleTask(fn: () => void, delay = 0): void {
    if (this.isZoneless) {
      if (delay === 0) {
        requestAnimationFrame(fn);
      } else {
        setTimeout(fn, delay);
      }
    } else {
      // In zoned mode, use zone.runOutsideAngular for performance
      this.zone.runOutsideAngular(() => {
        if (delay === 0) {
          requestAnimationFrame(() => this.zone.run(fn));
        } else {
          setTimeout(() => this.zone.run(fn), delay);
        }
      });
    }
  }
}