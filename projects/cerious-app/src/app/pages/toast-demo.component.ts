import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent, CwToastService, ToastComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastComponent, ButtonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Toast" description="Floating notifications queued from a service. Place one <cw-toast /> outlet in the app shell.">
      <app-demo-section title="Severities" description="Each toast auto-dismisses after a few seconds." [code]="code">
        <button cwButton severity="success" (click)="notify('success')">Success</button>
        <button cwButton severity="secondary" variant="outlined" (click)="notify('info')">Info</button>
        <button cwButton severity="warn" (click)="notify('warn')">Warn</button>
        <button cwButton severity="danger" (click)="notify('danger')">Error</button>
      </app-demo-section>
    </app-demo-page>
    <cw-toast />
  `
})
export class ToastDemoComponent {
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
