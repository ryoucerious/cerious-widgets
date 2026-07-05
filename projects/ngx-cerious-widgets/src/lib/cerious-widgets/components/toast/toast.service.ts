import { Injectable, signal } from '@angular/core';
import { CwSeverity } from '../severity';

/** A toast notification. */
export interface CwToastMessage {
  /** Intent colour and icon. */
  severity?: CwSeverity;
  /** The bold headline. */
  summary: string;
  /** Optional secondary line. */
  detail?: string;
  /** Auto-dismiss after this many ms (0 = sticky). Default 4000. */
  duration?: number;
}

/** A queued toast with its assigned id. */
export interface CwActiveToast extends CwToastMessage {
  id: number;
}

/**
 * Queues toast notifications for the `<cw-toast />` outlet. Place one outlet
 * in the app shell and call `show(...)` from anywhere.
 *
 * @example
 * toast.show({ severity: 'success', summary: 'Saved', detail: 'All changes stored.' });
 */
@Injectable({ providedIn: 'root' })
export class CwToastService {
  private nextId = 1;
  private readonly _toasts = signal<CwActiveToast[]>([]);

  /** The active toasts, newest last. */
  readonly toasts = this._toasts.asReadonly();

  /** Queue a toast; returns its id. */
  show(message: CwToastMessage): number {
    const toast: CwActiveToast = { severity: 'info', duration: 4000, ...message, id: this.nextId++ };
    this._toasts.update(list => [...list, toast]);
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.dismiss(toast.id), toast.duration);
    }
    return toast.id;
  }

  /** Remove one toast by id. */
  dismiss(id: number): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  /** Remove all toasts. */
  clear(): void {
    this._toasts.set([]);
  }
}
