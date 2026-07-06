import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, StyleClassDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-style-class-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, StyleClassDirective, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="StyleClass" description="Toggle CSS classes on a target element from a trigger — show/hide panels without any component code.">
      <app-demo-section title="Toggle a panel" [code]="code">
        <button cwButton [cwStyleClass]="'@next'" toggleClass="is-open">Toggle panel</button>
        <div class="collapsible">
          <p style="margin: 0;">I'm toggled purely by the <code>cwStyleClass</code> directive — no <code>*ngIf</code>, no signal.</p>
        </div>
      </app-demo-section>
    </app-demo-page>
  `,
  styles: [`
    .collapsible {
      max-height: 0;
      overflow: hidden;
      margin-top: 0.75rem;
      padding: 0 1rem;
      border-radius: var(--cw-radius);
      background: var(--cw-surface-sunken);
      transition: max-height 0.3s ease, padding 0.3s ease;
    }
    .collapsible.is-open {
      max-height: 140px;
      padding: 1rem;
    }
  `]
})
export class StyleClassDemoComponent {
  code = `<button [cwStyleClass]="'@next'" toggleClass="is-open">Toggle</button>
<div class="collapsible">…</div>

/* target keywords: @next, @prev, @parent, @grandparent, or any CSS selector */`;
}
