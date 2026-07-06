import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwPageEvent, PaginatorComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-paginator-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginatorComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="paginator"><doc-tab label="Features">
      <doc-section title="Basic" [code]="basicCode">
        <div style="width: 100%;">
          <cw-paginator [totalRecords]="200" [pageSize]="10" (pageChange)="onPage($event)" />
          <p style="color: var(--cw-text-muted); font-size: 0.875rem; margin-top: 0.75rem;">Last event: {{ lastEvent() }}</p>
        </div>
      </doc-section>

      <doc-section title="Without page-size select" [code]="noSizeCode">
        <div style="width: 100%;">
          <cw-paginator [totalRecords]="48" [pageSize]="10" [pageSizeOptions]="[]" />
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class PaginatorDocComponent {
  readonly apiProps = [
    { name: "totalRecords", type: "number", default: "0", description: "Total number of rows being paged." },
    { name: "pageSize", type: "number", default: "10", description: "Initial rows per page." },
    { name: "pageSizeOptions", type: "readonly number[]", default: "[10", description: "Page-size choices; empty hides the select." },
    { name: "page", type: "number", default: "0", description: "Initial zero-based page." },
    { name: "windowSize", type: "number", default: "5", description: "How many numbered buttons to show at once." }
  ];
  readonly apiEvents = [
    { name: "pageChange", type: "CwPageEvent", description: "Emitted on every page or page-size change." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-raised", description: "Raised/overlay background." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-border-strong", description: "Emphasised border colour." },
    { token: "--cw-primary", description: "Primary / brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius-sm", description: "Small corner radius." }
  ];

  readonly lastEvent = signal('—');

  onPage(event: CwPageEvent): void {
    this.lastEvent.set(`page ${event.page + 1}, size ${event.pageSize}`);
  }

  basicCode = `<cw-paginator [totalRecords]="200" [pageSize]="10" (pageChange)="load($event)" />`;
  noSizeCode = `<cw-paginator [totalRecords]="48" [pageSize]="10" [pageSizeOptions]="[]" />`;
}
