import { A11yModule } from '@angular/cdk/a11y';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  untracked,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/**
 * A modal dialog: a centred, focus-trapped card over a backdrop. Control it
 * with the `visible` input + `visibleChange` output (`[(visible)]`). Project
 * body content directly and footer actions via `[cwDialogFooter]`.
 *
 * Signal-based and OnPush, built on the CDK overlay foundation and styled
 * with `--cw-*` tokens.
 *
 * @example
 * <cw-dialog header="Confirm Action" [(visible)]="show">
 *   Are you sure you want to delete this item?
 *   <div cwDialogFooter>
 *     <button cwButton severity="secondary" variant="outlined" (click)="show = false">Cancel</button>
 *     <button cwButton severity="danger" (click)="confirm()">Delete</button>
 *   </div>
 * </cw-dialog>
 */
@Component({
  selector: 'cw-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  host: { 'class': 'cw-dialog' }
})
export class DialogComponent implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ dialog: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('panel', { static: true }) private panelTemplate!: TemplateRef<unknown>;

  /** The dialog title. */
  readonly header = input<string>('');
  /** Accessible name when there is no visible `header` (headerless dialogs). */
  readonly ariaLabel = input<string>('');
  /** Show / hide the dialog (two-way: `[(visible)]`). */
  readonly visible = input(false, { transform: booleanAttribute });
  /** Panel width (any CSS length). */
  readonly width = input<string>('28rem');
  /** Show the ✕ button in the header. */
  readonly closable = input(true, { transform: booleanAttribute });
  /** Close when the backdrop is clicked. */
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  /** Close on Escape. */
  readonly closeOnEscape = input(true, { transform: booleanAttribute });

  /** Emitted when the dialog closes itself (✕, backdrop, Escape). */
  readonly visibleChange = output<boolean>();

  private readonly userVisible = signal<boolean | undefined>(undefined);
  private overlayRef?: OverlayRef;

  constructor() {
    providePluginHost('dialog', this.api);
    // The `visible` input resets user intent; the effect syncs the overlay.
    effect(() => {
      const shouldShow = this.visible();
      untracked(() => {
        this.userVisible.set(undefined);
        shouldShow ? this.attach() : this.detach();
      });
    });
    effect(() => {
      const user = this.userVisible();
      if (user !== undefined) {
        untracked(() => (user ? this.attach() : this.detach()));
      }
    });
  }

  close(): void {
    this.userVisible.set(false);
    this.visibleChange.emit(false);
  }

  private attach(): void {
    if (this.overlayRef) {
      return;
    }
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: 'cw-dialog-backdrop'
    });
    this.overlayRef.attach(new TemplatePortal(this.panelTemplate, this.viewContainerRef));
    this.overlayRef.backdropClick().subscribe(() => {
      if (this.closeOnBackdrop()) {
        this.close();
      }
    });
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape' && this.closeOnEscape()) {
        this.close();
      }
    });
  }

  private detach(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  ngOnDestroy(): void {
    this.detach();
  }
}
