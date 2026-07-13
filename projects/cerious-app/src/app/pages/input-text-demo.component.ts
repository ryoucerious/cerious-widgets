import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-input-text-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputTextDirective, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="InputText" description="Token-styles native inputs and textareas — forms, keyboard and a11y stay native.">
      <app-demo-section title="Basic" [code]="basicCode">
        <input cwInput placeholder="Enter text..." [(ngModel)]="name" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Value: {{ name || '—' }}</span>
      </app-demo-section>

      <app-demo-section title="Textarea & disabled" [code]="moreCode">
        <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 20rem;">
          <textarea cwInput rows="3" placeholder="Multi-line..."></textarea>
          <input cwInput placeholder="Disabled" disabled />
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class InputTextDemoComponent {
  name = '';

  basicCode = `<input cwInput placeholder="Enter text..." [(ngModel)]="name" />`;
  moreCode = `<textarea cwInput rows="3"></textarea>
<input cwInput disabled />`;
}
