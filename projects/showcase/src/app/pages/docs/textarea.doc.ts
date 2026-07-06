import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-textarea-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextareaDirective, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="textarea"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <textarea cwTextarea rows="3" placeholder="Write a note..." [(ngModel)]="note" style="width: 100%; max-width: 28rem;"></textarea>
      </doc-section>

      <doc-section title="Auto-resize" description="Grows as you type, up to 8 rows." [code]="autoCode">
        <textarea cwTextarea autoResize [maxRows]="8" rows="2" placeholder="Type several lines..." style="width: 100%; max-width: 28rem;"></textarea>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class TextareaDocComponent {
  readonly apiProps = [
    { name: "autoResize", type: "boolean", default: "false", description: "Grow the textarea to fit its content." },
    { name: "maxRows", type: "number", default: "0", description: "Maximum rows before the textarea scrolls (0 = unbounded)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [

  ];

  note = '';

  basicCode = `<textarea cwTextarea rows="3" [(ngModel)]="note"></textarea>`;
  autoCode = `<textarea cwTextarea autoResize [maxRows]="8" rows="2"></textarea>`;
}
