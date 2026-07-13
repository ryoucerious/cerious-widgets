import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, RippleDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-ripple-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RippleDirective, ButtonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Ripple" description="A directive that adds a material-style ripple expanding from the click point on any element.">
      <app-demo-section title="On a button" description="Click to see the ripple." [code]="code">
        <button cwButton cwRipple>Click me</button>
      </app-demo-section>

      <app-demo-section title="On any surface" [code]="surfaceCode">
        <div
          cwRipple
          rippleColor="rgba(99, 102, 241, 0.35)"
          style="display: flex; align-items: center; justify-content: center; width: 100%; max-width: 22rem; height: 8rem; border: 1px solid var(--cw-border); border-radius: var(--cw-radius); background: var(--cw-surface); cursor: pointer; user-select: none;"
        >
          Click anywhere in this card
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class RippleDemoComponent {
  code = `<button cwButton cwRipple>Click me</button>`;
  surfaceCode = `<div cwRipple rippleColor="rgba(99,102,241,0.35)">Card</div>`;
}
