import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbComponent, CwBreadcrumbItem } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-breadcrumb-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BreadcrumbComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Breadcrumb" description="A navigation trail with chevron separators; the last item is the current page.">
      <app-demo-section title="Basic" [code]="basicCode">
        <cw-breadcrumb [items]="items" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class BreadcrumbDemoComponent {
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
