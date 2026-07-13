import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/**
 * An image with an optional full-screen preview: click to open it centred on
 * a dimmed backdrop, with zoom in/out and rotate controls. Escape or a
 * backdrop click closes it.
 *
 * Signal-based and OnPush, built on the CDK overlay foundation and styled
 * with `--cw-*` tokens.
 *
 * @example
 * <cw-image src="photo.jpg" alt="A photo" preview width="220" />
 */
@Component({
  selector: 'cw-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  host: { 'class': 'cw-image' }
})
export class ImageComponent implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ image: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('image', this.api);
  }

  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('previewPanel', { static: true }) private previewTemplate!: TemplateRef<unknown>;

  /** Image source URL. */
  readonly src = input<string>('');
  /** Alt text. */
  readonly alt = input<string>('');
  /** Thumbnail width (any CSS length). */
  readonly width = input<string>('');
  /** Thumbnail height (any CSS length). */
  readonly height = input<string>('');
  /** Enable the click-to-preview overlay. */
  readonly preview = input(false, { transform: booleanAttribute });

  readonly zoom = signal(1);
  readonly rotation = signal(0);

  private overlayRef?: OverlayRef;

  open(): void {
    if (!this.preview() || this.overlayRef) {
      return;
    }
    this.zoom.set(1);
    this.rotation.set(0);
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: 'cw-image__backdrop'
    });
    this.overlayRef.attach(new TemplatePortal(this.previewTemplate, this.viewContainerRef));
    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  zoomBy(delta: number, event?: Event): void {
    event?.stopPropagation();
    this.zoom.update(z => Math.min(Math.max(z + delta, 0.25), 4));
  }

  rotate(event?: Event): void {
    event?.stopPropagation();
    this.rotation.update(r => (r + 90) % 360);
  }

  ngOnDestroy(): void {
    this.close();
  }
}
