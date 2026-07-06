import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-editor-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EditorComponent, FormsModule, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="editor"><doc-tab label="Features">
      <doc-section title="Basic" description="Select text and use the toolbar to format it." [code]="code">
        <div style="width: 100%; max-width: 34rem;">
          <cw-editor [(ngModel)]="html" placeholder="Write something..." />
          <p style="color: var(--cw-text-muted); font-size: 0.8125rem; margin-top: 0.5rem;">HTML length: {{ html.length }}</p>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class EditorDocComponent {
  readonly apiProps = [
    { name: "placeholder", type: "string", default: "''", description: "Placeholder shown while empty." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable editing (also settable via forms `setDisabledState`)." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-surface-raised", description: "Raised/overlay background." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-divider", description: "Divider line colour." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-secondary", description: "Secondary text colour." }
  ];

  html = '<p>Edit <b>this</b> text.</p>';

  code = `<cw-editor [(ngModel)]="html" placeholder="Write something..." />`;
}
