import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KnobComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-knob-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KnobComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Knob" description="A circular dial input — drag around the arc or use the arrow keys.">
      <app-demo-section title="Basic" [code]="basicCode">
        <cw-knob [(ngModel)]="volume" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Volume: {{ volume }}</span>
      </app-demo-section>

      <app-demo-section title="Percentage & custom range" [code]="rangeCode">
        <cw-knob [(ngModel)]="progress" valueTemplate="{value}%" [size]="120" />
        <cw-knob [(ngModel)]="temp" [min]="-20" [max]="40" valueTemplate="{value}°" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class KnobDemoComponent {
  volume = 40;
  progress = 65;
  temp = 21;

  basicCode = `<cw-knob [(ngModel)]="volume" [min]="0" [max]="100" />`;
  rangeCode = `<cw-knob [(ngModel)]="progress" valueTemplate="{value}%" [size]="120" />`;
}
