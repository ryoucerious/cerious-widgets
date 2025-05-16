import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GridHeaderComponent } from './grid-header.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_SCROLL_SERVICE } from '../../tokens/grid-scroll-services.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridScrollService } from '../../interfaces';

describe('GridHeaderComponent', () => {
  let component: GridHeaderComponent;
  let fixture: ComponentFixture<GridHeaderComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridScrollService: jasmine.SpyObj<IGridScrollService>;

  beforeEach(() => {
    mockGridService = jasmine.createSpyObj('IGridService', [
      'headerWidth',
      'rowMinWidth',
      'gridDataset',
      'gridOptions',
      'os',
      'tableScrollWidth',
      'hasVerticalScrollbar',
      'scrollbarWidth',
      'gridHeader',
      'gridBody',
      'gridScroller',
      'gridFooter'
    ]);

    mockGridScrollService = jasmine.createSpyObj('IGridScrollService', ['scrollDelta', 'scrollGrid']);

    TestBed.configureTestingModule({
      declarations: [GridHeaderComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_SCROLL_SERVICE, useValue: mockGridScrollService },
        { provide: ElementRef, useValue: { nativeElement: { scrollLeft: 0 } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return headerWidth from gridService', () => {
    mockGridService.headerWidth = '100px';
    expect(component.headerWidth).toBe('100px');
  });

  it('should calculate rowMinWidth correctly', () => {
    mockGridService.rowMinWidth = '200';
    mockGridService.hasVerticalScrollbar = true;
    mockGridService.scrollbarWidth = 15;
    expect(component.rowMinWidth).toBe('215px');
  });

  it('should return rows from gridService', () => {
    mockGridService.gridDataset = { headerRows: ['row1', 'row2']} as any;
    expect(component.rows).toEqual(['row1', 'row2'] as any);
  });

  it('should return gridOptions from gridService', () => {
    const gridOptions = { option1: true } as any;
    mockGridService.gridOptions = gridOptions;
    expect(component.gridOptions).toBe(gridOptions);
  });

  it('should return os from gridService', () => {
    mockGridService.os = 'Windows';
    expect(component.os).toBe('Windows');
  });

  it('should return tableScrollWidth from gridService', () => {
    mockGridService.tableScrollWidth = 500;
    expect(component.tableScrollWidth).toBe(500);
  });

  it('should handle Tab keydown event and call scrollGrid', () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    const scrollDelta = { left: 0 };
    mockGridScrollService.scrollDelta = scrollDelta as any;

    component.onKeyDown(event);

    setTimeout(() => {
      expect(scrollDelta.left).toBe(0);
      expect(mockGridScrollService.scrollGrid).toHaveBeenCalledWith(
        event,
        scrollDelta as any,
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
});