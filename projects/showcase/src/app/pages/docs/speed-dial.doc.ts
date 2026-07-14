import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwSpeedDialItem, SpeedDialComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-speed-dial-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpeedDialComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="speed-dial"><doc-tab label="Features">
      <doc-section title="Fan up" description="Click the button to reveal the actions." [code]="code">
        <div style="min-height: 12rem; display: flex; align-items: flex-end; padding: 1rem;">
          <cw-speed-dial [items]="items" direction="up" (itemClick)="last.set($event.label)" />
          <span style="margin-left: 1rem; color: var(--cw-text-muted); font-size: 0.875rem;">Last: {{ last() }}</span>
        </div>
      </doc-section>

      <doc-section title="Fan right" [code]="rightCode">
        <div style="padding: 1rem;">
          <cw-speed-dial [items]="items" direction="right" (itemClick)="last.set($event.label)" />
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class SpeedDialDocComponent {
  readonly apiProps = [
    { name: "items", type: "readonly CwSpeedDialItem[]", default: "[]", description: "The actions." },
    { name: "direction", type: "CwSpeedDialDirection", default: "'up'", description: "Fan-out direction." },
    { name: "gap", type: "number", default: "56", description: "Gap between fanned actions in px." },
    { name: "disabled", type: "boolean", default: "false", description: "Disable the whole dial." }
  ];
  readonly apiEvents = [
    { name: "itemClick", type: "CwSpeedDialItem", description: "Emitted when an action is activated." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-primary", description: "Primary / brand accent." },
    { token: "--cw-primary-hover", description: "Primary accent hover state." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-shadow-sm", description: "Subtle elevation shadow." }
  ];

  readonly last = signal(', ');

  items: CwSpeedDialItem[] = [
    { label: 'New', command: () => this.last.set('New') },
    { label: 'Share', command: () => this.last.set('Share') },
    { label: 'Upload', command: () => this.last.set('Upload') }
  ];

  code = `<cw-speed-dial [items]="[{ label: 'New' }, { label: 'Share' }]" direction="up" />`;
  rightCode = `<cw-speed-dial [items]="items" direction="right" />`;
}
