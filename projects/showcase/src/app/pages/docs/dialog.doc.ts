import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent, DialogComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-dialog-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, DialogComponent, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="dialog">
      <doc-tab label="Features">
        <doc-section title="Basic" description="A focus-trapped modal over a backdrop; close via ✕, Escape or backdrop click." [code]="basicCode">
          <button cwButton (click)="basic.set(true)">Open dialog</button>
          <cw-dialog header="Welcome" [(visible)]="basicVisible">
            <p>This is a focus-trapped modal dialog. Tab stays inside; Escape closes it.</p>
          </cw-dialog>
        </doc-section>

        <doc-section title="With footer actions" description="Project action buttons into the footer via [cwDialogFooter]." [code]="footerCode">
          <button cwButton severity="danger" (click)="confirm.set(true)">Delete item</button>
          <cw-dialog header="Delete item?" [(visible)]="confirmVisible" width="24rem">
            <p>This action cannot be undone. Are you sure you want to delete this item?</p>
            <div cwDialogFooter>
              <button cwButton severity="secondary" variant="outlined" (click)="confirm.set(false)">Cancel</button>
              <button cwButton severity="danger" (click)="confirm.set(false)">Delete</button>
            </div>
          </cw-dialog>
        </doc-section>
      </doc-tab>

      <doc-tab label="API">
        <doc-api [props]="props" [events]="events" />
      </doc-tab>

      <doc-tab label="Theming">
        <doc-theming [tokens]="tokens" />
      </doc-tab>
    </doc-page>
  `
})
export class DialogDocComponent {
  readonly basic = signal(false);
  readonly confirm = signal(false);

  // Two-way [(visible)] needs settable getters/setters bridging the signals.
  get basicVisible(): boolean { return this.basic(); }
  set basicVisible(v: boolean) { this.basic.set(v); }
  get confirmVisible(): boolean { return this.confirm(); }
  set confirmVisible(v: boolean) { this.confirm.set(v); }

  basicCode = `<button cwButton (click)="visible = true">Open dialog</button>
<cw-dialog header="Welcome" [(visible)]="visible">
  <p>This is a focus-trapped modal dialog.</p>
</cw-dialog>`;
  footerCode = `<cw-dialog header="Delete item?" [(visible)]="visible" width="24rem">
  <p>This action cannot be undone.</p>
  <div cwDialogFooter>
    <button cwButton severity="secondary" variant="outlined" (click)="visible = false">Cancel</button>
    <button cwButton severity="danger" (click)="remove()">Delete</button>
  </div>
</cw-dialog>`;

  props = [
    { name: 'visible', type: 'boolean', default: 'false', description: 'Show/hide (two-way via [(visible)]).' },
    { name: 'header', type: 'string', default: `''`, description: 'Title shown in the header.' },
    { name: 'width', type: 'string', default: `'28rem'`, description: 'Panel width (any CSS length).' },
    { name: 'closable', type: 'boolean', default: 'true', description: 'Show the ✕ button.' },
    { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close on backdrop click.' },
    { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape.' }
  ];
  events = [{ name: 'visibleChange', type: 'boolean', description: 'Emitted when the dialog closes itself.' }];
  tokens = [
    { token: '--cw-surface', description: 'Panel background (frosted translucent under Frost).' },
    { token: '--cw-dialog-backdrop', description: 'Backdrop scrim (light veil under Frost).' },
    { token: '--cw-shadow-lg', description: 'Panel elevation.' }
  ];
}
