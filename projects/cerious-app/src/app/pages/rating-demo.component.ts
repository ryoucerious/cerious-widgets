import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-rating-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RatingComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Rating" description="A star rating control with hover preview and keyboard support (arrows adjust, Delete clears).">
      <app-demo-section title="Basic" description="Click the current rating again to clear it." [code]="basicCode">
        <cw-rating [(ngModel)]="score" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Score: {{ score }}</span>
      </app-demo-section>

      <app-demo-section title="Custom star count" [code]="starsCode">
        <cw-rating [stars]="10" [(ngModel)]="wide" />
      </app-demo-section>

      <app-demo-section title="Readonly & disabled" [code]="readonlyCode">
        <cw-rating readonly [ngModel]="4" />
        <cw-rating disabled [ngModel]="2" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class RatingDemoComponent {
  score = 3;
  wide = 7;

  basicCode = `<cw-rating [(ngModel)]="score" />`;
  starsCode = `<cw-rating [stars]="10" [(ngModel)]="score" />`;
  readonlyCode = `<cw-rating readonly [ngModel]="4" />
<cw-rating disabled [ngModel]="2" />`;
}
