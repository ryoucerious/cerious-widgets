import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-input-text-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputTextDirective, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="input-text"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <input cwInput placeholder="Enter text..." [(ngModel)]="name" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Value: {{ name || '—' }}</span>
      </doc-section>

      <doc-section title="Textarea & disabled" [code]="moreCode">
        <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 20rem;">
          <textarea cwInput rows="3" placeholder="Multi-line..."></textarea>
          <input cwInput placeholder="Disabled" disabled />
        </div>
      </doc-section>
    </doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class InputTextDocComponent {
  readonly apiProps = [

  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [

  ];

  name = '';

  basicCode = `<input cwInput placeholder="Enter text..." [(ngModel)]="name" />`;
  moreCode = `<textarea cwInput rows="3"></textarea>
<input cwInput disabled />`;
}
