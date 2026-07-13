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

  it('sorts strings case-insensitively and numeric-strings numerically', () => {
    fixture.componentRef.setInput('columns', [{ field: 'code', header: 'Code', sortable: true }]);
    fixture.componentRef.setInput('value', [{ code: 'item10' }, { code: 'Item2' }, { code: 'item1' }]);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('th') as HTMLElement).click();
    fixture.detectChanges();
    // numeric-aware + case-insensitive: 1, 2, 10 (not lexicographic "10, 2, 1" or case-split)
    expect(cellsInColumn(0)).toEqual(['item1', 'Item2', 'item10']);
  });

  it('keeps null values last in both sort directions', () => {
    fixture.componentRef.setInput('columns', [{ field: 'age', header: 'Age', sortable: true }]);
    fixture.componentRef.setInput('value', [{ age: 30 }, { age: null }, { age: 10 }]);
    fixture.detectChanges();
    const th = fixture.nativeElement.querySelector('th') as HTMLElement;
    th.click(); fixture.detectChanges();              // asc
    expect(cellsInColumn(0)).toEqual(['10', '30', '']);
    th.click(); fixture.detectChanges();              // desc — null still last
    expect(cellsInColumn(0)).toEqual(['30', '10', '']);
  });

  it('sorts Date values chronologically', () => {
    fixture.componentRef.setInput('columns', [{ field: 'd', header: 'D', sortable: true }]);
    fixture.componentRef.setInput('value', [
      { d: new Date(2024, 0, 5) }, { d: new Date(2024, 0, 1) }, { d: new Date(2024, 0, 3) }
    ]);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('th') as HTMLElement).click();
    fixture.detectChanges();
    const days = (component.rows() as any[]).map(r => r.d.getDate());
    expect(days).toEqual([1, 3, 5]);
  });

  it('sorts via the keyboard (Enter on a sortable header)', () => {
    const ageHeader: HTMLElement = fixture.nativeElement.querySelectorAll('th')[1];
    expect(ageHeader.getAttribute('tabindex')).toBe('0');
    ageHeader.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(cellsInColumn(0)).toEqual(['Linus', 'Ada', 'Grace']);
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
