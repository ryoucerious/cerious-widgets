import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPickerComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-color-picker-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ColorPickerComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="ColorPicker" description="A colour picker with the native picker, a hex field and a preset palette. The model is a hex string.">
      <app-demo-section title="Basic" [code]="basicCode">
        <cw-color-picker [(ngModel)]="brand" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Value: {{ brand }}</span>
      </app-demo-section>

      <app-demo-section title="Disabled" [code]="disabledCode">
        <cw-color-picker [ngModel]="'#22c55e'" disabled />
      </app-demo-section>
    </app-demo-page>
  `
})
export class ColorPickerDemoComponent {
  brand = '#6366f1';

  basicCode = `<cw-color-picker [(ngModel)]="brand" />`;
  disabledCode = `<cw-color-picker [ngModel]="'#22c55e'" disabled />`;
}
