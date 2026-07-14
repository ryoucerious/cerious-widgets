import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CwTableColumn, TableColumnDirective, TableComponent, TagComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

interface Person {
  name: string;
  role: string;
  team: string;
  status: string;
  // Index signature so it satisfies the table's `Record<string, unknown>` bound.
  [key: string]: string;
}

@Component({
  selector: 'app-table-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, TableColumnDirective, TagComponent, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="table">
      <doc-tab label="Features">
        <doc-section title="Basic" description="Give it columns + value. A simpler, non-virtualized alternative to the Grid for straightforward tabular data." [code]="basicCode">
          <cw-table [columns]="cols" [value]="people" style="width: 100%;" />
        </doc-section>

        <doc-section title="Striped, hoverable & bordered" [code]="styleCode">
          <cw-table [columns]="cols" [value]="people" striped hoverable bordered style="width: 100%;" />
        </doc-section>

        <doc-section title="Sortable columns" description="Mark a column sortable and click its header to cycle ascending → descending → unsorted." [code]="sortCode">
          <cw-table [columns]="sortableCols" [value]="people" hoverable style="width: 100%;" />
        </doc-section>

        <doc-section title="Custom cell template" description="Render any cell with an [cwColumn] template keyed by field." [code]="templateCode">
          <cw-table [columns]="cols" [value]="people" hoverable style="width: 100%;">
            <ng-template cwColumn="status" let-value="value">
              <cw-tag [value]="value" [severity]="statusSeverity(value)" />
            </ng-template>
          </cw-table>
        </doc-section>

        <doc-section title="Sizes" [code]="sizeCode">
          <div style="display: flex; flex-direction: column; gap: 1.25rem; width: 100%;">
            <cw-table [columns]="cols" [value]="people.slice(0, 2)" size="small" bordered />
            <cw-table [columns]="cols" [value]="people.slice(0, 2)" size="large" bordered />
          </div>
        </doc-section>
      </doc-tab>

      <doc-tab label="API">
        <doc-api [props]="props" [events]="events" />
        <div style="margin-top: 1.5rem;"><doc-api [props]="columnProps" /></div>
      </doc-tab>

      <doc-tab label="Theming">
        <doc-theming [tokens]="tokens" />
      </doc-tab>
    </doc-page>
  `
})
export class TableDocComponent {
  readonly statusSeverity = (s: string): 'success' | 'warn' | 'danger' | 'neutral' =>
    s === 'Active' ? 'success' : s === 'Away' ? 'warn' : s === 'Offline' ? 'danger' : 'neutral';

  readonly cols: CwTableColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'role', header: 'Role' },
    { field: 'team', header: 'Team' },
    { field: 'status', header: 'Status' }
  ];
  readonly sortableCols: CwTableColumn[] = this.cols.map(c => ({ ...c, sortable: true }));

  readonly people: Person[] = [
    { name: 'Ada Lovelace', role: 'Engineer', team: 'Platform', status: 'Active' },
    { name: 'Grace Hopper', role: 'Architect', team: 'Compilers', status: 'Away' },
    { name: 'Linus Torvalds', role: 'Maintainer', team: 'Kernel', status: 'Active' },
    { name: 'Margaret Hamilton', role: 'Lead', team: 'Guidance', status: 'Offline' },
    { name: 'Katherine Johnson', role: 'Analyst', team: 'Trajectory', status: 'Active' }
  ];

  basicCode = `<cw-table [columns]="cols" [value]="rows" />

cols = [
  { field: 'name', header: 'Name' },
  { field: 'status', header: 'Status' }
];`;
  styleCode = `<cw-table [columns]="cols" [value]="rows" striped hoverable bordered />`;
  sortCode = `cols = [{ field: 'name', header: 'Name', sortable: true }, …];
<cw-table [columns]="cols" [value]="rows" />`;
  templateCode = `<cw-table [columns]="cols" [value]="rows">
  <ng-template cwColumn="status" let-value="value">
    <cw-tag [value]="value" />
  </ng-template>
</cw-table>`;
  sizeCode = `<cw-table [columns]="cols" [value]="rows" size="small" />
<cw-table [columns]="cols" [value]="rows" size="large" />`;

  props = [
    { name: 'columns', type: 'CwTableColumn[]', default: '[]', description: 'Column definitions ({ field, header, align?, sortable?, width? }).' },
    { name: 'value', type: 'T[]', default: '[]', description: 'Row data.' },
    { name: 'striped', type: 'boolean', default: 'false', description: 'Zebra-striped rows.' },
    { name: 'hoverable', type: 'boolean', default: 'false', description: 'Highlight rows on hover.' },
    { name: 'bordered', type: 'boolean', default: 'false', description: 'Outer border + column dividers.' },
    { name: 'size', type: `'small' | 'normal' | 'large'`, default: `'normal'`, description: 'Cell padding / density.' },
    { name: 'emptyMessage', type: 'string', default: `'No records found.'`, description: 'Text shown when there are no rows.' }
  ];
  events = [
    { name: 'sortChange', type: 'CwTableSort | null', description: 'Emitted when the sort column/order changes (null when cleared).' },
    { name: 'rowClick', type: 'T', description: 'Emitted with the row when a row is clicked.' }
  ];
  columnProps = [
    { name: 'field', type: 'string', default: ', ', description: 'Data property to read (and the sort key).' },
    { name: 'header', type: 'string', default: ', ', description: 'Header label.' },
    { name: 'sortable', type: 'boolean', default: 'false', description: 'Enable click-to-sort on the column.' },
    { name: 'align', type: `'left' | 'center' | 'right'`, default: `'left'`, description: 'Cell text alignment.' },
    { name: 'width', type: 'string', default: ', ', description: 'Fixed column width.' }
  ];
  tokens = [
    { token: '--cw-surface / --cw-surface-sunken', description: 'Table & header / striped-row backgrounds.' },
    { token: '--cw-border / --cw-border-strong', description: 'Row & header borders.' },
    { token: '--cw-surface-hover', description: 'Row hover background.' },
    { token: '--cw-primary', description: 'Active sort indicator.' },
    { token: '--cw-text-muted', description: 'Header label colour.' }
  ];
}
