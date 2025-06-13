import { effect, EventEmitter, Injectable, Signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SignalHelperService {

  // Helper to convert a signal to an EventEmitter for Angular compatibility
  toEventEmitter<T>(sig: Signal<T>) {
    const emitter = new EventEmitter<T>();
    effect(() => {
      const value = sig();
      if (value !== null && value !== undefined) {
        emitter.emit(value);
      }
    });
    return emitter;
  }
}
