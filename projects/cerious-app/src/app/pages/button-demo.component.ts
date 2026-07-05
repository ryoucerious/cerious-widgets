import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Button" description="A themeable button applied to a native element, so focus, keyboard, and forms stay native.">
      <app-demo-section title="Severities" [code]="severityCode">
        <button cwButton>Primary</button>
        <button cwButton severity="secondary">Secondary</button>
        <button cwButton severity="success">Success</button>
        <button cwButton severity="warn">Warn</button>
        <button cwButton severity="danger">Danger</button>
      </app-demo-section>

      <app-demo-section title="Variants" description="Filled (default), outlined, or text." [code]="variantCode">
        <button cwButton>Filled</button>
        <button cwButton variant="outlined">Outlined</button>
        <button cwButton variant="text">Text</button>
      </app-demo-section>

      <app-demo-section title="Sizes" [code]="sizeCode">
        <button cwButton size="small">Small</button>
        <button cwButton>Normal</button>
        <button cwButton size="large">Large</button>
      </app-demo-section>

      <app-demo-section title="Loading & disabled" description="Loading shows a spinner and disables the button." [code]="stateCode">
        <button cwButton [loading]="true">Saving</button>
        <button cwButton severity="danger" variant="outlined" [disabled]="true">Disabled</button>
      </app-demo-section>
    </app-demo-page>
  `
})
export class ButtonDemoComponent {
  severityCode = `<button cwButton>Primary</button>
<button cwButton severity="success">Success</button>
<button cwButton severity="danger">Danger</button>`;

  variantCode = `<button cwButton>Filled</button>
<button cwButton variant="outlined">Outlined</button>
<button cwButton variant="text">Text</button>`;

  sizeCode = `<button cwButton size="small">Small</button>
<button cwButton size="large">Large</button>`;

  stateCode = `<button cwButton [loading]="true">Saving</button>
<button cwButton [disabled]="true">Disabled</button>`;
}
