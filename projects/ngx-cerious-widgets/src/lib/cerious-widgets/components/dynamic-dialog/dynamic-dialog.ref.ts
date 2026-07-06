import { Subject } from 'rxjs';

/**
 * Handle to a dialog opened via {@link DynamicDialogService}. Injected into the
 * component rendered inside the dialog so it can read config and close itself
 * with a result.
 */
export class DynamicDialogRef<R = unknown> {
  private readonly _closed = new Subject<R | undefined>();

  /** Emits once with the result (or `undefined`) when the dialog closes. */
  readonly closed = this._closed.asObservable();

  /** Internal: invoked by the service to actually tear down the overlay. */
  onClose?: (result?: R) => void;

  /** Close the dialog, optionally returning a result to the opener. */
  close(result?: R): void {
    this.onClose?.(result);
    this._closed.next(result);
    this._closed.complete();
  }
}
