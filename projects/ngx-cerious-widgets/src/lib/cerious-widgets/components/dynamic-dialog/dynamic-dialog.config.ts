import { InjectionToken } from '@angular/core';

/** Options for {@link DynamicDialogService.open}. */
export interface DynamicDialogConfig<D = unknown> {
  /** Header text shown in the dialog chrome. Omit for a chromeless dialog. */
  header?: string;
  /** Arbitrary data passed to the opened component (read via the ref). */
  data?: D;
  /** Panel width (any CSS length). */
  width?: string;
  /** Show the ✕ close button (requires a header). Default `true`. */
  closable?: boolean;
  /** Close when the backdrop is clicked. Default `true`. */
  closeOnBackdrop?: boolean;
  /** Close on Escape. Default `true`. */
  closeOnEscape?: boolean;
}

/** DI token exposing the {@link DynamicDialogConfig} inside the opened component. */
export const DYNAMIC_DIALOG_CONFIG = new InjectionToken<DynamicDialogConfig>('DYNAMIC_DIALOG_CONFIG');
