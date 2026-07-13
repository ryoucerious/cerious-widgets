import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, PopoverDirective } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-popover-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PopoverDirective, ButtonComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="popover"><doc-tab label="Features">
      <doc-section title="Basic" description="Click to open; click outside or press Esc to close." [code]="basicCode">
        <button cwButton [cwPopover]="menu">Open menu <span class="caret"></span></button>
        <ng-template #menu>
          <div class="pop-menu">
            @for (item of ['Profile', 'Settings', 'Sign out']; track item) {
              <div class="pop-menu__item">{{ item }}</div>
            }
          </div>
        </ng-template>
      </doc-section>

      <doc-section title="Placement" description="Position the panel on any side; it flips when there is no room." [code]="placementCode">
        <button cwButton variant="outlined" [cwPopover]="tip" cwPopoverPlacement="top">Top</button>
        <button cwButton variant="outlined" [cwPopover]="tip" cwPopoverPlacement="right">Right</button>
        <button cwButton variant="outlined" [cwPopover]="tip" cwPopoverPlacement="bottom">Bottom</button>
        <ng-template #tip>
          <div style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">A small anchored panel.</div>
        </ng-template>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `,
  styles: [`
    .pop-menu { min-width: 168px; display: flex; flex-direction: column; gap: 2px; font-size: 0.85rem; }
    .pop-menu__item { padding: 7px 10px; border-radius: var(--cw-radius); cursor: pointer; color: var(--cw-text); }
    .pop-menu__item:hover { background: var(--cw-surface-raised); }
    .caret { display: inline-block; width: 6px; height: 6px; margin-left: 5px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: translateY(-2px) rotate(45deg); }
  `]
})
export class PopoverDocComponent {
  readonly apiProps = [
    { name: "cwPopoverPlacement", type: "CwPopoverPlacement", default: "'bottom'", description: "Preferred placement relative to the host; flips when there is no room." },
    { name: "cwPopoverDisabled", type: "boolean", default: "false", description: "Disable opening entirely." }
  ];
  readonly apiEvents = [
    { name: "opened", type: "void", description: "Emits when the panel opens." },
    { name: "closed", type: "void", description: "Emits when the panel closes." }
  ];
  readonly themeTokens = [

  ];

  basicCode = `<button cwButton [cwPopover]="menu">Open menu</button>
<ng-template #menu> ...panel content... </ng-template>`;

  placementCode = `<button cwButton [cwPopover]="tip" cwPopoverPlacement="top">Top</button>
<button cwButton [cwPopover]="tip" cwPopoverPlacement="right">Right</button>`;
}
