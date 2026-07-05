import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent, DialogComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-dialog-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogComponent, ButtonComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Dialog" description="A centred, focus-trapped modal over a backdrop. Escape, ✕ and backdrop click all close it.">
      <app-demo-section title="Confirm pattern" [code]="basicCode">
        <button cwButton severity="danger" variant="outlined" (click)="show.set(true)">Delete item…</button>
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">{{ result() }}</span>

        <cw-dialog header="Confirm Action" [visible]="show()" (visibleChange)="show.set($event)">
          Are you sure you want to delete this item? This action cannot be undone.
          <div cwDialogFooter>
            <button cwButton severity="secondary" variant="outlined" (click)="close(false)">Cancel</button>
            <button cwButton severity="danger" (click)="close(true)">Delete</button>
          </div>
        </cw-dialog>
      </app-demo-section>
    </app-demo-page>
  `
})
export class DialogDemoComponent {
  readonly show = signal(false);
  readonly result = signal('');

  close(confirmed: boolean): void {
    this.result.set(confirmed ? 'Deleted.' : 'Cancelled.');
    this.show.set(false);
  }

  basicCode = `<cw-dialog header="Confirm Action" [(visible)]="show">
  Are you sure you want to delete this item?
  <div cwDialogFooter>
    <button cwButton severity="secondary" variant="outlined" (click)="show = false">Cancel</button>
    <button cwButton severity="danger" (click)="confirm()">Delete</button>
  </div>
</cw-dialog>`;
}
