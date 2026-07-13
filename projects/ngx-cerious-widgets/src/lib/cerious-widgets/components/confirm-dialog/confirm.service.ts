import { Injectable, signal } from '@angular/core';

/** Options for a confirmation prompt. */
export interface CwConfirmOptions {
  /** Dialog title. */
  header?: string;
  /** The question. */
  message: string;
  /** Accept button label. */
  acceptLabel?: string;
  /** Reject button label. */
  rejectLabel?: string;
  /** Style the accept button as destructive. */
  danger?: boolean;
}

/** An in-flight confirmation awaiting an answer. */
export interface CwConfirmRequest {
  options: Required<CwConfirmOptions>;
  resolve: (accepted: boolean) => void;
}

/**
 * Promise-based confirmations for the `<cw-confirm-dialog />` outlet. Place
 * one outlet in the app shell and `await confirm(...)` from anywhere.
 *
 * @example
 * if (await this.confirmService.confirm({ message: 'Delete this row?', danger: true })) { … }
 */
@Injectable({ providedIn: 'root' })
export class CwConfirmService {
  private readonly _request = signal<CwConfirmRequest | null>(null);

  /** The pending request, if any (consumed by the outlet). */
  readonly request = this._request.asReadonly();

  /** Ask for confirmation; resolves true (accept) or false (reject/dismiss). */
  confirm(options: CwConfirmOptions): Promise<boolean> {
    // Settle any prior prompt as rejected before showing the new one.
    this._request()?.resolve(false);
    return new Promise<boolean>(resolve => {
      this._request.set({
        options: {
          header: options.header ?? 'Confirm',
          message: options.message,
          acceptLabel: options.acceptLabel ?? 'Confirm',
          rejectLabel: options.rejectLabel ?? 'Cancel',
          danger: options.danger ?? false
        },
        resolve
      });
    });
  }

  /** Settle the pending prompt (used by the outlet). */
  settle(accepted: boolean): void {
    const request = this._request();
    if (request) {
      this._request.set(null);
      request.resolve(accepted);
    }
  }
}
