import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GridPagerComponent } from './grid-pager.component';
import { ElementRef } from '@angular/core';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_SCROLL_SERVICE } from '../../tokens/grid-scroll-services.token';
import { Subject } from 'rxjs';

describe('GridPagerComponent', () => {
  let component: GridPagerComponent;
  let fixture: ComponentFixture<GridPagerComponent>;
  let mockGridService: any;
  let mockGridScrollService: any;
  let pageChangeSubject: Subject<void>;

  beforeEach(async () => {
    pageChangeSubject = new Subject<void>();

    mockGridService = {
      gridDataset: {
        pageData: [{}, {}, {}],
        pageNumber: 2,
        totalRowCount: 50,
        groupByColumns: ['col1']
      },
      gridOptions: {
        pageSize: 10
      },
      pageChange: pageChangeSubject.asObservable(),
      selectPage: jasmine.createSpy('selectPage'),
      gridHeader: {},
      gridBody: {},
      gridScroller: {},
      gridFooter: {},
      hasVerticalScrollbar: false,
      scrollbarWidth: 15
    };

    mockGridScrollService = {
      scrollGrid: jasmine.createSpy('scrollGrid')
    };

    await TestBed.configureTestingModule({
      declarations: [GridPagerComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_SCROLL_SERVICE, useValue: mockGridScrollService },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pagerInfo in constructor', () => {
    expect(component.pagerInfo).toEqual({ start: 0, end: 0, total: 0 });
  });

  it('should return gridDataset and gridOptions from gridService', () => {
    expect(component.gridDataset).toBe(mockGridService.gridDataset);
    expect(component.gridOptions).toBe(mockGridService.gridOptions);
  });

  it('should return true for hasGroupBy if groupByColumns exist', () => {
    expect(component.hasGroupBy).toBeTrue();
  });

  it('should update pagerInfo on pageChange after ngAfterViewInit', fakeAsync(() => {
    component.ngAfterViewInit();
    pageChangeSubject.next();
    tick(); // for setTimeout

    // pageNumber = 2, pageSize = 10, pageData.length = 3
    // start = ((2-1)*10)+1 = 11, end = 11+3-1 = 13, total = 50
    expect(component.pagerInfo).toEqual({ start: 11, end: 13, total: 50 });
  }));

  it('should not update pagerInfo if pageData is empty', fakeAsync(() => {
    mockGridService.gridDataset.pageData = [];
    component.ngAfterViewInit();
    pageChangeSubject.next();
    tick();
    // Should remain unchanged
    expect(component.pagerInfo).toEqual({ start: 0, end: 0, total: 0 });
  }));

  it('should call selectPage and scrollGrid on gridPageClick', () => {
    component.gridPageClick(3);
    expect(mockGridService.selectPage).toHaveBeenCalledWith(3);
    expect(mockGridScrollService.scrollGrid).toHaveBeenCalledWith(
      jasmine.any(Event),
      { top: 0, left: 0 },
      mockGridService.gridOptions,
      mockGridService.gridHeader,
      mockGridService.gridBody,
      mockGridService.gridScroller,
      mockGridService.gridFooter,
      mockGridService.hasVerticalScrollbar,
      mockGridService.scrollbarWidth
    );
  });
});