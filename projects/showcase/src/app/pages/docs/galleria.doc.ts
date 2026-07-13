import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CwGalleriaImage, GalleriaComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-galleria-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GalleriaComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="galleria"><doc-tab label="Features">
      <doc-section title="Basic" [code]="code">
        <div style="width: 100%; max-width: 34rem;">
          <cw-galleria [images]="images" />
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class GalleriaDocComponent {
  readonly apiProps = [
    { name: "images", type: "readonly CwGalleriaImage[]", default: "[]", description: "The images." },
    { name: "activeIndex", type: "number", default: "0", description: "Initially active image index." },
    { name: "showThumbnails", type: "boolean", default: "true", description: "Show the thumbnail strip." },
    { name: "showNavigators", type: "boolean", default: "true", description: "Show the prev/next arrows on the main image." },
    { name: "circular", type: "boolean", default: "true", description: "Wrap from last to first." }
  ];
  readonly apiEvents = [
    { name: "activeIndexChange", type: "number", description: "Emitted when the active image changes." }
  ];
  readonly themeTokens = [
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-primary", description: "Primary / brand accent." },
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." }
  ];

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
