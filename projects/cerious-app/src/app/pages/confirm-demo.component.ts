import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonComponent, ConfirmDialogComponent, CwConfirmService } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-confirm-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConfirmDialogComponent, ButtonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="ConfirmDialog" description="Promise-based confirmations from a service. Place one <cw-confirm-dialog /> outlet in the app shell.">
      <app-demo-section title="Confirm an action" [code]="code">
        <button cwButton severity="danger" variant="outlined" (click)="remove()">Delete item…</button>
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">{{ result() }}</span>
      </app-demo-section>
    </app-demo-page>
    <cw-confirm-dialog />
  `
})
export class ConfirmDemoComponent {
  private readonly confirmService = inject(CwConfirmService);
  readonly result = signal('');

  async remove(): Promise<void> {
    const ok = await this.confirmService.confirm({
      header: 'Confirm Action',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      acceptLabel: 'Delete',
      danger: true
    });
    this.result.set(ok ? 'Deleted.' : 'Cancelled.');
  }

  code = `private confirmService = inject(CwConfirmService);

const ok = await this.confirmService.confirm({
  message: 'Delete this item?',
  danger: true
});

// once, in the app shell template:
<cw-confirm-dialog />`;
}
