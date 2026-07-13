import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChipComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-chip-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChipComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="chip"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <cw-chip label="Angular" />
        <cw-chip label="TypeScript" />
        <cw-chip label="RxJS" />
      </doc-section>

      <doc-section title="Removable" description="The ✕ removes the chip and emits remove." [code]="removableCode">
        <cw-chip label="Filter: Active" removable />
        <cw-chip label="Region: EU" removable />
      </doc-section>

      <doc-section title="With image" [code]="imageCode">
        <cw-chip label="Olivia Rhye" image="https://i.pravatar.cc/40?img=1" removable />
        <cw-chip label="Phoenix Baker" image="https://i.pravatar.cc/40?img=2" removable />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class ChipDocComponent {
  readonly apiProps = [
    { name: "label", type: "string", default: "''", description: "The chip text." },
    { name: "image", type: "string", default: "''", description: "Optional leading image URL (rendered as a small round avatar)." },
    { name: "icon", type: "string", default: "''", description: "Optional leading icon class (used when no image is set)." },
    { name: "removable", type: "boolean", default: "false", description: "Show a ✕ button that removes the chip." }
  ];
  readonly apiEvents = [
    { name: "remove", type: "void", description: "Emitted when the ✕ button is clicked." }
  ];
  readonly themeTokens = [
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." },
    { token: "--cw-chip-bg", description: "Themed via this token." },
    { token: "--cw-neutral-bg", description: "Themed via this token." },
    { token: "--cw-chip-fg", description: "Themed via this token." },
    { token: "--cw-neutral-fg", description: "Themed via this token." }
  ];

  basicCode = `<cw-chip label="Angular" />`;
  removableCode = `<cw-chip label="Filter: Active" removable (remove)="onRemove()" />`;
  imageCode = `<cw-chip label="Olivia Rhye" image="olivia.png" removable />`;
}
