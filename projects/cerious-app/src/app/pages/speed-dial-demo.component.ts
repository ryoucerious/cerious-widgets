import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwSpeedDialItem, SpeedDialComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-speed-dial-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpeedDialComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="SpeedDial" description="A floating action button that fans out a set of actions when opened.">
      <app-demo-section title="Fan up" description="Click the button to reveal the actions." [code]="code">
        <div style="min-height: 12rem; display: flex; align-items: flex-end; padding: 1rem;">
          <cw-speed-dial [items]="items" direction="up" (itemClick)="last.set($event.label)" />
          <span style="margin-left: 1rem; color: var(--cw-text-muted); font-size: 0.875rem;">Last: {{ last() }}</span>
        </div>
      </app-demo-section>

      <app-demo-section title="Fan right" [code]="rightCode">
        <div style="padding: 1rem;">
          <cw-speed-dial [items]="items" direction="right" (itemClick)="last.set($event.label)" />
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class SpeedDialDemoComponent {
  readonly last = signal('—');

  items: CwSpeedDialItem[] = [
    { label: 'New', command: () => this.last.set('New') },
    { label: 'Share', command: () => this.last.set('Share') },
    { label: 'Upload', command: () => this.last.set('Upload') }
  ];

  code = `<cw-speed-dial [items]="[{ label: 'New' }, { label: 'Share' }]" direction="up" />`;
  rightCode = `<cw-speed-dial [items]="items" direction="right" />`;
}
