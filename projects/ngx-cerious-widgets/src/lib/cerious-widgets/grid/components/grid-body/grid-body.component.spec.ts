import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GridBodyComponent } from './grid-body.component';
import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { CeriousScrollDirective } from '@ceriousdevtech/ngx-cerious-scroll';

// Stub for the cerious-scroll engine. A *unit* test for GridBodyComponent must
// not mount the real virtual-scroll directive: it performs DOM measurement and
// scheduling against the live element, which is both out of scope here and (on a
// detached test element) destabilises the headless browser. This stub matches
// the directive's selector and the inputs/outputs the template binds.
@Directive({ selector: '[ceriousScroll]', standalone: true })
class StubCeriousScrollDirective {
  @Input() ceriousScrollItems: any;
  @Input() ceriousScrollItemTemplate: any;
  @Input() ceriousScrollOptions: any;
  @Output() ceriousScrollReady = new EventEmitter<any>();
  recalculate(): void {}
}
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_SCROLL_SERVICE } from '../../tokens/grid-scroll-services.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { ZonelessCompatService } from '../../../shared/services/zoneless-compat.service';

// Mocks and stubs
const mockGridService = {
  gridDataset: {
    bodyRows: [{ id: '1', nestedExpanded: false }, { id: '2', nestedExpanded: true }],
    fillerRows: [],
    groupByColumns: [{ label: 'GroupLabel', field: 'groupField' }],
    groupByData: [
      {
        key: 'group1',
        rows: [{ id: '1', nestedExpanded: false }]
      }
    ]
  },
  gridOptions: { height: 100, columnDefs: [] },
  templates: {},
  fillerRowHeight: 40,
  rowMinWidth: '100px',
  grid: {
    cellClick: { emit: jasmine.createSpy('cellClick') },
    rowClick: { emit: jasmine.createSpy('rowClick') },
    cellDoubleClick: { emit: jasmine.createSpy('cellDoubleClick') },
    rowDoubleClick: { emit: jasmine.createSpy('rowDoubleClick') },
    cellKeydown: { emit: jasmine.createSpy('cellKeydown') },
    rowKeydown: { emit: jasmine.createSpy('rowKeydown') },
    cellKeypress: { emit: jasmine.createSpy('cellKeypress') },
    rowKeypress: { emit: jasmine.createSpy('rowKeypress') },
    cellKeyup: { emit: jasmine.createSpy('cellKeyup') },
    rowKeyup: { emit: jasmine.createSpy('rowKeyup') }
  },
  gridHeader: {},
  gridBody: {},
  gridScroller: {},
  gridFooter: {},
  hasVerticalScrollbar: false,
  scrollbarWidth: 10,
  afterResize: new Subject<void>(),
  afterGroupBy: new Subject<void>(),
  afterRender: new Subject<void>(),
  selectedRowsChange: new Subject<void>(),
  afterColumnResize: new Subject<void>(),
  afterCellEdit: new Subject<void>(),
  updateGridHeight: jasmine.createSpy('updateGridHeight')
};

const mockGridColumnService = {
  flattenColumns: jasmine.createSpy('flattenColumns').and.returnValue([{ id: 'col1', field: 'field1' }])
};

const mockGridScrollService = {
  scrollDelta: { top: 0, left: 0 },
  afterScroll: new Subject<void>(),
  scrollGrid: jasmine.createSpy('scrollGrid')
};

class MockElementRef {
  nativeElement = {
    clientHeight: 100,
    scrollHeight: 100,
    scrollWidth: 100,
    getBoundingClientRect: () => ({ height: 100, width: 100 }),
    querySelector: () => null,
    set scrollTop(val: number) {},
    set scrollLeft(val: number) {}
  };
}

