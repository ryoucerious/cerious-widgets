import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GridScrollerComponent } from './grid-scroller.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_SCROLL_SERVICE } from '../../tokens/grid-scroll-services.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridScrollService } from '../../interfaces/service-interfaces/grid-scroll.interface';

describe('GridScrollerComponent', () => {
  let component: GridScrollerComponent;
  let fixture: ComponentFixture<GridScrollerComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridScrollService: jasmine.SpyObj<IGridScrollService>;

  beforeEach(() => {
    mockGridService = jasmine.createSpyObj('IGridService', [
      'hasHorizontalScrollbar',
      'hasVerticalScrollbar',
      'moddedColumnWidth',
      'pinnedColumnWidth',
      'tableScrollHeight',
      'tableScrollWidth',
      'scrollbarHeight',
      'scrollbarSize',
      'gridOptions',
      'gridHeader',
      'gridBody',
      'gridScroller',
      'gridFooter',
      'scrollbarWidth'
    ]);

    mockGridScrollService = jasmine.createSpyObj('IGridScrollService', ['scrollDelta', 'scrollGrid']);

    TestBed.configureTestingModule({
      imports: [GridScrollerComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_SCROLL_SERVICE, useValue: mockGridScrollService },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return hasHorizontalScrollbar from gridService', () => {
    mockGridService.hasHorizontalScrollbar = true;
    expect(component.hasHorizontalScrollbar).toBeTrue();
  });

  it('should return hasVerticalScrollbar from gridService', () => {
    mockGridService.hasVerticalScrollbar = true;
    expect(component.hasVerticalScrollbar).toBeTrue();
  });

  it('should return moddedColumnWidth from gridService', () => {
    mockGridService.moddedColumnWidth = 100;
    expect(component.moddedColumnWidth).toBe(100);
  });

  it('should return pinnedColumnWidth from gridService', () => {
    mockGridService.pinnedColumnWidth = 50;
    expect(component.pinnedColumnWidth).toBe(50);
  });

  it('should return tableScrollHeight from gridService', () => {
    mockGridService.tableScrollHeight = 500;
    expect(component.tableScrollHeight).toBe(500);
  });

  it('should return tableScrollWidth from gridService', () => {
    mockGridService.tableScrollWidth = 1000;
    expect(component.tableScrollWidth).toBe(1000);
  });

  it('should return scrollDelta from gridScrollService', () => {
    const scrollDelta = { left: 10, top: 20 };
    mockGridScrollService.scrollDelta = scrollDelta;
    expect(component.scrollDelta).toEqual(scrollDelta);
  });

  it('should calculate scroll height correctly', () => {
    mockGridService.scrollbarHeight = 10;
    mockGridService.scrollbarSize = 15;
    expect(component.getScrollHeight()).toBe(15);

    mockGridService.scrollbarHeight = 0;
    expect(component.getScrollHeight()).toBe(0);
  });

  it('should calculate width adjustment correctly', () => {
    mockGridService.scrollbarSize = 20;
    mockGridService.hasVerticalScrollbar = true;
    expect(component.getWidth()).toBe(20);

    mockGridService.hasVerticalScrollbar = false;
    expect(component.getWidth()).toBe(0);
  });

  it('should handle scrollGrid correctly', () => {
    const event = { target: { scrollLeft: 100 } };
    const scrollDelta = { left: 0, top: 50 };
    mockGridScrollService.scrollDelta = scrollDelta;

    component.scrollGrid(event);

    expect(mockGridScrollService.scrollGrid).toHaveBeenCalledWith(
      event as any,
      { left: 100, top: 50 },
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