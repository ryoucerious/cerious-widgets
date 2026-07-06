import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, FocusTrapDirective, InputTextDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-focus-trap-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, FocusTrapDirective, InputTextDirective, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="focus-trap"><doc-tab label="Features">
      <doc-section title="Tab stays inside the panel" [code]="code">
        <p style="color: var(--cw-text-muted);">Focus starts inside; Tab and Shift+Tab wrap at the edges.</p>
        <div class="trap" cwFocusTrap>
          <input cwInputText placeholder="First field" />
          <input cwInputText placeholder="Second field" />
          <button cwButton severity="secondary" variant="outlined">Cancel</button>
          <button cwButton>Confirm</button>
        </div>
        <button cwButton variant="text" style="margin-top: 0.75rem;">Outside — Tab never reaches me</button>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
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
export class FocusTrapDocComponent {
  readonly apiProps = [
    { name: "cwFocusTrapDisabled", type: "boolean", default: "false", description: "Disable the trap without removing the directive." },
    { name: "cwFocusTrapAutoFocus", type: "boolean", default: "true", description: "Move focus to the first focusable element on init." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [

  ];

  code = `<div cwFocusTrap>
  <input /> <button>Cancel</button> <button>Confirm</button>
</div>

<!-- opt out: [cwFocusTrapDisabled]="true"  -->
<!-- no auto-focus: [cwFocusTrapAutoFocus]="false" -->`;
}
