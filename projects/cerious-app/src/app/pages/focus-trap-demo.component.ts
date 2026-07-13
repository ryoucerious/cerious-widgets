import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, FocusTrapDirective, InputTextDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-focus-trap-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, FocusTrapDirective, InputTextDirective, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="FocusTrap" description="Cycle Tab focus within a region — a dependency-free trap for custom overlays, popovers and inline panels.">
      <app-demo-section title="Tab stays inside the panel" [code]="code">
        <p style="color: var(--cw-text-muted);">Focus starts inside; Tab and Shift+Tab wrap at the edges.</p>
        <div class="trap" cwFocusTrap>
          <input cwInputText placeholder="First field" />
          <input cwInputText placeholder="Second field" />
          <button cwButton severity="secondary" variant="outlined">Cancel</button>
          <button cwButton>Confirm</button>
        </div>
        <button cwButton variant="text" style="margin-top: 0.75rem;">Outside — Tab never reaches me</button>
      </app-demo-section>
    </app-demo-page>
  `,
  styles: [`
    .trap {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      padding: 1.25rem;
      border: 1px dashed var(--cw-border-strong);
      border-radius: var(--cw-radius);
      background: var(--cw-surface-sunken);
    }
  `]
})
export class FocusTrapDemoComponent {
  code = `<div cwFocusTrap>
  <input /> <button>Cancel</button> <button>Confirm</button>
</div>

<!-- opt out: [cwFocusTrapDisabled]="true"  -->
<!-- no auto-focus: [cwFocusTrapAutoFocus]="false" -->`;
}
