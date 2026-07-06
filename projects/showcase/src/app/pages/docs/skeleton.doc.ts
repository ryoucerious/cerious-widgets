import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-skeleton-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="skeleton"><doc-tab label="Features">
      <doc-section title="Shapes" [code]="shapeCode">
        <cw-skeleton width="10rem" height="1rem" />
        <cw-skeleton shape="circle" width="3rem" height="3rem" />
      </doc-section>

      <doc-section title="Card placeholder" description="Compose skeletons to preview a layout." [code]="cardCode">
        <div style="display: flex; align-items: center; gap: 1rem; width: 100%; max-width: 340px;">
          <cw-skeleton shape="circle" width="3rem" height="3rem" />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
            <cw-skeleton width="70%" height="0.85rem" />
            <cw-skeleton width="45%" height="0.85rem" />
          </div>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class SkeletonDocComponent {
  readonly apiProps = [
    { name: "width", type: "string", default: "'100%'", description: "Any CSS width (e.g. '100%', '12rem')." },
    { name: "height", type: "string", default: "'1rem'", description: "Any CSS height (e.g. '1rem')." },
    { name: "shape", type: "CwSkeletonShape", default: "'rect'", description: "Rectangle (default) or circle." },
    { name: "borderRadius", type: "string", default: "''", description: "Explicit border radius; ignored for circles." },
    { name: "animation", type: "boolean", default: "true", description: "Whether the shimmer animation plays." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-neutral-bg", description: "Themed via this token." }
  ];

  shapeCode = `<cw-skeleton width="10rem" height="1rem" />
<cw-skeleton shape="circle" width="3rem" height="3rem" />`;

  cardCode = `<cw-skeleton shape="circle" width="3rem" height="3rem" />
<cw-skeleton width="70%" height="0.85rem" />
<cw-skeleton width="45%" height="0.85rem" />`;
}
