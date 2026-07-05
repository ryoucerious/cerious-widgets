import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImageComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-image-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImageComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Image" description="An image with an optional full-screen preview — click to open it with zoom and rotate controls.">
      <app-demo-section title="With preview" description="Click the image to open the viewer." [code]="code">
        <cw-image [src]="src" alt="Gradient sample" preview width="240" />
      </app-demo-section>

      <app-demo-section title="Plain (no preview)" [code]="plainCode">
        <cw-image [src]="src" alt="Gradient sample" width="160" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class ImageDemoComponent {
  // An inline SVG data URI so the demo needs no external asset.
  src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="480" height="300">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/>
      </linearGradient></defs>
      <rect width="480" height="300" fill="url(#g)"/>
      <text x="240" y="160" font-family="sans-serif" font-size="28" fill="white" text-anchor="middle">Cerious</text>
    </svg>`);

  code = `<cw-image src="photo.jpg" alt="A photo" preview width="240" />`;
  plainCode = `<cw-image src="photo.jpg" alt="A photo" width="160" />`;
}
