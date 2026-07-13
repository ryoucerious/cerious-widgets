import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbComponent, CwBreadcrumbItem } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-breadcrumb-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BreadcrumbComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="breadcrumb"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <cw-breadcrumb [items]="items" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class BreadcrumbDocComponent {
  readonly apiProps = [
    { name: "items", type: "readonly CwBreadcrumbItem[]", default: "[]", description: "The trail, in order; the last item is the current page." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-primary", description: "Primary / brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius-sm", description: "Small corner radius." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-font", description: "Font family." }
  ];

  items: CwBreadcrumbItem[] = [
    { label: 'Home', url: '#' },
    { label: 'Products', url: '#' },
    { label: 'Category', url: '#' },
    { label: 'Item' }
  ];

  basicCode = `items = [
  { label: 'Home', url: '/' },
  { label: 'Products', url: '/products' },
  { label: 'Category', url: '/products/cat' },
  { label: 'Item' }
];

<cw-breadcrumb [items]="items" />`;
}
