import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwPageEvent, PaginatorComponent } from './paginator.component';

describe('PaginatorComponent', () => {
  let fixture: ComponentFixture<PaginatorComponent>;
  let component: PaginatorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PaginatorComponent] }).compileComponents();
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('totalRecords', 200);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();
  });

  function buttons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-paginator__btn'));
  }
  function summary(): string {
    return (fixture.nativeElement.querySelector('.cw-paginator__summary') as HTMLElement).textContent!.trim();
  }

  it('computes the page count and summary', () => {
    expect(component.pageCount()).toBe(20);
    expect(summary()).toBe('Showing 1 to 10 of 200 results');
  });

  it('navigates and emits pageChange', () => {
    const events: CwPageEvent[] = [];
    component.pageChange.subscribe(e => events.push(e));

    // click "next" (the second-to-last button)
    const all = buttons();
    all[all.length - 2].click();
    fixture.detectChanges();

    expect(component.currentPage()).toBe(1);
    expect(events).toEqual([{ page: 1, pageSize: 10 }]);
    expect(summary()).toBe('Showing 11 to 20 of 200 results');
  });

  it('shows an ellipsis window for many pages and jumps to the last page', () => {
    const all = buttons();
    all[all.length - 1].click(); // » last
    fixture.detectChanges();

    expect(component.currentPage()).toBe(19);
    expect(fixture.nativeElement.querySelectorAll('.cw-paginator__ellipsis').length).toBeGreaterThan(0);
  });

  it('resets to page 0 on page-size change', () => {
    const events: CwPageEvent[] = [];
    component.pageChange.subscribe(e => events.push(e));
    component.goTo(5);

    const select = fixture.nativeElement.querySelector('.cw-paginator__size') as HTMLSelectElement;
    select.value = '50';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.currentPage()).toBe(0);
    expect(component.currentPageSize()).toBe(50);
    expect(component.pageCount()).toBe(4);
    expect(events[events.length - 1]).toEqual({ page: 0, pageSize: 50 });
  });

  it('disables prev/first on the first page', () => {
    expect(buttons()[0].disabled).toBeTrue();
    expect(buttons()[1].disabled).toBeTrue();
  });
});
