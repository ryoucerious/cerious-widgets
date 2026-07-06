import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  ButtonComponent,
  DYNAMIC_DIALOG_CONFIG,
  DynamicDialogRef,
  DynamicDialogService
} from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

/** The component we open imperatively inside the dynamic dialog. */
@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <p style="margin: 0 0 1rem;">Editing <strong>{{ name }}</strong>. Pick a new role:</p>
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      @for (role of roles; track role) {
        <button cwButton severity="secondary" variant="outlined" (click)="choose(role)">{{ role }}</button>
      }
    </div>
  `
})
export class EditRoleComponent {
  private readonly ref = inject<DynamicDialogRef<string>>(DynamicDialogRef);
  private readonly config = inject(DYNAMIC_DIALOG_CONFIG);
  readonly name = (this.config.data as { name: string }).name;
  readonly roles = ['Admin', 'Editor', 'Viewer'];

  choose(role: string): void {
    this.ref.close(role);
  }
}

@Component({
  selector: 'app-dynamic-dialog-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="DynamicDialog" description="Open any component in a modal imperatively — pass data in, get a result back, no template wiring.">
      <app-demo-section title="Open a component & await its result" [code]="code">
        <button cwButton (click)="edit()">Edit user role</button>
        @if (result()) {
          <p style="margin-top: 0.75rem; color: var(--cw-text-muted);">New role: <strong>{{ result() }}</strong></p>
        }
      </app-demo-section>
    </app-demo-page>
  `
})
export class DynamicDialogDemoComponent {
  private readonly dialog = inject(DynamicDialogService);
  readonly result = signal<string>('');

  edit(): void {
    const ref = this.dialog.open<string>(EditRoleComponent, {
      header: 'Edit User',
      data: { name: 'Ada Lovelace' }
    });
    ref.closed.subscribe((role) => {
      if (role) {
        this.result.set(role);
      }
    });
  }

  code = `const ref = this.dialog.open(EditRoleComponent, {
  header: 'Edit User',
  data: { name: 'Ada Lovelace' }
});
ref.closed.subscribe(role => { ... });

// inside EditRoleComponent:
private ref = inject(DynamicDialogRef);
private config = inject(DYNAMIC_DIALOG_CONFIG);
this.ref.close('Admin');`;
}
