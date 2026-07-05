import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwPageEvent, PaginatorComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-paginator-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginatorComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Paginator" description="A standalone pager: numbered window with ellipsis, page-size select and results summary.">
      <app-demo-section title="Basic" [code]="basicCode">
        <div style="width: 100%;">
          <cw-paginator [totalRecords]="200" [pageSize]="10" (pageChange)="onPage($event)" />
          <p style="color: var(--cw-text-muted); font-size: 0.875rem; margin-top: 0.75rem;">Last event: {{ lastEvent() }}</p>
        </div>
      </app-demo-section>

      <app-demo-section title="Without page-size select" [code]="noSizeCode">
        <div style="width: 100%;">
          <cw-paginator [totalRecords]="48" [pageSize]="10" [pageSizeOptions]="[]" />
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class PaginatorDemoComponent {
  readonly lastEvent = signal('—');

  onPage(event: CwPageEvent): void {
    this.lastEvent.set(`page ${event.page + 1}, size ${event.pageSize}`);
  }

  basicCode = `<cw-paginator [totalRecords]="200" [pageSize]="10" (pageChange)="load($event)" />`;
  noSizeCode = `<cw-paginator [totalRecords]="48" [pageSize]="10" [pageSizeOptions]="[]" />`;
}
