import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonComponent, ConfirmDialogComponent, CwConfirmService } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-confirm-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConfirmDialogComponent, ButtonComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="confirm"><doc-tab label="Features">
      <doc-section title="Confirm an action" [code]="code">
        <button cwButton severity="danger" variant="outlined" (click)="remove()">Delete item…</button>
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">{{ result() }}</span>
      </doc-section>
    </doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
    <cw-confirm-dialog />
  `
})
export class ConfirmDocComponent {
  readonly apiProps = [

  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [

  ];

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