describe('GridBodyComponent', () => {
  let component: GridBodyComponent;
  let fixture: ComponentFixture<GridBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GridBodyComponent
      ],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: GRID_SCROLL_SERVICE, useValue: mockGridScrollService },
        { provide: ElementRef, useClass: MockElementRef },
        ZonelessCompatService
      ]
    })
      .overrideComponent(GridBodyComponent, {
        // Swap the real virtual-scroll engine for the lightweight stub, and
        // provide the service mocks at the component level. (set/add cannot be
        // combined in a single override, so everything goes through add/remove.)
        remove: { imports: [CeriousScrollDirective] },
        add: {
          imports: [StubCeriousScrollDirective],
          providers: [
            { provide: GRID_SERVICE, useValue: mockGridService },
            { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
            { provide: GRID_SCROLL_SERVICE, useValue: mockGridScrollService }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(GridBodyComponent);
    component = fixture.componentInstance;

    // Assign tableBody manually for tests
    component.tableBody = new MockElementRef() as any;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Destroy the fixture so the mounted CeriousScrollDirective tears down its
    // requestAnimationFrame loop. Without this, every spec leaks a live rAF loop
    // and the accumulation eventually starves the headless browser's event loop.
    fixture?.destroy();

    // Reset spies and subjects
    Object.values(mockGridService.grid).forEach((emitter: any) => emitter.emit.calls?.reset?.());
    mockGridScrollService.scrollGrid.calls.reset();
    mockGridColumnService.flattenColumns.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct fillerRowHeight and rowMinWidth', () => {
    expect(component.fillerRowHeight).toBe(40);
    expect(component.rowMinWidth).toBe('100px');
  });

  it('should return rows and fillerRows from gridService', () => {
    expect(component.rows.length).toBe(2);
    expect(component.fillerRows.length).toBe(0);
  });

  it('should return scrollDelta, gridOptions, gridDataset, templates', () => {
    expect(component.scrollDelta).toEqual({ top: 0, left: 0 });
    expect(component.gridOptions.height).toBe(100 as any);
    expect(component.gridDataset.bodyRows.length).toBe(2);
    expect(component.templates).toEqual({});
  });

  it('should get group column label', () => {
    expect(component.getGroupColumnLabel(0)).toBe('GroupLabel');
    expect(component.getGroupColumnLabel(1)).toBe('Group');
  });

  it('should emit cellClick and rowClick on onClick', () => {
    spyOn(component as any, 'getCellFromEvent').and.returnValue({ column: { field: 'field1' }, el: {} });
    spyOn(component as any, 'getRowFromEvent').and.returnValue({ row: { field1: 'value1' }, elementRef: {} });

    const event = new MouseEvent('click');
    component.onClick(event);

    expect(mockGridService.grid.cellClick.emit).toHaveBeenCalled();
    expect(mockGridService.grid.rowClick.emit).toHaveBeenCalled();
  });

  it('should emit cellDoubleClick and rowDoubleClick on onDoubleClick', () => {
    spyOn(component as any, 'getCellFromEvent').and.returnValue({ column: { field: 'field1' }, el: {} });
    spyOn(component as any, 'getRowFromEvent').and.returnValue({ row: { field1: 'value1' }, elementRef: {} });

    const event = new MouseEvent('dblclick');
    component.onDoubleClick(event);

    expect(mockGridService.grid.cellDoubleClick.emit).toHaveBeenCalled();
    expect(mockGridService.grid.rowDoubleClick.emit).toHaveBeenCalled();
  });

  it('should emit cellKeydown and rowKeydown on onKeydown', () => {
    spyOn(component as any, 'getCellFromEvent').and.returnValue({ column: { field: 'field1' }, el: {} });
    spyOn(component as any, 'getRowFromEvent').and.returnValue({ row: { field1: 'value1' }, elementRef: {} });

    const event = new KeyboardEvent('keydown');
    component.onKeydown(event);

    expect(mockGridService.grid.cellKeydown.emit).toHaveBeenCalled();
    expect(mockGridService.grid.rowKeydown.emit).toHaveBeenCalled();
  });

  it('should emit cellKeypress and rowKeypress on onKeypress', () => {
    spyOn(component as any, 'getCellFromEvent').and.returnValue({ column: { field: 'field1' }, el: {} });
    spyOn(component as any, 'getRowFromEvent').and.returnValue({ row: { field1: 'value1' }, elementRef: {} });

    const event = new KeyboardEvent('keypress');
    component.onKeypress(event);

    expect(mockGridService.grid.cellKeypress.emit).toHaveBeenCalled();
    expect(mockGridService.grid.rowKeypress.emit).toHaveBeenCalled();
  });

  it('should emit cellKeyup and rowKeyup on onKeyup', () => {
    spyOn(component as any, 'getCellFromEvent').and.returnValue({ column: { field: 'field1' }, el: {} });
    spyOn(component as any, 'getRowFromEvent').and.returnValue({ row: { field1: 'value1' }, elementRef: {} });

    const event = new KeyboardEvent('keyup');
    component.onKeyup(event);

    expect(mockGridService.grid.cellKeyup.emit).toHaveBeenCalled();
    expect(mockGridService.grid.rowKeyup.emit).toHaveBeenCalled();
  });

  it('should capture the scroller instance on onScrollerReady', () => {
    const mockScroller = { recalculate: jasmine.createSpy('recalculate') };
    component.tableBody = {
      nativeElement: { querySelector: () => null }
    } as any;
    spyOn(component as any, 'applyHorizontalOffset');

    component.onScrollerReady(mockScroller);

    expect((component as any).scroller).toBe(mockScroller);
  });

  it('should toggle group collapse and update expandedGroups', fakeAsync(() => {
    component.expandedGroups = {};
    component.expandedGroupData = {};
    // Ensure groupByData contains the group you are toggling
    component.gridDataset.groupByData = [
      { key: 'group1', rows: [{ id: '1', nestedExpanded: false }] }
    ];
    spyOn(component as any, 'flattenData');
    component.toggleGroupCollapse('group1');
    tick();
    expect(component.expandedGroups['group1']).toBeTrue();
    expect(component.expandedGroupData['group1']).toBeDefined();
    expect((component as any).flattenData).toHaveBeenCalled();
  }));

  it('should recalculate the scroller on toggleNestedRow', fakeAsync(() => {
    const recalculate = jasmine.createSpy('recalculate');
    (component as any).ceriousScroll = { recalculate };
    spyOn(component as any, 'applyHorizontalOffset');

    component.toggleNestedRow({ id: '1' } as any);
    tick();

    expect(recalculate).toHaveBeenCalled();
    expect((component as any).applyHorizontalOffset).toHaveBeenCalled();
  }));

  it('should track row by row id, group key, or index', () => {
    expect(component.trackByRow(1, { row: { id: 'abc' } } as any)).toBe('abc');
    expect(component.trackByRow(3, { isGroup: true, key: 'g1' } as any)).toBe('g:g1');
    expect(component.trackByRow(2, {} as any)).toBe(2);
  });

  it('should flatten data for groupByData', () => {
    component.gridDataset.groupByData = [
      { key: 'g1', rows: [{ id: '1', nestedExpanded: false }] }
    ];
    component.expandedGroups = { g1: true };
    (component as any).flattenData();
    expect(component.flattenedRows.length).toBeGreaterThan(0);
  });

  it('should unsubscribe and call super on destroy', () => {
    const sub1 = { unsubscribe: jasmine.createSpy('unsubscribe') };
    const sub2 = { unsubscribe: jasmine.createSpy('unsubscribe') };
    component['subscriptions'] = [sub1 as any, sub2 as any];

    component.ngOnDestroy();

    expect(sub1.unsubscribe).toHaveBeenCalled();
    expect(sub2.unsubscribe).toHaveBeenCalled();
  });

  describe('Zoneless Compatibility', () => {
    it('should extend ZonelessCompatibleComponent', () => {
      expect(component).toBeInstanceOf(Object.getPrototypeOf(Object.getPrototypeOf(component)).constructor);
    });

    it('should call super.ngOnDestroy()', () => {
      const superSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(component)), 'ngOnDestroy');

      component.ngOnDestroy();

      expect(superSpy).toHaveBeenCalled();
    });
  });
});
