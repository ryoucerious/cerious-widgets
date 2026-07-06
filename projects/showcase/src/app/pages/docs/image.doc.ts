import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImageComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-image-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImageComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="image"><doc-tab label="Features">
      <doc-section title="With preview" description="Click the image to open the viewer." [code]="code">
        <cw-image [src]="src" alt="Gradient sample" preview width="240" />
      </doc-section>

      <doc-section title="Plain (no preview)" [code]="plainCode">
        <cw-image [src]="src" alt="Gradient sample" width="160" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class ImageDocComponent {
  readonly apiProps = [
    { name: "src", type: "string", default: "''", description: "Image source URL." },
    { name: "alt", type: "string", default: "''", description: "Alt text." },
    { name: "width", type: "string", default: "''", description: "Thumbnail width (any CSS length)." },
    { name: "height", type: "string", default: "''", description: "Thumbnail height (any CSS length)." },
    { name: "preview", type: "boolean", default: "false", description: "Enable the click-to-preview overlay." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-shadow-lg", description: "Large elevation shadow." },
    { token: "--cw-font", description: "Font family." }
  ];

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
