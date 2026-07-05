import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, InputGroupComponent, InputTextDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-input-group-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputGroupComponent, InputTextDirective, ButtonComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="InputGroup" description="Seams addons — text, icons or buttons — around a control into one bordered group.">
      <app-demo-section title="Prefix & suffix" [code]="code">
        <cw-input-group>
          <span cwInputAddon>$</span>
          <input cwInput placeholder="0.00" [(ngModel)]="amount" />
          <span cwInputAddon>.00</span>
        </cw-input-group>
      </app-demo-section>

      <app-demo-section title="With a button" [code]="btnCode">
        <cw-input-group>
          <input cwInput placeholder="Search..." [(ngModel)]="query" />
          <button cwButton>Search</button>
        </cw-input-group>
      </app-demo-section>
    </app-demo-page>
  `
})
export class InputGroupDemoComponent {
  amount = '';
  query = '';

  code = `<cw-input-group>
  <span cwInputAddon>$</span>
  <input cwInput placeholder="0.00" />
  <span cwInputAddon>.00</span>
</cw-input-group>`;
  btnCode = `<cw-input-group>
  <input cwInput placeholder="Search..." />
  <button cwButton>Search</button>
</cw-input-group>`;
}
