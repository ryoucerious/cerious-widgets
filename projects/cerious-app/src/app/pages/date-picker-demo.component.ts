import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-date-picker-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="DatePicker" description="A calendar date picker with month navigation, min/max ranges and a plugin API.">
      <app-demo-section title="Basic" description="Bind a Date with ngModel." [code]="basicCode">
        <cw-date-picker [(ngModel)]="created" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Value: {{ created ? created.toDateString() : '—' }}</span>
      </app-demo-section>

      <app-demo-section title="Min / max" description="Days outside the range are disabled." [code]="rangeCode">
        <cw-date-picker [min]="today" placeholder="Delivery date" [(ngModel)]="delivery" />
      </app-demo-section>

      <app-demo-section title="Disabled" [code]="disabledCode">
        <cw-date-picker disabled placeholder="Disabled" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class DatePickerDemoComponent {
  created: Date | null = new Date();
  delivery: Date | null = null;
  today = new Date();

  basicCode = `<cw-date-picker [(ngModel)]="created" />`;
  rangeCode = `<cw-date-picker [min]="today" [(ngModel)]="delivery" />`;
  disabledCode = `<cw-date-picker disabled />`;
}
