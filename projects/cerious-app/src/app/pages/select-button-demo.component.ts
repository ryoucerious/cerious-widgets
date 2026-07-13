import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonComponent, ToggleButtonComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-select-button-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectButtonComponent, ToggleButtonComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="SelectButton & ToggleButton" description="Segmented single-choice buttons, and a two-state toggle button.">
      <app-demo-section title="SelectButton" [code]="selectCode">
        <cw-select-button [options]="['Low', 'Medium', 'High']" [(ngModel)]="priority" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Priority: {{ priority ?? '—' }}</span>
      </app-demo-section>

      <app-demo-section title="ToggleButton" [code]="toggleCode">
        <cw-toggle-button onLabel="Following" offLabel="Follow" [(ngModel)]="following" />
        <cw-toggle-button onLabel="Muted" offLabel="Mute" [ngModel]="true" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class SelectButtonDemoComponent {
  priority: string | null = 'Medium';
  following = false;

  selectCode = `<cw-select-button [options]="['Low', 'Medium', 'High']" [(ngModel)]="priority" />`;
  toggleCode = `<cw-toggle-button onLabel="Following" offLabel="Follow" [(ngModel)]="following" />`;
}
