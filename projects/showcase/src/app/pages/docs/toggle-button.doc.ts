import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleButtonComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-toggle-button-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToggleButtonComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="toggle-button"><doc-tab label="Features">
      <doc-section title="Basic" description="A two-state button bound with ngModel. It shows onLabel while on, offLabel while off." [code]="basicCode">
        <cw-toggle-button onLabel="Following" offLabel="Follow" [(ngModel)]="following" />
        <span style="margin-left: 0.75rem; color: var(--cw-text-muted);">state: {{ following }}</span>
      </doc-section>

      <doc-section title="Icons or symbols" description="Labels are plain strings, use any text or symbol." [code]="iconCode">
        <cw-toggle-button onLabel="🔔 On" offLabel="🔕 Off" [(ngModel)]="notify" />
      </doc-section>

      <doc-section title="Disabled" [code]="disabledCode">
        <cw-toggle-button onLabel="On" offLabel="Off" disabled [ngModel]="true" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class ToggleButtonDocComponent {
  following = true;
  notify = false;

  readonly apiProps = [
    { name: 'onLabel', type: 'string', default: "'On'", description: 'Label shown while the toggle is on.' },
    { name: 'offLabel', type: 'string', default: "'Off'", description: 'Label shown while the toggle is off.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control (also settable via forms setDisabledState).' }
  ];
  readonly apiEvents = [
    { name: 'ngModelChange', type: 'EventEmitter<boolean>', description: 'Two-way bound boolean value (via ControlValueAccessor).' }
  ];
  readonly themeTokens = [
    { token: '--cw-primary', description: 'Fill of the on state.' },
    { token: '--cw-surface', description: 'Background of the off state.' },
    { token: '--cw-text', description: 'Label colour (off).' },
    { token: '--cw-text-on-accent', description: 'Label colour (on).' },
    { token: '--cw-radius', description: 'Corner radius.' }
  ];

  basicCode = `<cw-toggle-button onLabel="Following" offLabel="Follow" [(ngModel)]="following" />`;
  iconCode = `<cw-toggle-button onLabel="🔔 On" offLabel="🔕 Off" [(ngModel)]="notify" />`;
  disabledCode = `<cw-toggle-button onLabel="On" offLabel="Off" disabled [ngModel]="true" />`;
}
