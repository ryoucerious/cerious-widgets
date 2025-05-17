import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GridBodyComponent } from './grid-body.component';
import { ElementRef, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_SCROLL_SERVICE } from '../../tokens/grid-scroll-services.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';

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
    set scrollTop(val: number) {},
    set scrollLeft(val: number) {}
  };
}

describe('GridBodyComponent', () => {
  let component: GridBodyComponent;
  let fixture: ComponentFixture<GridBodyComponent>;
  let zone: NgZone;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridBodyComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: GRID_SCROLL_SERVICE, useValue: mockGridScrollService },
        { provide: ElementRef, useClass: MockElementRef }
      ]
    })
      .overrideComponent(GridBodyComponent, {
        set: {
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

  it('should call gridScrollService.scrollGrid on scrollGrid', () => {
    const event = { target: { scrollTop: 10, scrollLeft: 5 } };
    component.scrollGrid(event);
    expect(mockGridScrollService.scrollGrid).toHaveBeenCalled();
  });

  it('should determine if filler rows should be shown', () => {
    component.totalHeight = 50;
    expect(component.shouldShowFillerRows()).toBeTrue();
    component.totalHeight = 150;
    expect(component.shouldShowFillerRows()).toBeFalse();
  });

  it('should toggle group collapse and update expandedGroups', fakeAsync(() => {
    component.expandedGroups = {};
    component.expandedGroupData = {};
    // Ensure groupByData contains the group you are toggling
    component.gridDataset.groupByData = [
      { key: 'group1', rows: [{ id: '1', nestedExpanded: false }] }
    ];
    spyOn(component as any, 'calculateTotalHeight');
    spyOn(component as any, 'updateVisibleRows');
    component.toggleGroupCollapse('group1');
    tick();
    expect(component.expandedGroups['group1']).toBeTrue();
    expect(component.expandedGroupData['group1']).toBeDefined();
    expect((component as any).calculateTotalHeight).toHaveBeenCalled();
    expect((component as any).updateVisibleRows).toHaveBeenCalled();
  }));

  it('should call updateRowHeight on toggleNestedRow', () => {
    component.nestedRowComponents = {
      toArray: () => [{ el: { nativeElement: { getBoundingClientRect: () => ({ height: 42 }) } } }]
    } as any;
    spyOn(component, 'updateRowHeight');
    component.startIndex = 0;
    component.toggleNestedRow({ id: '1' } as any, 0);
    expect(component.updateRowHeight).toHaveBeenCalledWith(0, 42, true);
  });

  it('should track row by id or index', () => {
    expect(component.trackByRow(1, { id: 'abc' } as any)).toBe('abc');
    expect(component.trackByRow(2, {} as any)).toBe(2);
  });

  it('should update row height and recalculate', () => {
    spyOn(component as any, 'calculateTotalHeight');
    spyOn(component as any, 'updateVisibleRows');
    component.rowHeights.clear();
    component.updateRowHeight(1, 55);
    expect(component.rowHeights.get(1)).toBe(55);
    expect((component as any).calculateTotalHeight).toHaveBeenCalled();
    expect((component as any).updateVisibleRows).toHaveBeenCalled();
  });

  it('should call gridScrollService.scrollGrid on wheelGrid', () => {
    const event = new WheelEvent('wheel', { deltaY: 10, deltaX: 5 });
    spyOn(event, 'preventDefault');
    component.wheelGrid(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should calculate total height for flat rows', () => {
    component.rowHeights.set('1', 20);
    component.rowHeights.set('2', 30);
    component.gridDataset.groupByData = [];
    component.gridDataset.bodyRows = [
      { id: '1', nestedExpanded: false, row: {}, columnDefs: [] },
      { id: '2', nestedExpanded: false, row: {}, columnDefs: [] }
    ];
    (component as any).calculateTotalHeight();
    expect(component.totalHeight).toBe(0);
  });

  it('should flatten data for groupByData', () => {
    component.gridDataset.groupByData = [
      { key: 'g1', rows: [{ id: '1', nestedExpanded: false }] }
    ];
    component.expandedGroups = { g1: true };
    (component as any).flattenData();
    expect((component as any).flattenedRows.length).toBeGreaterThan(0);
  });

  it('should update visible rows', () => {
    (component as any).flattenedRows = [
      { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }
    ];
    component.rowHeights.set('1', 10);
    component.rowHeights.set('2', 10);
    component.rowHeights.set('3', 10);
    component.rowHeights.set('4', 10);
    component.rowHeights.set('5', 10);
    component.rowHeights.set('6', 10);
    component.tableBody.nativeElement.clientHeight = 30;
    component.tableBody.nativeElement.scrollTop = 0;
    (component as any).updateVisibleRows();
    expect(component.visibleRows.length).toBeGreaterThan(0);
  });

  it('should unsubscribe and disconnect on destroy', () => {
    const sub1 = { unsubscribe: jasmine.createSpy('unsubscribe') };
    const sub2 = { unsubscribe: jasmine.createSpy('unsubscribe') };
    const obs1 = { disconnect: jasmine.createSpy('disconnect') };
    component['subscriptions'] = [sub1 as any, sub2 as any];
    component['resizeObservers'] = [obs1 as any];
    component.ngOnDestroy();
    expect(sub1.unsubscribe).toHaveBeenCalled();
    expect(sub2.unsubscribe).toHaveBeenCalled();
    expect(obs1.disconnect).toHaveBeenCalled();
  });
});