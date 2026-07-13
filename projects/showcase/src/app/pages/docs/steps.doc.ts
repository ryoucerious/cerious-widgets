import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StepsComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-steps-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepsComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="steps"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <div style="width: 100%; max-width: 36rem;">
          <cw-steps [items]="items" [activeIndex]="1" />
        </div>
      </doc-section>

      <doc-section title="Clickable" description="Click a step to jump to it." [code]="clickableCode">
        <div style="width: 100%; max-width: 36rem;">
          <cw-steps [items]="items" [activeIndex]="0" clickable />
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class StepsDocComponent {
  readonly apiProps = [
    { name: "items", type: "readonly CwStepItem[]", default: "[]", description: "The steps, in order." },
    { name: "activeIndex", type: "number", default: "0", description: "Zero-based index of the current step." },
    { name: "clickable", type: "boolean", default: "false", description: "Allow clicking a step to activate it." }
  ];
  readonly apiEvents = [
    { name: "activeIndexChange", type: "number", description: "Emitted when the user activates a step (requires `clickable`)." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-primary", description: "Primary / brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-font", description: "Font family." }
  ];

  items = [{ label: 'Cart' }, { label: 'Shipping' }, { label: 'Payment' }, { label: 'Confirm' }];

  basicCode = `<cw-steps [items]="[{ label: 'Cart' }, { label: 'Shipping' }, { label: 'Payment' }]" [activeIndex]="1" />`;
  clickableCode = `<cw-steps [items]="items" clickable (activeIndexChange)="go($event)" />`;
}
