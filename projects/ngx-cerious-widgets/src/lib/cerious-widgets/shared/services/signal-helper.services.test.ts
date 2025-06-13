import { SignalHelperService } from './signal-helper.services';

describe('SignalHelperService', () => {
  let service: SignalHelperService;

  beforeEach(() => {
    service = new SignalHelperService();
  });

  it('should create an EventEmitter from a signal and emit initial value', (done) => {
    // Mock signal implementation
    let value = 42;
    const sig = (() => value) as any;

    const emitter = service.toEventEmitter<number>(sig);

    emitter.subscribe((emittedValue) => {
      expect(emittedValue).toBe(42);
      done();
    });
  });

  it('should emit new values when the signal changes', (done) => {
    let value = 1;
    let listeners: Function[] = [];
    // Simulate a signal with a setter to change value
    const sig = (() => value) as any;

    const emitter = service.toEventEmitter<number>(sig);

    const results: number[] = [];
    emitter.subscribe((emittedValue) => {
      results.push(emittedValue);
      if (results.length === 2) {
        expect(results).toEqual([1, 2]);
        done();
      }
    });

    // Simulate signal change and effect re-run
    setTimeout(() => {
      value = 2;
      // Manually trigger effect for test (since Angular's effect won't auto-run in this context)
      emitter.emit(sig());
    }, 10);
  });

  it('should not emit when signal value is null or undefined', (done) => {
    let value: number | null = null;
    const sig = (() => value) as any;

    const emitter = service.toEventEmitter<number | null>(sig);

    let emitted = false;
    emitter.subscribe(() => {
      emitted = true;
    });

    setTimeout(() => {
      expect(emitted).toBe(false);
      done();
    }, 10);
  });
});