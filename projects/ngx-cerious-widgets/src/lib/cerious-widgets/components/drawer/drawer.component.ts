import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
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

/** Which edge the drawer slides in from. */
export type CwDrawerPosition = 'left' | 'right';

/**
 * A panel that slides in from the screen edge over a backdrop. Control it
 * with the `visible` input + `visibleChange` output (`[(visible)]`).
 *
 * Signal-based and OnPush, built on the CDK overlay foundation and styled
 * with `--cw-*` tokens.
 *
 * @example
 * <cw-drawer header="Filters" [(visible)]="open" position="right">…</cw-drawer>
 */
@Component({
  selector: 'cw-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  host: { 'class': 'cw-drawer' }
})
export class DrawerComponent implements OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('panel', { static: true }) private panelTemplate!: TemplateRef<unknown>;

  /** The drawer title. */
  readonly header = input<string>('');
  /** Show / hide the drawer (two-way: `[(visible)]`). */
  readonly visible = input(false, { transform: booleanAttribute });
  /** Which edge to slide in from. */
  readonly position = input<CwDrawerPosition>('left');
  /** Panel width (any CSS length). */
  readonly width = input<string>('20rem');

  /** Emitted when the drawer closes itself (✕, backdrop, Escape). */
  readonly visibleChange = output<boolean>();

  private readonly userVisible = signal<boolean | undefined>(undefined);
  private overlayRef?: OverlayRef;

  constructor() {
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
    const global = this.overlay.position().global();
    this.overlayRef = this.overlay.create({
      positionStrategy: this.position() === 'left' ? global.left('0') : global.right('0'),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      height: '100%',
      hasBackdrop: true,
      backdropClass: 'cw-dialog-backdrop'
    });
    this.overlayRef.attach(new TemplatePortal(this.panelTemplate, this.viewContainerRef));
    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
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
