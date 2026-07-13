import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CarouselComponent, CarouselItemDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-carousel-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CarouselComponent, CarouselItemDirective, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Carousel" description="Rotates through projected slides with prev/next controls, indicator dots and optional autoplay.">
      <app-demo-section title="Basic" [code]="basicCode">
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
      </app-demo-section>

      <app-demo-section title="Autoplay (3s)" [code]="autoCode">
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
      </app-demo-section>
    </app-demo-page>
  `
})
export class CarouselDemoComponent {
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
