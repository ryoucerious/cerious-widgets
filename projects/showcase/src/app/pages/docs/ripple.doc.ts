import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, RippleDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-ripple-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RippleDirective, ButtonComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="ripple"><doc-tab label="Features">
      <doc-section title="On a button" description="Click to see the ripple." [code]="code">
        <button cwButton cwRipple>Click me</button>
      </doc-section>

      <doc-section title="On any surface" [code]="surfaceCode">
        <div
          cwRipple
          rippleColor="rgba(99, 102, 241, 0.35)"
          style="display: flex; align-items: center; justify-content: center; width: 100%; max-width: 22rem; height: 8rem; border: 1px solid var(--cw-border); border-radius: var(--cw-radius); background: var(--cw-surface); cursor: pointer; user-select: none;"
        >
          Click anywhere in this card
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class RippleDocComponent {
  readonly apiProps = [
    { name: "rippleDisabled", type: "boolean", default: "false", description: "Disable the effect." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [

  ];

  code = `<button cwButton cwRipple>Click me</button>`;
  surfaceCode = `<div cwRipple rippleColor="rgba(99,102,241,0.35)">Card</div>`;
}
