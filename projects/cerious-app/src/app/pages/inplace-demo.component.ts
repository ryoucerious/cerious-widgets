import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InplaceComponent, InputTextDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-inplace-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InplaceComponent, InputTextDirective, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Inplace" description="Click-to-edit: a compact display that reveals an editor when activated.">
      <app-demo-section title="Edit a value" [code]="code">
        <cw-inplace>
          <span cwInplaceDisplay>{{ name() || 'Click to edit name' }}</span>
          <input cwInplaceEditor cwInput [ngModel]="name()" (ngModelChange)="name.set($event)" placeholder="Your name" />
        </cw-inplace>
      </app-demo-section>
    </app-demo-page>
  `
})
export class InplaceDemoComponent {
  readonly name = signal('Olivia Rhye');

  code = `<cw-inplace>
  <span cwInplaceDisplay>{{ name }}</span>
  <input cwInplaceEditor cwInput [(ngModel)]="name" />
</cw-inplace>`;
}
