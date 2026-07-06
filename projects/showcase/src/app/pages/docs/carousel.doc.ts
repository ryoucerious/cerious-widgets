import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CarouselComponent, CarouselItemDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-carousel-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CarouselComponent, CarouselItemDirective, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="carousel"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <div style="width: 100%; max-width: 28rem;">
          <cw-carousel>
            @for (slide of slides; track slide.title) {
              <ng-template cwCarouselItem>
                <div [style.background]="slide.bg" style="display: flex; align-items: center; justify-content: center; height: 10rem; color: #fff; font-size: 1.25rem; font-weight: 600;">
                  {{ slide.title }}
                </div>
              </ng-template>
            }
          </cw-carousel>
        </div>
      </doc-section>

      <doc-section title="Autoplay (3s)" [code]="autoCode">
        <div style="width: 100%; max-width: 28rem;">
          <cw-carousel [autoplay]="3000">
            @for (slide of slides; track slide.title) {
              <ng-template cwCarouselItem>
                <div [style.background]="slide.bg" style="display: flex; align-items: center; justify-content: center; height: 10rem; color: #fff; font-size: 1.25rem; font-weight: 600;">
                  {{ slide.title }}
                </div>
              </ng-template>
            }
          </cw-carousel>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class CarouselDocComponent {
  readonly apiProps = [
    { name: "activeIndex", type: "number", default: "0", description: "Initially active slide index." },
    { name: "circular", type: "boolean", default: "true", description: "Wrap from the last slide to the first (and vice versa)." },
    { name: "autoplay", type: "number", default: "0", description: "Autoplay interval in ms; 0 disables it." },
    { name: "showIndicators", type: "boolean", default: "true", description: "Show the indicator dots." },
    { name: "showNavigators", type: "boolean", default: "true", description: "Show the prev/next arrows." }
  ];
  readonly apiEvents = [
    { name: "activeIndexChange", type: "number", description: "Emitted when the active slide changes." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-primary", description: "Primary / brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-secondary", description: "Secondary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." }
  ];

  slides = [
    { title: 'Mountains', bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { title: 'Ocean', bg: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
    { title: 'Forest', bg: 'linear-gradient(135deg, #22c55e, #14b8a6)' }
  ];

  basicCode = `<cw-carousel>
  <ng-template cwCarouselItem>Slide one</ng-template>
  <ng-template cwCarouselItem>Slide two</ng-template>
</cw-carousel>`;
  autoCode = `<cw-carousel [autoplay]="3000">…</cw-carousel>`;
}
