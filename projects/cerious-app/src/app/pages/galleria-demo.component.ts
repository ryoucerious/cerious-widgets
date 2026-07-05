import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CwGalleriaImage, GalleriaComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-galleria-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GalleriaComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Galleria" description="An image gallery with a large active image, prev/next controls, a counter and a clickable thumbnail strip.">
      <app-demo-section title="Basic" [code]="code">
        <div style="width: 100%; max-width: 34rem;">
          <cw-galleria [images]="images" />
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class GalleriaDemoComponent {
  // Inline SVG data URIs so the demo needs no external assets.
  private swatch(from: string, to: string, label: string): string {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
        </linearGradient></defs>
        <rect width="640" height="400" fill="url(#g)"/>
        <text x="320" y="215" font-family="sans-serif" font-size="40" fill="white" text-anchor="middle">${label}</text>
      </svg>`);
  }

  images: CwGalleriaImage[] = [
    { src: this.swatch('#6366f1', '#8b5cf6', 'One'), alt: 'One' },
    { src: this.swatch('#06b6d4', '#3b82f6', 'Two'), alt: 'Two' },
    { src: this.swatch('#22c55e', '#14b8a6', 'Three'), alt: 'Three' },
    { src: this.swatch('#f59e0b', '#ef4444', 'Four'), alt: 'Four' }
  ];

  code = `<cw-galleria [images]="photos" />`;
}
