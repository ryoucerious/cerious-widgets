import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent, CwToastService, ToastComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-toast-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastComponent, ButtonComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="toast"><doc-tab label="Features">
      <doc-section title="Severities" description="Each toast auto-dismisses after a few seconds." [code]="code">
        <button cwButton severity="success" (click)="notify('success')">Success</button>
        <button cwButton severity="secondary" variant="outlined" (click)="notify('info')">Info</button>
        <button cwButton severity="warn" (click)="notify('warn')">Warn</button>
        <button cwButton severity="danger" (click)="notify('danger')">Error</button>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
    <cw-toast />
  `
})
export class ToastDocComponent {
  readonly apiProps = [
    { name: "position", type: "CwToastPosition", default: "'top-right'", description: "Which screen corner the stack anchors to." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-shadow-lg", description: "Large elevation shadow." },
    { token: "--cw-font", description: "Font family." }
  ];

  private readonly toast = inject(CwToastService);

  notify(severity: 'success' | 'info' | 'warn' | 'danger'): void {
    const messages = {
      success: { summary: 'Saved', detail: 'All changes stored.' },
      info: { summary: 'Heads up', detail: 'A new version is available.' },
      warn: { summary: 'Careful', detail: 'Your session expires soon.' },
      danger: { summary: 'Error', detail: 'Something went wrong.' }
    };
    this.toast.show({ severity, ...messages[severity] });
  }

  code = `private toast = inject(CwToastService);

this.toast.show({ severity: 'success', summary: 'Saved', detail: 'All changes stored.' });

// once, in the app shell template:
<cw-toast />`;
}
