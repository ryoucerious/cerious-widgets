import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridHeaderRowComponent } from './grid-header-row.component';
import { ElementRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { ColumnDef } from '../../interfaces/column-def';

describe('GridHeaderRowComponent', () => {
  let component: GridHeaderRowComponent;
  let fixture: ComponentFixture<GridHeaderRowComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;

  beforeEach(() => {
    mockGridService = jasmine.createSpyObj('IGridService', [
      'getFeatureCount',
      'gridOptions',
      'hasHorizontalScrollbar',
      'hasVerticalScrollbar',
      'rowMinWidth',
      'scrollbarWidth',
      'pinnedColumns',
      'updateHeaderOrder',
    ]);
    mockGridColumnService = jasmine.createSpyObj('IGridColumnService', ['getFeatureColumnWidth', 'getColumnWidth']);

    TestBed.configureTestingModule({
      imports: [GridHeaderRowComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GridHeaderRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate featureColumnWidth correctly', () => {
    mockGridService.getFeatureCount.and.returnValue(2);
    mockGridService.gridOptions = { someOption: true } as any;
    mockGridColumnService.getFeatureColumnWidth.and.returnValue('50px');

    expect(component.featureColumnWidth).toBe('50px');
    expect(mockGridColumnService.getFeatureColumnWidth).toHaveBeenCalledWith(2, { someOption: true } as any);
  });

  it('should calculate column width correctly', () => {
    const column: ColumnDef = { id: 'col1' } as ColumnDef;
    mockGridColumnService.getColumnWidth.and.returnValue('100px');

    expect(component.getColumnWidth(column)).toBe('100px');
    expect(mockGridColumnService.getColumnWidth).toHaveBeenCalledWith(column, mockGridService.gridOptions);
  });

  it('should calculate colspan correctly', () => {
    const column: ColumnDef = {
      id: 'col1',
      children: [
        { id: 'child1' },
        { id: 'child2', children: [{ id: 'grandchild1' }] },
      ],
    } as ColumnDef;

    expect(component.getColspan(column)).toBe(2);
  });

  it('should create a new row correctly', () => {
    const column: ColumnDef = { id: 'col1', children: [{ id: 'child1' }] } as ColumnDef;
    const newRow = component.getNewRow(column);

    expect(newRow.columnDefs).toEqual([{ id: 'child1' } as ColumnDef]);
    expect(newRow.nestedExpanded).toBeFalse();
  });

  it('should calculate parent width correctly', () => {
    const column: ColumnDef = {
      id: 'col1',
      children: [
        { id: 'child1', visible: true },
        { id: 'child2', visible: true },
      ],
    } as ColumnDef;
    mockGridColumnService.getColumnWidth.and.returnValue('100px');

    expect(component.getParentWidth(column)).toBe('200px');
  });

  it('should calculate rowspan correctly', () => {
    const column: ColumnDef = { id: 'col1', children: [{ id: 'child1' }] } as ColumnDef;

    expect(component.getRowspan(column)).toBe(1);
  });

  it('should determine column visibility correctly when no children are visible', () => {
    const column: ColumnDef = {
      id: 'col1',
      visible: true,
      children: [{ id: 'child1', visible: false } as ColumnDef],
    } as ColumnDef;
  
    expect(component.shouldShowColumn(column)).toBeFalse();
  });

  it('should determine column visibility correctly when all children are visible', () => {
    const column: ColumnDef = {
      id: 'col1',
      visible: true,
      children: [{ id: 'child1', visible: true } as ColumnDef],
    } as ColumnDef;
  
    expect(component.shouldShowColumn(column)).toBeTruthy();
  });

  it('should determine column visibility correctly', () => {
    const column: ColumnDef = {
      id: 'col1',
      visible: true
    } as ColumnDef;
  
    expect(component.shouldShowColumn(column)).toBeTruthy();
  });

  it('should determine menu visibility correctly', () => {
    const column: ColumnDef = { id: 'col1', parent: undefined } as ColumnDef;

    expect(component.shouldShowMenu(column)).toBeTrue();
  });

  it('should calculate featureColumnWidth correctly', () => {
    mockGridService.getFeatureCount.and.returnValue(2);
    mockGridService.gridOptions = { someOption: true } as any;
    mockGridColumnService.getFeatureColumnWidth.and.returnValue('50px');
  
    expect(component.featureColumnWidth).toBe('50px');
    expect(mockGridColumnService.getFeatureColumnWidth).toHaveBeenCalledWith(2, { someOption: true } as any);
  });
  
  it('should return gridOptions from gridService', () => {
    mockGridService.gridOptions = { enableSorting: true } as any;
  
    expect(component.gridOptions).toEqual({ enableSorting: true } as any);
  });
  
  it('should determine if the grid has a horizontal scrollbar', () => {
    mockGridService.hasHorizontalScrollbar = true;
  
    expect(component.hasHorizontalScrollbar).toBeTrue();
  });
  
  it('should determine if the grid has row features', () => {
    mockGridService.getFeatureCount.and.returnValue(1);
  
    expect(component.hasRowFeatures).toBeTrue();
  
    mockGridService.getFeatureCount.and.returnValue(0);
  
    expect(component.hasRowFeatures).toBeFalse();
  });
  
  it('should determine if the grid has a vertical scrollbar', () => {
    mockGridService.hasVerticalScrollbar = true;
  
    expect(component.hasVerticalScrollbar).toBeTrue();
  
    mockGridService.hasVerticalScrollbar = false;
  
    expect(component.hasVerticalScrollbar).toBeFalse();
  });
  
  it('should calculate rowMinWidth correctly', () => {
    mockGridService.rowMinWidth = '200';
    mockGridService.hasVerticalScrollbar = true;
    mockGridService.scrollbarWidth = 15;
    mockGridService.getFeatureCount.and.returnValue(1);
    mockGridColumnService.getFeatureColumnWidth.and.returnValue('50');
  
    expect(component.rowMinWidth).toBe('165px'); // 200 + 15 - 50
  
    mockGridService.getFeatureCount.and.returnValue(0);
  
    expect(component.rowMinWidth).toBe('215px'); // 200 + 15
  });

  it('should return pinnedColumns from gridService', () => {
    mockGridService.pinnedColumns = ['col1', 'col2'] as any;
    expect(component.pinnedColumns).toEqual(['col1', 'col2'] as any);
  });

});
