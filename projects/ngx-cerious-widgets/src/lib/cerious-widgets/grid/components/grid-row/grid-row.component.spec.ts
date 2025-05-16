import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GridRowComponent } from './grid-row.component';
import { GridRow } from '../../models/grid-row';
import { GridRowColumnComponent } from '../grid-row-column/grid-row-column.component';
import { GridRowFeatureColumnComponent } from '../grid-row-feature-column/grid-row-feature-column.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';

describe('GridRowComponent', () => {
  let component: GridRowComponent;
  let fixture: ComponentFixture<GridRowComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;

  beforeEach(async () => {
    mockGridService = jasmine.createSpyObj('IGridService', [
      'getFeatureCount',
      'gridOptions',
      'hasHorizontalScrollbar',
      'hasVerticalScrollbar',
      'pinnedColumns',
    ]);
    mockGridColumnService = jasmine.createSpyObj('IGridColumnService', ['getFeatureColumnWidth', 'getColumnWidth']);

    await TestBed.configureTestingModule({
      declarations: [GridRowComponent, GridRowColumnComponent, GridRowFeatureColumnComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: ElementRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GridRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate featureColumnWidth using gridColumnService', () => {
    mockGridService.getFeatureCount.and.returnValue(2);
    mockGridService.gridOptions = { someOption: true } as any;
    mockGridColumnService.getFeatureColumnWidth.and.returnValue(100 as any);

    expect(component.featureColumnWidth).toBe(100 as any);
    expect(mockGridColumnService.getFeatureColumnWidth).toHaveBeenCalledWith(2, { someOption: true } as any);
  });

  it('should return hasHorizontalScrollbar from gridService', () => {
    mockGridService.hasHorizontalScrollbar = true;
    expect(component.hasHorizontalScrollbar).toBeTrue();
  });

  it('should return hasRowFeatures based on feature count', () => {
    mockGridService.getFeatureCount.and.returnValue(1);
    expect(component.hasRowFeatures).toBeTrue();

    mockGridService.getFeatureCount.and.returnValue(0);
    expect(component.hasRowFeatures).toBeFalse();
  });

  it('should return hasVerticalScrollbar from gridService', () => {
    mockGridService.hasVerticalScrollbar = false;
    expect(component.hasVerticalScrollbar).toBeFalse();
  });

  it('should return pinnedColumns from gridService', () => {
    mockGridService.pinnedColumns = ['col1', 'col2'] as any;
    expect(component.pinnedColumns).toEqual(['col1', 'col2'] as any);
  });

  it('should calculate column width using gridColumnService', () => {
    const columnDef = { id: 'col1' } as any;
    mockGridService.gridOptions = { someOption: true } as any;
    mockGridColumnService.getColumnWidth.and.returnValue(200 as any);

    expect(component.getColumnWidth(columnDef)).toBe(200 as any);
    expect(mockGridColumnService.getColumnWidth).toHaveBeenCalledWith(columnDef, { someOption: true } as any);
  });

  it('should emit toggleNestedRow event when toggleNestedRowValue is called', () => {
    spyOn(component.toggleNestedRow, 'emit');
    const gridRow = new GridRow({});

    component.toggleNestedRowValue(gridRow);

    expect(component.toggleNestedRow.emit).toHaveBeenCalledWith(gridRow);
  });
});
