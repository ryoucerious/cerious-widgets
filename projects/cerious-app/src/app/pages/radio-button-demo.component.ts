import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-radio-button-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RadioButtonComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="RadioButton" description="A radio button over a real native input. Bind every radio in a group to the same model.">
      <app-demo-section title="Group" description="Radios sharing a name and model form a group." [code]="groupCode">
        <cw-radio-button name="size" value="sm" label="Small" [(ngModel)]="size" />
        <cw-radio-button name="size" value="md" label="Medium" [(ngModel)]="size" />
        <cw-radio-button name="size" value="lg" label="Large" [(ngModel)]="size" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Selected: {{ size ?? '—' }}</span>
      </app-demo-section>

      <app-demo-section title="Disabled" [code]="disabledCode">
        <cw-radio-button name="d" value="a" label="Disabled" disabled />
        <cw-radio-button name="d" value="b" label="Disabled, selected" disabled [ngModel]="'b'" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class RadioButtonDemoComponent {
  size: string | null = 'md';

  groupCode = `<cw-radio-button name="size" value="sm" label="Small" [(ngModel)]="size" />
<cw-radio-button name="size" value="md" label="Medium" [(ngModel)]="size" />
<cw-radio-button name="size" value="lg" label="Large" [(ngModel)]="size" />`;
  disabledCode = `<cw-radio-button name="d" value="a" label="Disabled" disabled />`;
}
