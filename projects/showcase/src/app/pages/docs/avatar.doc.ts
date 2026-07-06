import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AvatarComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-avatar-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="avatar"><doc-tab label="Features">
      <doc-section title="Initials" [code]="labelCode">
        <cw-avatar label="JK" />
        <cw-avatar label="AB" />
        <cw-avatar label="MZ" />
      </doc-section>

      <doc-section title="Shapes" description="Circle (default) or square." [code]="shapeCode">
        <cw-avatar label="CW" />
        <cw-avatar label="CW" shape="square" />
      </doc-section>

      <doc-section title="Sizes" [code]="sizeCode">
        <cw-avatar label="S" size="small" />
        <cw-avatar label="M" />
        <cw-avatar label="L" size="large" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class AvatarDocComponent {
  readonly apiProps = [
    { name: "label", type: "string", default: "''", description: "Initials or short text shown when no image is provided." },
    { name: "image", type: "string", default: "''", description: "Image URL; takes precedence over label and icon." },
    { name: "icon", type: "string", default: "''", description: "Icon class shown when neither image nor label is provided." },
    { name: "size", type: "CwAvatarSize", default: "'normal'", description: "Visual size." },
    { name: "shape", type: "CwAvatarShape", default: "'circle'", description: "Circle (default) or square shape." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-font", description: "Font family." },
    { token: "--cw-neutral-bg", description: "Themed via this token." },
    { token: "--cw-neutral-fg", description: "Themed via this token." }
  ];

  labelCode = `<cw-avatar label="JK" />
<cw-avatar label="AB" />`;

  shapeCode = `<cw-avatar label="CW" />
<cw-avatar label="CW" shape="square" />`;

  sizeCode = `<cw-avatar label="S" size="small" />
<cw-avatar label="M" />
<cw-avatar label="L" size="large" />`;
}
