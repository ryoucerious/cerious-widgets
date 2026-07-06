import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, InputGroupComponent, InputTextDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-input-group-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputGroupComponent, InputTextDirective, ButtonComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="input-group"><doc-tab label="Features">
      <doc-section title="Prefix & suffix" [code]="code">
        <cw-input-group>
          <span cwInputAddon>$</span>
          <input cwInput placeholder="0.00" [(ngModel)]="amount" />
          <span cwInputAddon>.00</span>
        </cw-input-group>
      </doc-section>

      <doc-section title="With a button" [code]="btnCode">
        <cw-input-group>
          <input cwInput placeholder="Search..." [(ngModel)]="query" />
          <button cwButton>Search</button>
        </cw-input-group>
      </doc-section>
    </doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class InputGroupDocComponent {
  readonly apiProps = [

  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface-raised", description: "Raised/overlay background." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-text-secondary", description: "Secondary text colour." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-font", description: "Font family." }
  ];

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
