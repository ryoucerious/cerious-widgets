import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataViewComponent, DataViewItemDirective } from './data-view.component';

@Component({
  standalone: true,
  imports: [DataViewComponent, DataViewItemDirective],
  template: `
    <cw-data-view [value]="items" [layout]="layout" [rows]="rows" [virtualThreshold]="threshold">
      <ng-template cwDataViewItem let-item let-layout="layout">
        <span class="row">{{ item }} ({{ layout }})</span>
      </ng-template>
    </cw-data-view>
  `
})
class HostComponent {
  items: unknown[] = ['A', 'B', 'C'];
  layout: 'list' | 'grid' = 'list';
  rows = 0;
  threshold = 100;
}

describe('DataViewComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function rows(): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.row'), (el: any) => el.textContent.trim());
  }

  it('renders each item through the projected template with the layout', () => {
    expect(rows()).toEqual(['A (list)', 'B (list)', 'C (list)']);
  });

  it('switches to grid layout', () => {
    fixture.componentInstance.layout = 'grid';
    fixture.detectChanges();
    expect(rows()).toEqual(['A (grid)', 'B (grid)', 'C (grid)']);
    expect((fixture.nativeElement.querySelector('cw-data-view') as HTMLElement).getAttribute('data-layout')).toBe('grid');
  });

  it('paginates when rows is set', () => {
    fixture.componentInstance.items = Array.from({ length: 10 }, (_, i) => `Item ${i}`);
    fixture.componentInstance.rows = 4;
    fixture.detectChanges();

    expect(rows().length).toBe(4);
    expect(rows()[0]).toContain('Item 0');
    expect(fixture.nativeElement.querySelector('cw-paginator')).toBeTruthy();

    // Advance to page 2 via the paginator's next button.
    const nextBtn = Array.from(fixture.nativeElement.querySelectorAll('.cw-paginator__btn'))
      .find((b: any) => b.getAttribute('aria-label') === 'Next page') as HTMLButtonElement;
    nextBtn.click();
    fixture.detectChanges();
    expect(rows()[0]).toContain('Item 4');
  });

  it('shows the empty message when there are no items', () => {
    fixture.componentInstance.items = [];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cw-data-view__empty')).toBeTruthy();
  });

  it('virtualizes a large non-paginated list', async () => {
    fixture.componentInstance.items = Array.from({ length: 300 }, (_, i) => `Item ${i}`);
    fixture.componentInstance.threshold = 100;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cw-data-view__list--virtual cerious-scroll')).toBeTruthy();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    fixture.detectChanges();

    const rendered = rows().length;
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(200);
  });
});
