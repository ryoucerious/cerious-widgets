import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwTableColumn, TableColumnDirective, TableComponent } from './table.component';

const COLS: CwTableColumn[] = [
  { field: 'name', header: 'Name' },
  { field: 'age', header: 'Age', sortable: true, align: 'right' }
];
const DATA = [
  { name: 'Ada', age: 36 },
  { name: 'Grace', age: 45 },
  { name: 'Linus', age: 21 }
];

describe('TableComponent', () => {
  let fixture: ComponentFixture<TableComponent>;
  let component: TableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TableComponent] }).compileComponents();
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', COLS);
    fixture.componentRef.setInput('value', DATA);
    fixture.detectChanges();
  });

  function cellsInColumn(index: number): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll('tbody tr')).map(
      (tr: any) => tr.children[index].textContent.trim()
    );
  }

  it('renders headers and a row per record', () => {
    const headers = Array.from(fixture.nativeElement.querySelectorAll('th')).map((th: any) => th.textContent.trim());
    expect(headers[0]).toContain('Name');
    expect(headers[1]).toContain('Age');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(3);
  });

  it('reads cell values from the field', () => {
    expect(cellsInColumn(0)).toEqual(['Ada', 'Grace', 'Linus']);
  });

  it('sorts ascending, descending, then clears on repeated header clicks', () => {
    const ageHeader: HTMLElement = fixture.nativeElement.querySelectorAll('th')[1];

    ageHeader.click();
    fixture.detectChanges();
    expect(cellsInColumn(0)).toEqual(['Linus', 'Ada', 'Grace']); // 21, 36, 45

    ageHeader.click();
    fixture.detectChanges();
    expect(cellsInColumn(0)).toEqual(['Grace', 'Ada', 'Linus']); // 45, 36, 21

    ageHeader.click();
    fixture.detectChanges();
    expect(component.sort()).toBeNull();
    expect(cellsInColumn(0)).toEqual(['Ada', 'Grace', 'Linus']); // original order
  });

  it('does not sort a non-sortable column', () => {
    const nameHeader: HTMLElement = fixture.nativeElement.querySelectorAll('th')[0];
    nameHeader.click();
    fixture.detectChanges();
    expect(component.sort()).toBeNull();
  });

  it('emits rowClick with the row', () => {
    const rows: unknown[] = [];
    component.rowClick.subscribe(r => rows.push(r));
    fixture.nativeElement.querySelector('tbody tr').click();
    expect(rows[0]).toEqual(DATA[0]);
  });

  it('shows the empty message when there is no data', () => {
    fixture.componentRef.setInput('value', []);
    fixture.componentRef.setInput('emptyMessage', 'Nothing here');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cw-table__empty-row').textContent).toContain('Nothing here');
  });
});

@Component({
  standalone: true,
  imports: [TableComponent, TableColumnDirective],
  template: `
    <cw-table [columns]="cols" [value]="data">
      <ng-template cwColumn="name" let-value="value"><span class="custom">{{ value }}!</span></ng-template>
    </cw-table>
  `
})
class HostComponent {
  cols = COLS;
  data = DATA;
}

describe('TableComponent custom cell template', () => {
  it('renders a column via [cwColumn]', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
    const custom = fixture.nativeElement.querySelector('.custom');
    expect(custom.textContent).toBe('Ada!');
  });
});
