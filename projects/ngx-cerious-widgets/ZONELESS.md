# Zoneless Angular Compatibility

This library supports both traditional Angular (with zones) and zoneless Angular applications.

## Overview

Angular 18+ introduced experimental support for zoneless change detection. This library provides dual compatibility to work seamlessly in both modes while maintaining backward compatibility with Angular 16+.

## Key Components

### ZonelessCompatService

The core service that automatically detects the Angular mode and provides compatibility methods:

```typescript
import { ZonelessCompatService } from 'ngx-cerious-widgets';

constructor(private zonelessCompat: ZonelessCompatService) {}

// Automatically works in both modes
this.zonelessCompat.runOutsideAngular(() => {
  // Performance-critical code
});

this.zonelessCompat.markForCheck(this.cdr); // Only triggers in zoneless mode
```

### ZonelessCompatibleComponent

Base component that all grid components extend for automatic zoneless support:

```typescript
import { ZonelessCompatibleComponent } from 'ngx-cerious-widgets';

export class MyComponent extends ZonelessCompatibleComponent {
  someMethod() {
    // Use inherited methods
    this.scheduleTask(() => {
      // This will trigger change detection in zoneless mode
    });
  }
}
```

## Detection Logic

The service automatically detects zoneless mode by checking:
- NgZone constructor name (`NoopNgZone`)
- Zone.js context availability

## Performance Benefits

In zoneless mode, the library:
- Uses `ChangeDetectorRef.markForCheck()` instead of relying on zones
- Schedules tasks with `setTimeout` instead of zone-patched APIs
- Provides manual change detection control for better performance

## Migration Guide

### For Library Users

No changes required! The library automatically detects your Angular mode and adapts accordingly.

### For Contributors

When adding new components:

1. Extend `ZonelessCompatibleComponent` instead of raw Angular components
2. Use `this.scheduleTask()` for async operations
3. Call `this.markForCheck()` after data updates
4. Use `this.runOutsideAngular()` for performance-critical code

## Example Usage

### Traditional Angular (Zoned)
```typescript
// Works as before - zones handle change detection
<cw-grid [data]="data"></cw-grid>
```

### Zoneless Angular
```typescript
// Automatically uses manual change detection
<cw-grid [data]="data"></cw-grid>
```

## API Reference

### ZonelessCompatService Methods

- `isZonelessMode: boolean` - Detection property
- `runOutsideAngular<T>(fn: () => T): T` - Run code outside Angular context
- `run<T>(fn: () => T): T` - Run code inside Angular context  
- `markForCheck(cdr: ChangeDetectorRef): void` - Trigger change detection (zoneless only)
- `detectChanges(cdr: ChangeDetectorRef): void` - Force change detection (zoneless only)
- `scheduleTask(fn: () => void, delay?: number): void` - Schedule async task

### ZonelessCompatibleComponent Methods

- `markForCheck(): void` - Mark component for check
- `detectChanges(): void` - Force change detection
- `scheduleTask(fn: () => void, delay?: number): void` - Schedule task with change detection
- `safeAsync<T>(operation: () => Promise<T>): Promise<T>` - Async operation with change detection

This ensures your application gets optimal performance in both traditional and zoneless Angular setups.